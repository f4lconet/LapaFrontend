import { Card, CardContent, Typography, Box } from '@mui/material';
import { AssignmentTurnedIn } from '@mui/icons-material';

interface VolunteerStatsProps {
  completedCount: number;
}

export const VolunteerStats = ({ completedCount }: VolunteerStatsProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Статистика
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssignmentTurnedIn color="success" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Выполнено заданий
            </Typography>
            <Typography variant="h4">{completedCount}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};