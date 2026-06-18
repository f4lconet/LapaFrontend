import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => Promise<void>;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) return;
    
    setLoading(true);
    try {
      await onAdd(categoryName);
      setCategoryName('');
      onClose();
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      setLoading(false);
    }
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
        Добавить категорию
        <IconButton 
          onClick={onClose} 
          size="small"
          sx={{ minWidth: 'auto' }}
        >
          <CloseIcon sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <TextField
          autoFocus
          label="Название категории"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          fullWidth
          placeholder="Например: Помощь животным"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{ fontSize: { xs: '13px', sm: '14px', md: '16px' } }}
        />
      </DialogContent>

      <DialogActions sx={{ 
        p: { xs: 1, sm: 1.5, md: 2 },
        gap: { xs: 0.5, sm: 1 }
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
        >
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!categoryName.trim() || loading}
          sx={{ 
            bgcolor: '#5242ba', 
            '&:hover': { bgcolor: '#4135a0' },
            fontSize: { xs: '12px', sm: '13px', md: '14px' }
          }}
        >
          {loading ? 'Добавление...' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;