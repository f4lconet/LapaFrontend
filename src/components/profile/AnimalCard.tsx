import { Card, CardContent, Typography, Box, IconButton, CardMedia, Chip, Button } from '@mui/material';
import { DeleteOutlined, Edit, Pets, LocationOn, Cake, OpenInNew } from '@mui/icons-material';
import { type Animal } from '../../models/user.model';

interface AnimalCardProps {
  animal: Animal;
  onDelete?: (id: string) => void;
  onEdit?: (animal: Animal) => void;
  isOwnProfile: boolean;
}

export const AnimalCard = ({ animal, onDelete, onEdit, isOwnProfile }: AnimalCardProps) => {
  const handleDelete = () => {
    if (onDelete && window.confirm(`Удалить животное "${animal.name}"?`)) {
      onDelete(animal.id);
    }
  };

  const handleOpenMap = () => {
    if (animal.locationLat != null && animal.locationLng != null) {
      const url = `https://yandex.ru/maps/?ll=${animal.locationLng},${animal.locationLat}&z=15&pt=${animal.locationLng},${animal.locationLat}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card sx={{ minWidth: 280, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {animal.photoUrl ? (
        <CardMedia
          component="img"
          height="200"
          image={animal.photoUrl}
          alt={animal.name}
        />
      ) : (
        <Box sx={{ height: 200, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Pets fontSize="large" color="disabled" />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {animal.name}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip 
            icon={<Cake fontSize="small" />} 
            label={`${animal.age} ${getAgeText(animal.age)}`} 
            size="small" 
            variant="outlined"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip 
              icon={<LocationOn fontSize="small" />} 
              label={animal.locationText} 
              size="small" 
              variant="outlined"
            />
            {animal.locationLat != null && animal.locationLng != null && (
              <Button
                size="small"
                variant="outlined"
                onClick={handleOpenMap}
                sx={{ minWidth: 'auto', px: 1, fontSize: '0.7rem' }}
              >
                <OpenInNew fontSize="small" />
              </Button>
            )}
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {animal.description || 'Нет описания'}
        </Typography>
      </CardContent>
      
      {isOwnProfile && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
          {onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(animal)}
              sx={{ bgcolor: 'background.paper' }}
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{ bgcolor: 'background.paper' }}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Card>
  );
};

function getAgeText(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return 'года';
  return 'лет';
}