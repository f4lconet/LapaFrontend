import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import { Edit, Phone, LocationOn, Description, Email } from '@mui/icons-material';
import type { User, UpdateProfileRequest, MyCompetencies, Animal, CreateAnimalRequest } from '../../models/user.model';
import { RoleBadge } from './RoleBadge';
import { VolunteerCompetencies } from './VolunteerCompetencies';
import { VolunteerStats } from './VolunteerStats';
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

  return (
    <Stack spacing={3}>
      {/* Основная карточка с информацией */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Avatar src={user.avatarUrl} sx={{ width: 80, height: 80 }}>
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h5">{user.name}</Typography>
                <RoleBadge role={user.role} />
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
            </Box>
          </Box>

          <InfoField
            label="Эл. почта"
            value={user.email}
            icon={<Email fontSize="small" color="action" />}
          />

          <InfoField
            label="Телефон"
            value={user.phone || 'Не указан'}
            icon={<Phone fontSize="small" color="action" />}
          />

          <InfoField
            label="Местоположение"
            value={user.locationText || 'Не указано'}
            icon={<LocationOn fontSize="small" color="action" />}
          />

          <InfoField
            label="О себе"
            value={user.description || 'Нет описания'}
            icon={<Description fontSize="small" color="action" />}
          />

          {user.isUrgentAvailable && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="success.main">
                ✓ Готов помогать в срочных ситуациях
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Блоки для разных ролей */}
      {user.role === 'volunteer' && (
        <>
          <VolunteerCompetencies competencies={competencies} isLoading={isLoading} />
          <VolunteerStats completedCount={volunteerStats?.completedTasksCount ?? 0} />
        </>
      )}

      {(user.role === 'curator' || user.role === 'organization') && (
        <AnimalList
          animals={myAnimals}
          isLoading={isLoading}
          isOwnProfile={isOwnProfile}
          onAdd={() => setIsAddAnimalOpen(true)}
          onDelete={onDeleteAnimal}
        />
      )}

      {/* Диалог редактирования профиля */}
      <EditProfileDialog
        open={isEditDialogOpen}
        user={user}
        isLoading={isLoading}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleUpdateProfile}
        onUploadAvatar={onUploadAvatar}
      />

      {/* Диалог добавления животного */}
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
