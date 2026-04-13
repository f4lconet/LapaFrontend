import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { Search, Pets } from '@mui/icons-material';
import { AnimalCardHorizontal } from '../../components/animals/AnimalCardHorizontal';
import { animalService } from '../../services/api/animal.service';
import { volunteerService } from '../../services/api/volunteer.service';
import { type Animal, type AnimalType } from '../../models/user.model';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';

const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<number | ''>('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAnimals();
  }, [searchTerm, selectedType, animals]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [animalsData, typesData] = await Promise.all([
        animalService.getAllAnimals({ is_active: true }),
        volunteerService.getAllAnimalTypes(),
      ]);
      setAnimals(animalsData);
      setFilteredAnimals(animalsData);
      setAnimalTypes(typesData);
    } catch (err: any) {
      console.error('Error loading animals:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки животных');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAnimals = () => {
    let filtered = [...animals];

    if (searchTerm) {
      filtered = filtered.filter(animal =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(animal => animal.typeId === selectedType);
    }

    setFilteredAnimals(filtered);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <BurgerMenu />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Pets sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Животные
          </Typography>
          <Chip 
            label={`${filteredAnimals.length} ${getAnimalsCountText(filteredAnimals.length)}`}
            color="primary"
            size="small"
          />
        </Box>

        {/* Фильтры */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid sx={{xs: 12, md: 6}}>
            <TextField
                fullWidth
                placeholder="Поиск по имени или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                    ),
                }
                
            }}
            />
          </Grid>
          <Grid sx={{xs: 12, md: 6}}>
            <FormControl fullWidth>
              <InputLabel>Тип животного</InputLabel>
              <Select
                value={selectedType}
                label="Тип животного"
                onChange={(e) => setSelectedType(e.target.value as number | '')}
              >
                <MenuItem value="">Все</MenuItem>
                {animalTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Список животных - теперь в виде списка, а не сетки */}
        {filteredAnimals.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Pets sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Животные не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Попробуйте изменить параметры поиска
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredAnimals.map((animal) => (
              <AnimalCardHorizontal 
                key={animal.id} 
                animal={animal}
                showViewButton={true}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

// Вспомогательная функция для склонения
function getAnimalsCountText(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'животное';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'животных';
  return 'животных';
}

export default AnimalsPage;