import { Card, CardContent, Typography, Box, CardMedia, Chip, Button } from '@mui/material';
import { Pets, LocationOn, Cake, Visibility } from '@mui/icons-material';
import { type Animal } from '../../models/user.model';
import { useNavigate } from 'react-router-dom';

interface AnimalCardHorizontalProps {
  animal: Animal;
  showViewButton?: boolean;
}

export const AnimalCardHorizontal = ({ animal, showViewButton = true }: AnimalCardHorizontalProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/${animal.curatorId}`);
  };

  return (
    <Card sx={{ 
      display: 'flex',
      width: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3,
      },
    }}>
      {/* Большая картинка слева */}
      <Box sx={{ 
        width: { xs: '120px', sm: '200px', md: '250px' },
        flexShrink: 0,
        position: 'relative',
      }}>
        {animal.photoUrl ? (
          <CardMedia
            component="img"
            sx={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
            image={animal.photoUrl}
            alt={animal.name}
          />
        ) : (
          <Box sx={{ 
            height: '100%',
            width: '100%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: 150, sm: 200 },
          }}>
            <Pets sx={{ fontSize: 48, color: 'text.disabled' }} />
          </Box>
        )}
      </Box>

      {/* Данные справа */}
      <CardContent sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            {animal.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {animal.description || 'Нет описания'}
          </Typography>
        </Box>

        {showViewButton && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            onClick={handleViewProfile}
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          >
            Посмотреть куратора
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Вспомогательная функция для склонения возраста
function getAgeText(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return 'года';
  return 'лет';
}