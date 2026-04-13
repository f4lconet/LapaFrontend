import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { type AnimalType, type CreateAnimalRequest } from '../../models/user.model';
import { volunteerService } from '../../services/api/volunteer.service';

interface AddAnimalDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateAnimalRequest) => Promise<void>;
}

export const AddAnimalDialog = ({ open, onClose, onAdd }: AddAnimalDialogProps) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [locationText, setLocationText] = useState('');
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      volunteerService.getAllAnimalTypes().then(setAnimalTypes).catch(console.error);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim() || !typeId || !age || !locationText.trim()) return;
    
    setIsLoading(true);
    try {
      // Здесь нужно получить координаты с апи
      const mockLat = 55.751244;
      const mockLng = 37.618423;
      
      const animalData: CreateAnimalRequest = {
        name,
        type_id: Number(typeId),
        description,
        age: Number(age),
        location_text: locationText,
        location_lat: mockLat,
        location_lng: mockLng,
      };
      
      await onAdd(animalData);
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setTypeId('');
    setDescription('');
    setAge('');
    setLocationText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить животное</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Имя животного"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth required>
            <InputLabel>Тип животного</InputLabel>
            <Select value={typeId} label="Тип животного" onChange={(e) => setTypeId(e.target.value as number)}>
              {animalTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Возраст (в годах)"
            fullWidth
            required
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
          />
          <TextField
            label="Местоположение"
            fullWidth
            required
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="Город, район"
          />
          <TextField
            label="Описание"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!name.trim() || !typeId || !age || !locationText.trim() || isLoading}
        >
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};