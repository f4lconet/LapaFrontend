import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { Article } from '../../models/knowledge.model';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ArticleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  if (!article) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  // Безопасно отображаем HTML контент
  const createMarkup = (content: string) => {
    return { __html: content };
  };

  const hasCoverImage = article.cover_image && article.cover_image.trim() !== '';

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          height: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        pb: 2
      }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, pr: 2 }}>
          {article.title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: 'auto' }}>
        {/* Информация об авторе и дате */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {article.author_avatar && (
              <img
                src={article.author_avatar}
                alt={article.author_name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            )}
            <Box>
              <Typography variant="body1" sx={{fontWeight: 500}}>
                {article.author_name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatDate(article.pub_time)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {article.categories.map(cat => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                sx={{ bgcolor: '#e8eaff', color: '#5242ba' }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{mb: 4}}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 600, pr: 2, textAlign: 'center' }}>
                {article.title}
            </Typography>
        </Box>
        

        {/* Обложка */}
        {hasCoverImage && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <img
              src={article.cover_image!}
              alt={article.title}
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              onError={(e) => {
                (e.currentTarget).style.display = 'none';
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Содержимое статьи */}
        <Box
          className="article-content"
          dangerouslySetInnerHTML={createMarkup(article.content)}
          sx={{
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              margin: '1em 0',
            },
            '& p': {
              marginBottom: '1em',
              lineHeight: 1.6,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            '& ul, & ol': {
              paddingLeft: '2em',
              marginBottom: '1em',
            },
            '& li': {
              marginBottom: '0.5em',
            },
            '& a': {
              color: '#5242ba',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& blockquote': {
              borderLeft: '4px solid #5242ba',
              margin: '1em 0',
              paddingLeft: '1em',
              color: '#666',
              fontStyle: 'italic',
            },
            '& code': {
              backgroundColor: '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: '#f5f5f5',
              padding: '1em',
              borderRadius: '8px',
              overflow: 'auto',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
          }}
        />

        {article.tags.length !== 0 && (
            <Box sx={{ borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
                {article.tags.map(tag => (
                    <Chip
                    key={tag.id}
                    label={tag.name}
                    size="small"
                    sx={{ mr: '5px' }}
                    />
                ))}
            </Box>
        )}
        
      </DialogContent>
    </Dialog>
  );
};

export default ArticleViewModal;