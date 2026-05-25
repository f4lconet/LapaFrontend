import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Card,
  Button,
  Stack,
  Dialog,
  DialogContent,
  Avatar,
  Grid,
} from '@mui/material';
import { Search, Business, Phone, Email, LocationOn, OpenInNew, Visibility } from '@mui/icons-material';
import { BurgerMenu } from '../../components/navigation/BurgerMenu';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/user.service';
import type { User } from '../../models/user.model';

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [allOrganizations, setAllOrganizations] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<User | null>(null);

  const ITEMS_PER_PAGE = 5;

  // Начальная загрузка
  useEffect(() => {
    loadAllOrganizations();
  }, []);

  // Локальная фильтрация
  const filteredOrganizations = useMemo(() => {
    if (!searchTerm.trim()) return allOrganizations;
    
    const query = searchTerm.toLowerCase();
    return allOrganizations.filter(org =>
      org.name?.toLowerCase().includes(query) ||
      org.description?.toLowerCase().includes(query) ||
      org.email?.toLowerCase().includes(query) ||
      org.phone?.toLowerCase().includes(query) ||
      org.locationText?.toLowerCase().includes(query)
    );
  }, [allOrganizations, searchTerm]);

  const loadAllOrganizations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(100, 0, '');
      
      const filteredOrgs = response.items.filter(user => {
        const isOrganization = user.role === 'organization';
        const matchesActive = showInactive || user.isActive;
        return isOrganization && matchesActive;
      });

      setAllOrganizations(filteredOrgs);
      setTotalCount(response.total);
      setOffset(100);
    } catch (err: any) {
      console.error('Error loading organizations:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки организаций');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const response = await userService.getUsers(ITEMS_PER_PAGE, offset, '');
      
      const filteredOrgs = response.items.filter(user => {
        const isOrganization = user.role === 'organization';
        const matchesActive = showInactive || user.isActive;
        return isOrganization && matchesActive;
      });

      setAllOrganizations(prev => [...prev, ...filteredOrgs]);
      setTotalCount(response.total);
      setOffset(prev => prev + ITEMS_PER_PAGE);
    } catch (err: any) {
      console.error('Error loading more organizations:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleViewProfile = (orgId: string) => {
    navigate(`/profile/${orgId}`);
  };

  const handleOpenMap = (lat?: number, lng?: number) => {
    if (lat != null && lng != null) {
      const url = `https://yandex.ru/maps/?ll=${lng},${lat}&z=15&pt=${lng},${lat}`;
      window.open(url, '_blank');
    }
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

  if (error && allOrganizations.length === 0) {
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
        <Typography variant="h1" component="h1" sx={{fontSize: '36px', fontWeight: 700, mb: 2}}>
          Приюты
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Организации, которым нужна помощь волонтеров
        </Typography>

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
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <Button 
                    size="small" 
                    onClick={() => setSearchTerm('')}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    ✕
                  </Button>
                </InputAdornment>
              ),
            }
          }}
        />

        {filteredOrganizations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Business sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'Организации не найдены' : 'Организации не найдены'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Попробуйте изменить параметры поиска' : ''}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2} sx={{width: '100%'}}>
            {filteredOrganizations.map((org) => (
              <Card 
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                sx={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  borderRadius: '20px',
                  border: '1px solid rgba(201, 201, 201, 1)',
                  backgroundColor: 'rgba(248, 247, 255, 1)',
                  padding: '10px',
                }}
              >
                <Grid container spacing={2} direction="row" sx={{alignItems: "stretch"}}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: '200px', md: '100%' },
                        minHeight: 200,
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
                  </Grid>

                  <Grid size={{ xs: 12, md: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}> 
                      <Typography variant="h6" sx={{ fontWeight: 400, fontSize: '16px' }}>
                        Название: {org.name}
                      </Typography>

                      <Typography 
                        sx={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        Описание: {org.description || 'Нет описания'}
                      </Typography>
                      

                      <Stack spacing={0.5}>
                        <Typography noWrap>Эл.почта: {org.email || 'Не определена'}</Typography>
  
                        <Typography noWrap>Телефон: {org.phone || 'Не определен'}</Typography>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography noWrap sx={{  }}>Локация: {org.locationText || 'Не определена'}</Typography>
                          {org.locationLat != null && org.locationLng != null && (
                            <Button
                              size="small"
                              variant="text"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenMap(org.locationLat, org.locationLng);
                              }}
                              sx={{ minWidth: 'auto' }}
                            >
                              <OpenInNew />
                            </Button>
                          )}
                        </Box>
                      
                      </Stack>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(org.id);
                        }}
                        sx={{ alignSelf: 'flex-end', fontSize: '0.75rem', py: 0.5 }}
                      >
                        Открыть профиль
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}

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

      <Dialog 
        open={Boolean(selectedOrg)} 
        onClose={() => setSelectedOrg(null)} 
        maxWidth="sm" 
        fullWidth
      >
        {selectedOrg && (
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={selectedOrg.avatarUrl} 
                sx={{ width: 100, height: 100 }}
              >
                {selectedOrg.name?.[0]?.toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {selectedOrg.name}
              </Typography>

              {selectedOrg.description && (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                  {selectedOrg.description}
                </Typography>
              )}

              <Stack spacing={1} sx={{ width: '100%' }}>
                {selectedOrg.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email color="action" />
                    <Typography>{selectedOrg.email}</Typography>
                  </Box>
                )}
                
                {selectedOrg.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone color="action" />
                    <Typography>{selectedOrg.phone}</Typography>
                  </Box>
                )}
                
                {selectedOrg.locationText && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="action" />
                    <Typography sx={{ flex: 1 }}>{selectedOrg.locationText}</Typography>
                    {selectedOrg.locationLat != null && selectedOrg.locationLng != null && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenMap(selectedOrg.locationLat, selectedOrg.locationLng)}
                        startIcon={<OpenInNew />}
                      >
                        На карте
                      </Button>
                    )}
                  </Box>
                )}
              </Stack>

              <Button
                variant="contained"
                startIcon={<Visibility />}
                onClick={() => {
                  setSelectedOrg(null);
                  handleViewProfile(selectedOrg.id);
                }}
              >
                Перейти в профиль
              </Button>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
};

export default OrganizationsPage;