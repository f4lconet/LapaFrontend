import { Grid, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { type Animal } from '../../models/user.model';
import { AnimalCard } from './AnimalCard';

interface AnimalListProps {
  animals: Animal[];
  isLoading: boolean;
  isOwnProfile: boolean;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
}

export const AnimalList = ({ animals, isLoading, isOwnProfile, onAdd, onDelete }: AnimalListProps) => {
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

  if (!animals || animals.length === 0) {
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
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {isOwnProfile ? 'У вас пока нет добавленных животных' : 'Животные не добавлены'}
        </Typography>
      </Box>
    );
  }

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

      <Grid container spacing={2}>
        {animals.map((animal) => (
          <Grid sx={{xs: 12, sm: 6, md: 4}} key={animal.id}>
            <AnimalCard animal={animal} onDelete={onDelete} isOwnProfile={isOwnProfile} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};