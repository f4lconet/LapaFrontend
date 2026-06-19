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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Pets } from '@mui/icons-material';
import { animalService } from '../../services/api/animal.service';
import { volunteerService } from '../../services/api/volunteer.service';
import { type Animal, type AnimalType } from '../../models/user.model';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { AnimalCard } from '../../components/profile/AnimalCard';

const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<number | ''>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [animalsData, typesData] = await Promise.all([
        animalService.getAllAnimals({ is_active: true }),
        volunteerService.getAllAnimalTypes(),
      ]);
      setAnimals(animalsData);
      setAnimalTypes(typesData);
    } catch (err: any) {
      console.error('Error loading animals:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки животных');
    } finally {
      setIsLoading(false);
    }
  };

  // Фильтрация вычисляется на лету, без отдельного state
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = !searchTerm || 
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || animal.typeId === selectedType;
    return matchesSearch && matchesType;
  });

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
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" component="h1">
            Животные
          </Typography>
        </Box>

        {/* Фильтры */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 5 }}>
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

          <FormControl sx={{ maxWidth: '160px', width: '100%' }}>
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
        </Box>

        {/* Список животных */}
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
          <Grid container sx={{ justifyContent: 'center', gap: 3 }}>
            {filteredAnimals.map((animal) => (
              <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={animal.id}>
                <AnimalCard
                  animal={animal}
                  isOwnProfile={false}
                  showCuratorButton={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default AnimalsPage;
