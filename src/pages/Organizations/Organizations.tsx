import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Chip,
  Card,
  Button,
  Stack,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from '@mui/material';
import { Search, Business, Phone, Email, LocationOn } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user.service';
import type { User } from '../../models/user.model';

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    loadOrganizations(0);
  }, [searchTerm, showInactive]);

  const loadOrganizations = async (newOffset: number) => {
    if (newOffset === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    try {
      const response = await userService.getUsers(ITEMS_PER_PAGE, newOffset, searchTerm);
      
      // Фильтруем по роли организации и активности
      const filteredOrgs = response.items.filter(user => {
        const isOrganization = user.role === 'organization';
        const matchesActive = showInactive || user.isActive;
        return isOrganization && matchesActive;
      });

      if (newOffset === 0) {
        setOrganizations(filteredOrgs);
      } else {
        setOrganizations(prev => [...prev, ...filteredOrgs]);
      }
      
      setTotalCount(response.total);
      setOffset(newOffset + ITEMS_PER_PAGE);
    } catch (err: any) {
      console.error('Error loading organizations:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки организаций');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    loadOrganizations(offset);
  };

  const handleViewProfile = (orgId: string) => {
    navigate(`/profile/${orgId}`);
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

  if (error && organizations.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <BurgerMenu />
        </Box>
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
            Приюты
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Организации, которым нужна помощь волонтеров
        </Typography>

        {/* Поиск */}
        <TextField
          fullWidth
          placeholder="Поиск по названию или описанию..."
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
        {organizations.length === 0 ? (
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
          <Stack spacing={2} sx={{width: '100%'}}>
            {organizations.map((org) => (
              <Card 
                key={org.id}
                sx={{
                  maxHeight: '220px',
                  display: 'flex',
                  flexDirection: 'row',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  cursor: 'pointer',
                  borderRadius: '20px',
                  border: '1px solid black',
                  backgroundColor: 'rgba(248, 247, 255, 1)',
                  padding: '10px',
                  gap: '20px',
                }}
                onClick={() => handleViewProfile(org.id)}
              >
                {/* Картинка слева */}
                <Box
                  sx={{
                    width: '300px',
                    height: '200px',
                    flexShrink: 0,
                    backgroundColor: '#f0f0f0',
                    backgroundImage: org.avatarUrl ? `url(${org.avatarUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.secondary',
                    borderRadius: '10px',
                    border: '1px solid rgba(93, 75, 216, 1)',
                  }}
                >
                  {!org.avatarUrl && <Business sx={{ fontSize: 60, color: 'action.disabled' }} />}
                </Box>

                {/* Информация справа */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minWidth: 0,
                  }}
                >
                  {/* Название */}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        Название: {org.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Описание */}
                  {org.description && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem' }}>
                        Описание
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '0.875rem',
                        }}
                      >
                        {org.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Контактная информация */}
                  <Stack spacing={0.5}>
                    {org.email && (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                          <Email fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem' }}>
                            Эл.почта: {org.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {org.phone && (
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem' }}>
                          Телефон
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                          <Phone fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem' }}>
                            Телефон: {org.phone}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {org.locationText && (
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.7rem' }}>
                          Локация
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                          <LocationOn fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem' }}>
                            {org.locationText}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>

                  {/* Кнопка */}
                  <Box sx={{ mt: 0.5, alignSelf: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProfile(org.id);
                      }}
                      sx={{ fontSize: '0.75rem', py: 0.5 }}
                    >
                      Открыть профиль
                    </Button>
                  </Box>
                </Box>
              </Card>
            ))}

            {/* Кнопка "Загрузить ещё" */}
            {offset < totalCount && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  sx={{ minWidth: '200px' }}
                >
                  {isLoadingMore ? <CircularProgress size={24} /> : 'Загрузить ещё'}
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default OrganizationsPage;