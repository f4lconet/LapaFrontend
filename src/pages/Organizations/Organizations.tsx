import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Avatar,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import { Search, Business, Phone, Email, LocationOn, Verified, Pets, Assignment } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { useNavigate } from 'react-router-dom';

// Временный тип для организации
interface Organization {
  id: string;
  name: string;
  email: string;
  description: string;
  phone: string;
  location_text: string;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
  animals_count?: number;
  tasks_count?: number;
}

// Временные данные для демонстрации
const mockOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Приют "Доброе сердце"',
    email: 'info@goodheart.ru',
    description: 'Помогаем бездомным животным уже 10 лет. Ищем волонтеров для выгула собак, уборки и помощи в лечении.',
    phone: '+7 (495) 123-45-67',
    location_text: 'Москва, ул. Ленина 15',
    avatar_url: '',
    is_active: true,
    created_at: '2020-01-15',
    animals_count: 25,
    tasks_count: 8,
  },
  {
    id: '2',
    name: 'Кошкин дом',
    email: 'help@cat-house.ru',
    description: 'Центр помощи кошкам. Требуются волонтеры для ухода, социализации и поиска новых хозяев.',
    phone: '+7 (812) 987-65-43',
    location_text: 'Санкт-Петербург, Невский пр. 25',
    avatar_url: '',
    is_active: true,
    created_at: '2018-05-20',
    animals_count: 42,
    tasks_count: 12,
  },
  {
    id: '3',
    name: 'Зоозащита Екатеринбурга',
    email: 'ekb@zoozashita.ru',
    description: 'Защита прав животных, помощь приютам, организация стерилизации.',
    phone: '+7 (343) 555-12-34',
    location_text: 'Екатеринбург, ул. Малышева 51',
    avatar_url: '',
    is_active: true,
    created_at: '2019-08-10',
    animals_count: 18,
    tasks_count: 5,
  },
  {
    id: '4',
    name: 'Хвостатые друзья',
    email: 'friends@tailfriends.ru',
    description: 'Приют для собак и кошек. Нужна помощь в выгуле, кормлении и благоустройстве территории.',
    phone: '+7 (383) 222-33-44',
    location_text: 'Новосибирск, ул. Пушкина 10',
    avatar_url: '',
    is_active: true,
    created_at: '2021-03-01',
    animals_count: 35,
    tasks_count: 15,
  },
  {
    id: '5',
    name: 'Лапа помощи',
    email: 'info@lapapomoshi.ru',
    description: 'Благотворительный фонд помощи животным. Организуем сбор средств, лечение и пристройство.',
    phone: '+7 (846) 444-55-66',
    location_text: 'Самара, ул. Мира 7',
    avatar_url: '',
    is_active: true,
    created_at: '2017-11-25',
    animals_count: 30,
    tasks_count: 10,
  },
];

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [searchTerm, organizations]);

  const loadOrganizations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: заменить на реальный API запрос
      // const data = await organizationService.getAllOrganizations({ is_active: true });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
      setOrganizations(mockOrganizations);
      setFilteredOrganizations(mockOrganizations);
    } catch (err: any) {
      console.error('Error loading organizations:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки организаций');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrganizations = () => {
    let filtered = [...organizations];

    if (searchTerm) {
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.location_text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrganizations(filtered);
  };

  const handleViewProfile = (orgId: string) => {
    navigate(`/profile/${orgId}`);
  };

  const handleViewAnimals = (orgId: string) => {
    // TODO: перейти на страницу животных с фильтром по организации
    navigate(`/animals?organization=${orgId}`);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Business sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Организации
          </Typography>
          <Chip 
            label={`${filteredOrganizations.length} ${getOrganizationsCountText(filteredOrganizations.length)}`}
            color="primary"
            size="small"
          />
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Организации, которым нужна помощь волонтеров
        </Typography>

        {/* Поиск */}
        <TextField
          fullWidth
          placeholder="Поиск по названию, описанию или местоположению..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
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

        {/* Список организаций */}
        {filteredOrganizations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Business sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Организации не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Попробуйте изменить параметры поиска
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredOrganizations.map((org) => (
              <Grid sx={{xs: 12, md: 6}} key={org.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar 
                        src={org.avatar_url} 
                        sx={{ width: 70, height: 70 }}
                      >
                        {org.name[0]?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Typography variant="h6">
                            {org.name}
                          </Typography>
                          <Chip 
                            icon={<Verified />} 
                            label="Организация" 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                          {!org.is_active && (
                            <Chip 
                              label="Не активна" 
                              size="small" 
                              color="error"
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {org.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{org.email}</Typography>
                      </Box>
                      
                      {org.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{org.phone}</Typography>
                        </Box>
                      )}
                      
                      {org.location_text && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="body2">{org.location_text}</Typography>
                        </Box>
                      )}
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-around' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary">
                          {org.animals_count || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Животных
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="success.main">
                          {org.tasks_count || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Активных задач
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Business />}
                      onClick={() => handleViewProfile(org.id)}
                      fullWidth
                    >
                      Профиль
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Pets />}
                      onClick={() => handleViewAnimals(org.id)}
                      fullWidth
                    >
                      Животные
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

// Вспомогательная функция для склонения
function getOrganizationsCountText(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'организация';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'организации';
  return 'организаций';
}

export default OrganizationsPage;