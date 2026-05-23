import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Box,
  Avatar,
  Alert,
  Typography,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { type User, type UpdateProfileRequest } from '../../models/user.model';
import { LocationPicker } from './LocationPicker';

interface EditProfileDialogProps {
  open: boolean;
  user: User;
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: UpdateProfileRequest) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<string>;
}

export const EditProfileDialog = ({
  open,
  user,
  isLoading,
  onClose,
  onSave,
  onUploadAvatar,
}: EditProfileDialogProps) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: user.name,
    description: user.description || '',
    phone: user.phone || '',
    locationText: user.locationText || '',
    locationLat: user.locationLat || undefined,
    locationLng: user.locationLng || undefined,
    isUrgentAvailable: user.isUrgentAvailable || false,
  });
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        name: user.name,
        description: user.description || '',
        phone: user.phone || '',
        locationText: user.locationText || '',
        locationLat: user.locationLat || undefined,
        locationLng: user.locationLng || undefined,
        isUrgentAvailable: user.isUrgentAvailable || false,
      });
      setAvatarPreview(user.avatarUrl || '');
      setUploadError(null);
    }
  }, [open, user]);

  const handleChange = (field: keyof UpdateProfileRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSwitchChange = (field: keyof UpdateProfileRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      locationLat: lat,
      locationLng: lng,
      locationText: address,
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const avatarUrl = await onUploadAvatar(file);
      setAvatarPreview(avatarUrl);
      setFormData((prev) => ({ ...prev, avatarUrl: avatarUrl }));
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setUploadError(error.response?.data?.message || 'Ошибка загрузки аватара');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const initialCoordinates: [number, number] | null = 
    formData.locationLat != null && formData.locationLng != null
      ? [formData.locationLat, formData.locationLng]
      : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Редактирование профиля</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Avatar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={avatarPreview}
              sx={{ width: 100, height: 100 }}
            >
              {formData.name?.[0]?.toUpperCase()}
            </Avatar>
            <Button
              component="label"
              variant="outlined"
              size="small"
              startIcon={<PhotoCamera />}
              disabled={isUploading}
            >
              {isUploading ? 'Загрузка...' : 'Сменить аватар'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </Button>
            {uploadError && (
              <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
                {uploadError}
              </Alert>
            )}
          </Box>

          <TextField
            fullWidth
            label="Имя"
            value={formData.name || ''}
            onChange={handleChange('name')}
            required
          />
          
          <TextField
            fullWidth
            label="О себе"
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={handleChange('description')}
          />
          
          <TextField
            fullWidth
            label="Телефон"
            value={formData.phone || ''}
            onChange={handleChange('phone')}
            placeholder="+7 XXX XXX-XX-XX"
          />
          
          {/* Location Picker с картой */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Местоположение
            </Typography>
            <LocationPicker
              initialCoordinates={initialCoordinates}
              initialAddress={formData.locationText || ''}
              onLocationChange={handleLocationChange}
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isUrgentAvailable || false}
                onChange={handleSwitchChange('isUrgentAvailable')}
              />
            }
            label="Готов помогать в срочных ситуациях"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isLoading || isUploading || !formData.name?.trim()}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};