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
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Фильтры
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Категория"
            >
              <MenuItem value="">Все категории</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Тег</InputLabel>
            <Select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              label="Тег"
            >
              <MenuItem value="">Все теги</MenuItem>
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
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