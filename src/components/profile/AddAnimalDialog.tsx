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
  Box,
  Avatar,
  Alert,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { type AnimalType, type CreateAnimalRequest, type Animal } from '../../models/user.model';
import { volunteerService } from '../../services/api/volunteer.service';
import { animalService } from '../../services/api/animal.service';
import { LocationPicker } from '../location/LocationPicker';

interface AddAnimalDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: CreateAnimalRequest) => Promise<void>;
  onUpdate?: (animalId: string, data: Partial<CreateAnimalRequest>) => Promise<void>;
  editingAnimal?: Animal | null;
}

export const AddAnimalDialog = ({ 
  open, 
  onClose, 
  onAdd, 
  onUpdate,
  editingAnimal = null 
}: AddAnimalDialogProps) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [locationText, setLocationText] = useState('');
  const [locationLat, setLocationLat] = useState<number | undefined>(undefined);
  const [locationLng, setLocationLng] = useState<number | undefined>(undefined);
  const [photoUrl, setPhotoUrl] = useState('');
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isEditing = !!editingAnimal;

  useEffect(() => {
    if (open && animalTypes.length === 0) {
      volunteerService.getAllAnimalTypes().then(setAnimalTypes).catch(console.error);
    }
  }, [open]);

  // Заполняем форму
  useEffect(() => {
    if (open) {
      if (editingAnimal) {
        setName(editingAnimal.name);
        setTypeId(editingAnimal.typeId);
        setDescription(editingAnimal.description || '');
        setAge(editingAnimal.age);
        setLocationText(editingAnimal.locationText || '');
        setLocationLat(editingAnimal.locationLat);
        setLocationLng(editingAnimal.locationLng);
        setPhotoUrl(editingAnimal.photoUrl || '');
        setUploadError(null);
      } else {
        setName('');
        setTypeId('');
        setDescription('');
        setAge('');
        setLocationText('');
        setLocationLat(undefined);
        setLocationLng(undefined);
        setPhotoUrl('');
        setUploadError(null);
      }
    }
  }, [open, editingAnimal]);

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setLocationLat(lat);
    setLocationLng(lng);
    setLocationText(address);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAnimal) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Файл слишком большой. Максимальный размер 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Пожалуйста, выберите изображение');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await animalService.uploadAnimalPhoto(editingAnimal.id, file);
      setPhotoUrl(result.photoUrl);
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      setUploadError(error.response?.data?.message || 'Ошибка загрузки фото');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !typeId || !age || !locationText.trim() || locationLat == null || locationLng == null) return;
    
    setIsLoading(true);
    try {
      if (isEditing && onUpdate && editingAnimal) {
        await onUpdate(editingAnimal.id, {
          name,
          type_id: Number(typeId),
          description,
          age: Number(age),
          location_text: locationText,
          location_lat: locationLat,
          location_lng: locationLng,
        });
      } else {
        const animalData: CreateAnimalRequest = {
          name,
          type_id: Number(typeId),
          description,
          age: Number(age),
          location_text: locationText,
          location_lat: locationLat,
          location_lng: locationLng,
        };
        await onAdd(animalData);
      }
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const initialCoordinates: [number, number] | null = 
    locationLat != null && locationLng != null
      ? [locationLat, locationLng]
      : null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Редактировать животное' : 'Добавить животное'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Фото — только при редактировании */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {isEditing && (
              <Avatar
                src={photoUrl || undefined}
                sx={{ width: 120, height: 120 }}
                variant="rounded"
              >
                {name?.[0]?.toUpperCase() || '?'}
              </Avatar>
            )}

            {isEditing && (
              <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<PhotoCamera />}
                disabled={isUploading}
              >
                {isUploading ? 'Загрузка...' : 'Сменить фото'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </Button>
            )}
            
            {uploadError && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {uploadError}
              </Alert>
            )}
          </Box>

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
          
          <Box>
            <LocationPicker
              initialCoordinates={initialCoordinates}
              initialAddress={locationText || ''}
              onLocationChange={handleLocationChange}
            />
          </Box>
          
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
          disabled={!name.trim() || !typeId || !age || !locationText.trim() || locationLat == null || locationLng == null || isLoading}
        >
          {isEditing ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};