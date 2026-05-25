import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Grid,
} from '@mui/material';
import { Cancel, Chat, EditOutlined, LocationOnOutlined, Done } from '@mui/icons-material';
import type { User, UpdateProfileRequest, MyCompetencies, Animal, CreateAnimalRequest } from '../../models/user.model';
import { RoleBadge } from './RoleBadge';
import { VolunteerStats } from './VolunteerStats';
import { VolunteerCompetencies } from './VolunteerCompetencies';
import { AnimalList } from './AnimalList';
import { AddAnimalDialog } from './AddAnimalDialog';
import { EditProfileDialog } from './EditProfileDialog';
import { ReviewList } from './ReviewList';
import { useReviewStore } from '../../services/stores/useReviewStore';

interface ProfileInfoProps {
  user: User;
  isEditing: boolean;
  isLoading: boolean;
  isOwnProfile: boolean;
  competencies: MyCompetencies | null;
  volunteerStats: { completedTasksCount: number } | null;
  myAnimals: Animal[];
  onUpdate: (data: UpdateProfileRequest) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<string>;
  onChat?: () => void;
  onAddAnimal?: (data: CreateAnimalRequest) => Promise<void>;
  onUpdateAnimal?: (animalId: string, data: Partial<CreateAnimalRequest>) => Promise<void>;
  onDeleteAnimal?: (id: string) => Promise<void>;
  onCompetenciesUpdate?: () => Promise<void>;
}

export const ProfileInfo = ({
  user,
  isLoading,
  isOwnProfile,
  competencies,
  volunteerStats,
  myAnimals,
  onUpdate,
  onUploadAvatar,
  onChat,
  onAddAnimal,
  onUpdateAnimal,
  onDeleteAnimal,
  onCompetenciesUpdate,
}: ProfileInfoProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);

  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  
  // Подписываемся на stats из стора напрямую — теперь будет реактивно
  const reviewStats = useReviewStore((state) => state.stats);

  const handleUpdateProfile = async (data: UpdateProfileRequest) => {
    await onUpdate(data);
  };

  const handleAddAnimal = async (data: CreateAnimalRequest) => {
    if (onAddAnimal) {
      await onAddAnimal(data);
    }
  };


  const InfoField = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">{value || 'Не указано'}</Typography>
      </Box>
    </Box>
  );

  const handleOpenMap = () => {
    if (user.locationLat != null && user.locationLng != null) {
      const url = `https://yandex.ru/maps/?ll=${user.locationLng},${user.locationLat}&z=15&pt=${user.locationLng},${user.locationLat}`;
      window.open(url, '_blank');
    }
  };

  const ProfileHeader = () => (
    <Box>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 6, mb: 2 }}>
          <Avatar src={user.avatarUrl} sx={{ width: 129, height: 129, flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap', mt: 3 }}>
              <Typography variant="h4" sx={{fontWeight: 700, fontSize: 48 }}>{user.name}</Typography>
              {isOwnProfile && (
                <Button
                  onClick={() => setIsEditDialogOpen(true)}
                  variant="text"
                  sx={{ position: 'relative', bottom: 25}}
                >
                  <EditOutlined 
                    sx={{maxHeight: 43, maxWidth: 43, width: '100%', height: '100%', color: 'rgba(49, 40, 114, 1)' }}
                  />
                </Button>
              )}
              {!isOwnProfile && onChat && (
                <Button
                  size="small"
                  startIcon={<Chat />}
                  onClick={onChat}
                  variant="contained"
                  sx={{backgroundColor: 'rgba(93, 75, 216, 1)', color: 'rgba(255, 255, 255, 1)', borderRadius: '20px' }}
                >
                  Написать сообщение
                </Button>
              )}
            </Box>
            <RoleBadge role={user.role} />
            
            <Box sx={{ mt: 2 }}>
              <InfoField
                label="Эл. почта"
                value={user.email}
                icon={undefined}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <InfoField
                label="Телефон"
                value={user.phone || 'Не указан'}
                icon={undefined}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Локация
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">
                      {user.locationText || 'Не указано'}
                    </Typography>
                    {user.locationLat != null && user.locationLng != null && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleOpenMap}
                        startIcon={<LocationOnOutlined/>}
                        sx={{ ml: 1, whiteSpace: 'nowrap', color: 'rgba(255, 255, 255, 1)', backgroundColor: 'rgba(93, 75, 216, 1)', borderRadius: '20px' }}
                      >
                        На карте
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {user.role === 'volunteer' && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user.isUrgentAvailable ? (
                    <>
                      <Done sx={{color: 'rgba(122, 0, 118, 1)'}} fontSize="medium" />
                      Готов помогать в срочных ситуациях
                    </>
                  ) : (
                    <>
                      <Cancel sx={{color: 'rgba(122, 0, 118, 1)'}} fontSize="medium" />
                      Не готов к срочным ситуациям
                    </>
                  )}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Box>
  );

  return (
    <Stack spacing={3}>
      {user.role === 'volunteer' ? (
        <>
          <ProfileHeader />

          <Grid container spacing={2} sx={{ width: '100%' }}>
            <Grid sx={{ xs: 12, md: 4, flex: '1 1 calc(33.333% - 11px)', minWidth: '110px' }}>
              <Card sx={{ border: '3px solid rgba(49, 40, 114, 1)', backgroundColor: 'rgba(239, 237, 255, 1)', borderRadius: '34px',  height: '100%', minHeight: 300 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontSize: 24, fontWeight: 700}}>
                    О себе
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: user.description ? 'text.primary' : 'text.secondary' }}>
                    {user.description || 'Нет описания'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{ xs: 12, md: 4, flex: '1 1 calc(33.333% - 11px)', minWidth: '110px' }}>
              <VolunteerCompetencies
                competencies={competencies}
                isLoading={isLoading}
                isOwnProfile={isOwnProfile}
                onCompetenciesUpdate={onCompetenciesUpdate}
              />
            </Grid>
          </Grid>

          <Card sx={{ border: '3px solid rgba(49, 40, 114, 1)', backgroundColor: 'rgba(239, 237, 255, 1)', borderRadius: '34px', }}>
            <CardContent>
              <VolunteerStats 
                completedCount={volunteerStats?.completedTasksCount ?? 0}
                ratingAvg={reviewStats?.rating_avg ?? null}
                reviewsCount={reviewStats?.reviews_count ?? 0}
              />
            </CardContent>
          </Card>

          {/* Блок с отзывами */}
          <ReviewList 
            volunteerId={user.id} 
            isOwnProfile={isOwnProfile} 
          />
        </>
      ) : (
        <>
          <ProfileHeader />

          <Card sx={{ border: '3px solid rgba(49, 40, 114, 1)', backgroundColor: 'rgba(239, 237, 255, 1)', borderRadius: '34px', minHeight: 200 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontSize: 24, fontWeight: 700}}>
                О себе
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: user.description ? 'text.primary' : 'text.secondary' }}>
                {user.description || 'Нет описания'}
              </Typography>
            </CardContent>
          </Card>

          {(user.role === 'curator' || user.role === 'organization') && (
            <AnimalList
              animals={myAnimals}
              isLoading={isLoading}
              isOwnProfile={isOwnProfile}
              onAdd={isOwnProfile ? () => setIsAddAnimalOpen(true) : undefined}
              onEdit={isOwnProfile ? (animal) => {
                setEditingAnimal(animal);
                setIsAddAnimalOpen(true);
              } : undefined}
              onDelete={isOwnProfile ? onDeleteAnimal : undefined}
            />
          )}
        </>
      )}

      <EditProfileDialog
        open={isEditDialogOpen}
        user={user}
        isLoading={isLoading}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateProfile}
        onUploadAvatar={onUploadAvatar}
      />

      {onAddAnimal && (
        <AddAnimalDialog
          open={isAddAnimalOpen}
          onClose={() => {
            setIsAddAnimalOpen(false);
            setEditingAnimal(null);
          }}
          onAdd={handleAddAnimal}
          onUpdate={onUpdateAnimal}
          editingAnimal={editingAnimal}
        />
      )}
    </Stack>
  );
};