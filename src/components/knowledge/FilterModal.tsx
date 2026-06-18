import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { FilterOptions, Category, Tag } from '../../models/knowledge.model';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  categories: Category[];
  tags: Tag[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  categories,
  tags
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(filters.category_id || '');
  const [selectedTag, setSelectedTag] = useState<string>(filters.tag_id || '');

  const handleApply = () => {
    onApplyFilters({
      category_id: selectedCategory || undefined,
      tag_id: selectedTag || undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedCategory('');
    setSelectedTag('');
    onApplyFilters({ category_id: undefined, tag_id: undefined });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: '12px', sm: '16px', md: '20px' },
            m: { xs: 1, sm: 2 },
          }
        }
        
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: { xs: '16px', sm: '18px', md: '20px' },
        p: { xs: 1.5, sm: 2 }
      }}>
        Фильтры
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <CloseIcon sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 2, sm: 2.5, md: 3 }
        }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>
              Категория
            </InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Категория"
              sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
            >
              <MenuItem value="" sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>
                Все категории
              </MenuItem>
              {categories.map((category) => (
                <MenuItem 
                  key={category.id} 
                  value={category.id}
                  sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>
              Тег
            </InputLabel>
            <Select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              label="Тег"
              sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
            >
              <MenuItem value="" sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>
                Все теги
              </MenuItem>
              {tags.map((tag) => (
                <MenuItem 
                  key={tag.id} 
                  value={tag.id}
                  sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
                >
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleClear} variant="outlined" color="error">
          Сбросить
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} variant="outlined">
            Отмена
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            sx={{ bgcolor: '#5242ba', '&:hover': { bgcolor: '#4135a0' } }}
          >
            Применить          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal;