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
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '12px', sm: '16px', md: '20px' },
            height: { xs: '95vh', sm: '92vh', md: '90vh' },
            m: { xs: 0.5, sm: 1 },
          }
        }
        
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        pb: { xs: 1, sm: 1.5, md: 2 },
        px: { xs: 1.5, sm: 2, md: 3 }
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600, 
            pr: { xs: 1, sm: 2 },
            fontSize: { xs: '16px', sm: '18px', md: '22px' },
            wordBreak: 'break-word'
          }}
        >
          {article.title}
        </Typography>
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <CloseIcon sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: 'auto', p: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Информация об авторе и дате */}
        <Box sx={{ 
          mb: { xs: 1.5, sm: 2.5, md: 3 }, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: { xs: 1, sm: 1.5, md: 2 } 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5, md: 2 } 
          }}>
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
              <Typography 
                variant="body1" 
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: '13px', sm: '14px', md: '16px' }
                }}
              >
                {article.author_name}
              </Typography>
              <Typography 
                variant="caption" 
                color="textSecondary"
                sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}
              >
                {formatDate(article.pub_time)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1 },
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            {article.categories.map(cat => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                sx={{ 
                  bgcolor: '#e8eaff', 
                  color: '#5242ba',
                  fontSize: { xs: '10px', sm: '11px', md: '12px' }
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 600, 
                pr: { xs: 1, sm: 1.5, md: 2 }, 
                textAlign: 'center',
                fontSize: { xs: '18px', sm: '22px', md: '28px' }
              }}
            >
                {article.title}
            </Typography>
        </Box>
        

        {/* Обложка */}
        {hasCoverImage && (
          <Box sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            textAlign: 'center' 
          }}>
            <Box
              component="img"
              src={article.cover_image!}
              alt={article.title}
              sx={{
                maxWidth: '100%',
                maxHeight: { xs: '250px', sm: '350px', md: '500px' },
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

        <Divider sx={{ my: { xs: 1, sm: 1.5, md: 2 } }} />

        {/* Содержимое статьи */}
        <Box
          className="article-content"
          dangerouslySetInnerHTML={createMarkup(article.content)}
          sx={{
            fontSize: { xs: '13px', sm: '14px', md: '16px' },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              margin: { xs: '0.75em 0', sm: '1em 0' },
            },
            '& p': {
              marginBottom: { xs: '0.75em', sm: '1em' },
              lineHeight: 1.6,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: { xs: '1em', sm: '1.5em' },
              marginBottom: { xs: '0.3em', sm: '0.5em' },
              fontSize: { xs: '0.9em', sm: 'inherit' },
            },
            '& ul, & ol': {
              paddingLeft: { xs: '1.5em', sm: '2em' },
              marginBottom: { xs: '0.75em', sm: '1em' },
            },
            '& li': {
              marginBottom: { xs: '0.3em', sm: '0.5em' },
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
              margin: { xs: '0.75em 0', sm: '1em 0' },
              paddingLeft: { xs: '0.75em', sm: '1em' },
              color: '#666',
              fontStyle: 'italic',
            },
            '& code': {
              backgroundColor: '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: { xs: '0.85em', sm: '0.9em' },
            },
            '& pre': {
              backgroundColor: '#f5f5f5',
              padding: { xs: '0.75em', sm: '1em' },
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: { xs: '11px', sm: '12px', md: '13px' },
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