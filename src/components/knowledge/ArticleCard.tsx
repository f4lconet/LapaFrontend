import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import type { Article } from '../../models/knowledge.model';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
  variant?: 'horizontal' | 'vertical';
  isAdmin?: boolean;
  onEdit?: (article: Article) => void;
  onDelete?: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'vertical',
  isAdmin = false,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Проверяем, есть ли обложка и не является ли она пустой строкой
  const hasCoverImage = article.cover_image && article.cover_image.trim() !== '';

  if (variant === 'horizontal') {
    return (
      <Paper
        sx={{
          display: 'flex',
          bgcolor: 'rgba(251, 252, 255, 1)',
          borderRadius: '20px',
          overflow: 'hidden',
          gap: 3,
          p: 3,
        }}
      >
        {/* Показываем изображение только если оно есть */}
        {hasCoverImage && (
          <Box sx={{ flexShrink: 0, width: '562px', height: '405px' }}>
            <img
              src={article.cover_image!}
              alt={article.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '20px',
                border: '1px solid #000',
              }}
              onError={(e) => {
                // Если ошибка загрузки, скрываем изображение
                (e.currentTarget).style.display = 'none';
              }}
            />
          </Box>
        )}
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="caption" color="textSecondary">
            {formatDate(article.pub_time)}
          </Typography>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {truncateText(article.content, 200)}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {article.categories.map(cat => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                sx={{ bgcolor: '#e8eaff', color: '#5242ba' }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {article.tags.map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => onEdit?.(article)}
                sx={{ bgcolor: '#5242ba', '&:hover': { bgcolor: '#4135a0' } }}
              >
                Изменить
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => onDelete?.(article)}
              >
                Удалить
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      {/* Показываем изображение только если оно есть */}
      {hasCoverImage && (
        <CardMedia
          component="img"
          height="217"
          image={article.cover_image!}
          alt={article.title}
          sx={{
            objectFit: 'cover',
          }}
          onError={(e) => {
            // При ошибке загрузки скрываем компонент
            (e.currentTarget).style.display = 'none';
          }}
        />
      )}
      
      <CardContent sx={{ flex: 1, p: 2 }}>
        <Typography variant="caption" color="textSecondary">
          {formatDate(article.pub_time)}
        </Typography>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mt: 1, mb: 1 }}>
          {article.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {truncateText(article.content, 100)}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {article.categories.map(cat => (
            <Chip
              key={cat.id}
              label={cat.name}
              size="small"
              sx={{ bgcolor: '#e8eaff', color: '#5242ba' }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {article.tags.map(tag => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
        {isAdmin && (
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => onEdit?.(article)}
              sx={{ bgcolor: '#5242ba', '&:hover': { bgcolor: '#4135a0' } }}
            >
              Изменить
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              onClick={() => onDelete?.(article)}
            >
              Удалить
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleCard;