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
  onClick?: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'vertical',
  isAdmin = false,
  onEdit,
  onDelete,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    
    const plainText = text
      .replace(/<(br|hr)[^>]*>/gi, '\n')           // <br> и <hr> → перенос строки
      .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n') // закрывающие теги блоков → перенос
      .replace(/<[^>]*>/g, ' ')                     // остальные теги → пробел
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n\s+/g, '\n')                      // убираем пробелы после переносов
      .replace(/[ \t]+/g, ' ')                      // множественные пробелы → один
      .replace(/\n{3,}/g, '\n\n')                   // максимум 2 переноса подряд
      .trim();
    
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    const truncated = plainText.substring(0, maxLength);
    const lastNewline = truncated.lastIndexOf('\n');
    const lastSpace = truncated.lastIndexOf(' ');
    const cutAt = Math.max(lastNewline, lastSpace);
    
    return (cutAt > 0 ? truncated.substring(0, cutAt) : truncated) + '...';
  };

  const hasCoverImage = article.cover_image && article.cover_image.trim() !== '';

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.article-actions')) {
      return;
    }
    onClick?.(article);
  };

  if (variant === 'horizontal') {
    return (
      <Paper
        onClick={handleCardClick}
        sx={{
          display: { xs: 'flex', sm: 'flex' },
          flexDirection: { xs: 'column', sm: 'row' },
          bgcolor: 'rgba(251, 252, 255, 1)',
          borderRadius: '20px',
          overflow: 'hidden',
          gap: { xs: 2, sm: 3 },
          p: { xs: 2, sm: 3 },
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        {/* Показываем изображение только если оно есть */}
        {hasCoverImage && (
          <Box sx={{ 
            flexShrink: 0, 
            width: { xs: '100%', sm: '400px', md: '562px' }, 
            height: { xs: '200px', sm: '280px', md: '405px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
        
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
          <Typography 
            variant="caption" 
            color="textSecondary"
            sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}
          >
            {formatDate(article.pub_time)}
          </Typography>
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{ 
              fontWeight: 600,
              fontSize: { xs: '16px', sm: '18px', md: '20px' }
            }}
          >
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
      onClick={handleCardClick}
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: { xs: 2, sm: 4, md: 6 },
        },
        boxShadow: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Показываем изображение только если оно есть */}
      {hasCoverImage && (
        <CardMedia
          component="img"
          image={article.cover_image!}
          alt={article.title}
          sx={{
            objectFit: 'cover',
            height: {
              xs: '160px',
              sm: '200px',
              md: '217px'
            }
          }}
          onError={(e) => {
            // При ошибке загрузки скрываем компонент
            (e.currentTarget).style.display = 'none';
          }}
        />
      )}
      
      <CardContent sx={{ 
        flex: 1, 
        p: { xs: '12px', sm: '16px', md: '16px' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 0.5, sm: 1, md: 1 },
      }}>
        <Typography 
          variant="caption" 
          color="textSecondary"
          sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}
        >
          {formatDate(article.pub_time)}
        </Typography>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 600, 
            mt: 0,
            mb: 0,
            fontSize: { xs: '14px', sm: '16px', md: '18px' }
          }}
        >
          {article.title}
        </Typography>
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            mb: 1,
            fontSize: { xs: '12px', sm: '13px', md: '14px' }
          }}
        >
          {truncateText(article.content, 100)}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 }, mb: 1 }}>
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