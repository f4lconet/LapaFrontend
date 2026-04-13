import { Card, CardContent, Typography, Box, IconButton, CardMedia, Chip } from '@mui/material';
import { DeleteOutlined, Pets, LocationOn, Cake } from '@mui/icons-material';
import { type Animal } from '../../models/user.model';

interface AnimalCardProps {
  animal: Animal;
  onDelete?: (id: string) => void;
  isOwnProfile: boolean;
}

export const AnimalCard = ({ animal, onDelete, isOwnProfile }: AnimalCardProps) => {
  const handleDelete = () => {
    if (onDelete && window.confirm(`Удалить животное "${animal.name}"?`)) {
      onDelete(animal.id);
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
        
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<Cake fontSize="small" />} 
            label={`${animal.age} ${getAgeText(animal.age)}`} 
            size="small" 
            variant="outlined"
          />
          <Chip 
            icon={<LocationOn fontSize="small" />} 
            label={animal.locationText} 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {animal.description || 'Нет описания'}
        </Typography>
      </CardContent>
      
      {isOwnProfile && onDelete && (
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
        >
          <DeleteOutlined fontSize="small" />
        </IconButton>
      )}
    </Card>
  );
};

// Вспомогательная функция для склонения возраста
function getAgeText(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return 'года';
  return 'лет';
}