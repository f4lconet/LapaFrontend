import { Box, Card, CardContent, Typography, Chip, Stack, Skeleton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete, TextField, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Edit, Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { volunteerService } from '../../services/api/volunteer.service';
import type { MyCompetencies, Skill, Preference, AnimalType } from '../../models/user.model';

interface VolunteerCompetenciesProps {
  competencies: MyCompetencies | null;
  isLoading: boolean;
  isOwnProfile?: boolean;
  onCompetenciesUpdate?: () => void;
}

export const VolunteerCompetencies = ({ competencies, isLoading, isOwnProfile = false, onCompetenciesUpdate }: VolunteerCompetenciesProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [allPreferences, setAllPreferences] = useState<Preference[]>([]);
  const [allAnimalTypes, setAllAnimalTypes] = useState<AnimalType[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);
  const [selectedAnimalTypes, setSelectedAnimalTypes] = useState<AnimalType[]>([]);
  const [selectedInteractionTypes, setSelectedInteractionTypes] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditDialogOpen) {
      loadAllOptions();
    }
  }, [isEditDialogOpen]);

  useEffect(() => {
    if (competencies) {
      setSelectedSkills(competencies.skills || []);
      setSelectedPreferences(competencies.preferences || []);
      setSelectedAnimalTypes(competencies.animalPreferences || []);
      setSelectedInteractionTypes(competencies.interactionPreferences || []);
      setSchedule(competencies.availability?.schedule || []);
    }
  }, [competencies]);

  const loadAllOptions = async () => {
    try {
      const [skills, preferences, animalTypes] = await Promise.all([
        volunteerService.getAllSkills(),
        volunteerService.getAllPreferences(),
        volunteerService.getAllAnimalTypes()
      ]);
      setAllSkills(skills);
      setAllPreferences(preferences);
      setAllAnimalTypes(animalTypes);
    } catch (error) {
      console.error('Failed to load skills and preferences:', error);
    }
  };

  const updateScheduleDay = (dayOfWeek: number, updates: Partial<{ isWorking: boolean; startTime: string; endTime: string }>) => {
    setSchedule(prev => {
      const existingIndex = prev.findIndex(s => s.dayOfWeek === dayOfWeek);
      if (existingIndex >= 0) {
        // Update existing day
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...updates };
        return updated;
      } else {
        // Add new day
        return [...prev, {
          dayOfWeek: dayOfWeek,
          startTime: updates.startTime || '09:00',
          endTime: updates.endTime || '18:00',
          isWorking: updates.isWorking || false
        }];
      }
    });
  };

  const removeScheduleDay = (dayOfWeek: number) => {
    setSchedule(prev => prev.filter(s => s.dayOfWeek !== dayOfWeek));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        volunteerService.updateMySkills(selectedSkills.map(s => s.id)),
        volunteerService.updateMyPreferences(selectedPreferences.map(p => p.id)),
        volunteerService.updateMyAnimalPreferences(selectedAnimalTypes.map(a => a.id)),
        volunteerService.updateMyInteractionPreferences(selectedInteractionTypes),
        volunteerService.updateMySchedule(schedule)
      ]);
      onCompetenciesUpdate?.();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update competencies:', error);
    } finally {
      setIsSaving(false);
    }
  };
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
    <>
      <Card sx={{ border: '1px solid #4C47D8', backgroundColor: '#F6F5FF' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Мои компетенции
            </Typography>
            {isOwnProfile && (
              <IconButton size="small" onClick={() => setIsEditDialogOpen(true)}>
                <Edit fontSize="small" />
              </IconButton>
            )}
          </Box>

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

          {/* Типы взаимодействия */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Тип взаимодействия
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {competencies.interactionPreferences?.map((interaction) => {
                const labels: Record<string, string> = {
                  'shelter': 'Приют',
                  'foster': 'Передержка',
                  'street': 'Улица'
                };
                return (
                  <Chip key={interaction} label={labels[interaction] || interaction} size="small" color="secondary" />
                );
              })}
              {(!competencies.interactionPreferences || competencies.interactionPreferences.length === 0) && (
                <Typography variant="body2" color="text.secondary">Не указаны</Typography>
              )}
            </Box>
          </Box>

          {/* Доступность */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Доступность
              </Typography>
            </Box>
            {competencies.availability && competencies.availability.schedule && competencies.availability.schedule.length > 0 ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {competencies.availability.schedule.filter(s => s.isWorking).length} дней в неделю
                  {competencies.availability.timezone && ` (${competencies.availability.timezone})`}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {competencies.availability.schedule
                    .filter(s => s.isWorking)
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map(s => {
                      const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
                      return (
                        <Typography key={s.dayOfWeek} variant="body2" color="text.secondary">
                          {dayNames[s.dayOfWeek]}: {s.startTime.slice(0, 5)}-{s.endTime.slice(0, 5)}
                        </Typography>
                      );
                    })}
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">Не указано</Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>

    {/* Диалог редактирования */}
    <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Редактировать компетенции
        <IconButton
          onClick={() => setIsEditDialogOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Autocomplete
            multiple
            options={allPreferences}
            value={selectedPreferences}
            onChange={(_, newValue) => setSelectedPreferences(newValue)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Предпочтения" placeholder="Выберите предпочтения" />
            )}
          />

          <Autocomplete
            multiple
            options={allSkills}
            value={selectedSkills}
            onChange={(_, newValue) => setSelectedSkills(newValue)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Навыки" placeholder="Выберите навыки" />
            )}
          />

          <Autocomplete
            multiple
            options={allAnimalTypes}
            value={selectedAnimalTypes}
            onChange={(_, newValue) => setSelectedAnimalTypes(newValue)}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} label="Работа с животными" placeholder="Выберите типы животных" />
            )}
          />

          <Autocomplete
            multiple
            options={['shelter', 'foster', 'street']}
            value={selectedInteractionTypes}
            onChange={(_, newValue) => setSelectedInteractionTypes(newValue)}
            getOptionLabel={(option) => {
              const labels: Record<string, string> = {
                'shelter': 'Приют',
                'foster': 'Передержка',
                'street': 'Улица'
              };
              return labels[option] || option;
            }}
            renderInput={(params) => (
              <TextField {...params} label="Тип взаимодействия" placeholder="Выберите типы взаимодействия" />
            )}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Расписание работы
            </Typography>
            <Stack spacing={2}>
              {[
                { day: 0, name: 'Понедельник' },
                { day: 1, name: 'Вторник' },
                { day: 2, name: 'Среда' },
                { day: 3, name: 'Четверг' },
                { day: 4, name: 'Пятница' },
                { day: 5, name: 'Суббота' },
                { day: 6, name: 'Воскресенье' }
              ].map(({ day, name }) => {
                const daySchedule = schedule.find(s => s.dayOfWeek === day) || {
                  dayOfWeek: day,
                  startTime: '09:00',
                  endTime: '18:00',
                  isWorking: false
                };

                return (
                  <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={daySchedule.isWorking}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateScheduleDay(day, { isWorking: true });
                            } else {
                              removeScheduleDay(day);
                            }
                          }}
                        />
                      }
                      label={name}
                      sx={{ minWidth: 120 }}
                    />
                    {daySchedule.isWorking && (
                      <>
                        <TextField
                          type="time"
                          label="Начало"
                          value={daySchedule.startTime}
                          onChange={(e) => updateScheduleDay(day, { startTime: e.target.value })}
                          size="small"
                          sx={{ width: 120 }}
                        />
                        <TextField
                          type="time"
                          label="Конец"
                          value={daySchedule.endTime}
                          onChange={(e) => updateScheduleDay(day, { endTime: e.target.value })}
                          size="small"
                          sx={{ width: 120 }}
                        />
                      </>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};