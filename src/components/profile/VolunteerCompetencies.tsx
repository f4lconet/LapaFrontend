import { Box, Card, CardContent, Typography, Chip, Stack, Skeleton } from '@mui/material';
import type { MyCompetencies } from '../../models/user.model';

interface VolunteerCompetenciesProps {
  competencies: MyCompetencies | null;
  isLoading: boolean;
}

export const VolunteerCompetencies = ({ competencies, isLoading }: VolunteerCompetenciesProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={60} />
        </CardContent>
      </Card>
    );
  }

  if (!competencies) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Мои компетенции
        </Typography>

        <Stack spacing={3}>
          {/* Предпочтения */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Предпочтения
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {competencies.preferences?.map((pref) => (
                <Chip key={pref.id} label={pref.name} size="small" />
              ))}
              {(!competencies.preferences || competencies.preferences.length === 0) && (
                <Typography variant="body2" color="text.secondary">Не указаны</Typography>
              )}
            </Box>
          </Box>

          {/* Навыки */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Навыки
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {competencies.skills?.map((skill) => (
                <Chip key={skill.id} label={skill.name} size="small" variant="outlined" />
              ))}
              {(!competencies.skills || competencies.skills.length === 0) && (
                <Typography variant="body2" color="text.secondary">Не указаны</Typography>
              )}
            </Box>
          </Box>

          {/* Типы животных */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Работа с животными
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {competencies.animalPreferences?.map((animal) => (
                <Chip key={animal.id} label={animal.name} size="small" color="info" />
              ))}
              {(!competencies.animalPreferences || competencies.animalPreferences.length === 0) && (
                <Typography variant="body2" color="text.secondary">Не указаны</Typography>
              )}
            </Box>
          </Box>

          {/* Время доступности (кратко) */}
          {competencies.availability && competencies.availability.schedule && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Доступность
              </Typography>
              <Typography variant="body2">
                {competencies.availability.schedule.filter(s => s.isWorking).length} дней в неделю
                {competencies.availability.timezone && ` (${competencies.availability.timezone})`}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};