import { Card, CardContent, Typography, Box, Rating } from '@mui/material';
import { AssignmentTurnedIn, Star } from '@mui/icons-material';

interface VolunteerStatsProps {
  completedCount: number;
  ratingAvg?: number | null;
  reviewsCount?: number;
}

export const VolunteerStats = ({ 
  completedCount, 
  ratingAvg, 
  reviewsCount 
}: VolunteerStatsProps) => {
  // Форматируем рейтинг до 2 знаков после запятой
  const formattedRating = ratingAvg != null 
    ? Number(ratingAvg).toFixed(2) 
    : null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Статистика
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Выполненные задания */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AssignmentTurnedIn color="success" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Выполнено заданий
              </Typography>
              <Typography variant="h5">{completedCount}</Typography>
            </Box>
          </Box>

          {/* Рейтинг */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Star color="warning" sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Рейтинг
              </Typography>
              {formattedRating ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5">{formattedRating}</Typography>
                  <Rating 
                    value={Number(formattedRating)} 
                    precision={0.1} 
                    readOnly 
                    size="small" 
                  />
                  {reviewsCount != null && (
                    <Typography variant="body2" color="text.secondary">
                      ({reviewsCount})
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Нет оценок
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};