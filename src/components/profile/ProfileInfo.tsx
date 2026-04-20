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
import { Edit, Phone, LocationOn, Email, CheckCircle, Cancel } from '@mui/icons-material';
import type { User, UpdateProfileRequest, MyCompetencies, Animal, CreateAnimalRequest } from '../../models/user.model';
import { RoleBadge } from './RoleBadge';
import { VolunteerStats } from './VolunteerStats';
import { VolunteerCompetencies } from './VolunteerCompetencies';
import { AnimalList } from './AnimalList';
import { AddAnimalDialog } from './AddAnimalDialog';
import { EditProfileDialog } from './EditProfileDialog';

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
  onAddAnimal?: (data: CreateAnimalRequest) => Promise<void>;
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
  onAddAnimal,
  onDeleteAnimal,
  onCompetenciesUpdate,
}: ProfileInfoProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);

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

  const ProfileHeader = () => (
    <Box>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar src={user.avatarUrl} sx={{ width: 80, height: 80, flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Typography variant="h5">{user.name}</Typography>
              {isOwnProfile && (
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => setIsEditDialogOpen(true)}
                  variant="outlined"
                >
                  Редактировать
                </Button>
              )}
            </Box>
            <RoleBadge role={user.role} />
            
            <Box sx={{ mt: 2 }}>
              <InfoField
                label="Эл. почта"
                value={user.email}
                icon={<Email fontSize="small" color="action" />}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <InfoField
                label="Телефон"
                value={user.phone || 'Не указан'}
                icon={<Phone fontSize="small" color="action" />}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <InfoField
                label="Локация"
                value={user.locationText || 'Не указано'}
                icon={<LocationOn fontSize="small" color="action" />}
              />
            </Box>

            {user.role === 'volunteer' && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {user.isUrgentAvailable ? (
                    <>
                      <CheckCircle color="success" fontSize="small" />
                      Готов помогать в срочных ситуациях
                    </>
                  ) : (
                    <>
                      <Cancel color="action" fontSize="small" />
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
              <Card sx={{ border: '1px solid #4C47D8', backgroundColor: '#F6F5FF', height: '100%', minHeight: 300 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
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

          <Card sx={{ border: '1px solid #4C47D8', backgroundColor: '#F6F5FF' }}>
            <CardContent>
              <VolunteerStats completedCount={volunteerStats?.completedTasksCount ?? 0} />
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <ProfileHeader />

          <Card sx={{ border: '1px solid #4C47D8', backgroundColor: '#F6F5FF' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
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
              onAdd={() => setIsAddAnimalOpen(true)}
              onDelete={onDeleteAnimal}
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
          onClose={() => setIsAddAnimalOpen(false)}
          onAdd={handleAddAnimal}
        />
      )}
    </Stack>
  );
};
