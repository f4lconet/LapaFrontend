import { Grid, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { type Animal } from '../../models/user.model';
import { AnimalCard } from './AnimalCard';

interface AnimalListProps {
  animals: Animal[];
  isLoading: boolean;
  isOwnProfile: boolean;
  onAdd?: () => void;
  onEdit?: (animal: Animal) => void;
  onDelete?: (id: string) => void;
}

export const AnimalList = ({ animals, isLoading, isOwnProfile, onAdd, onEdit, onDelete }: AnimalListProps) => {
  if (isLoading) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Животные</Typography>
          {isOwnProfile && onAdd && (
            <Button startIcon={<Add />} variant="outlined" size="small" onClick={onAdd}>
              Добавить
            </Button>
          )}
        </Box>
        <Typography>Загрузка животных...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
        gap: { xs: 1, sm: 1.5 }
      }}>
        <Typography 
          variant="h6"
          sx={{ fontSize: { xs: '16px', sm: '18px', md: '20px' }, mb: { xs: 1.5, sm: 2 } }}
        >
          Животные
        </Typography>
        {isOwnProfile && onAdd && (
          <Button 
            startIcon={<Add />} 
            variant="contained" 
            size="small" 
            onClick={onAdd}
            sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
          >
            Добавить животное
          </Button>
        )}
      </Box>

      {!animals || animals.length === 0 ? (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            py: { xs: 2, sm: 3, md: 4 }, 
            textAlign: 'center',
            fontSize: { xs: '12px', sm: '13px', md: '14px' }
          }}
        >
          {isOwnProfile ? 'У вас пока нет добавленных животных' : 'Животные не добавлены'}
        </Typography>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ justifyContent: 'center' }}>
          {animals.map((animal) => (
            <Grid sx={{xs: 12, sm: 6, md: 4}} key={animal.id}>
              <AnimalCard 
                animal={animal} 
                onDelete={onDelete} 
                onEdit={onEdit}
                isOwnProfile={isOwnProfile}
                showCuratorButton={false} 
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};