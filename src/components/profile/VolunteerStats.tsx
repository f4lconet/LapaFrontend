import { Card, CardContent, Typography, Box, Rating, Container } from '@mui/material';
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
    <Box>
      <Typography variant="subtitle1" gutterBottom sx={{ fontSize: 24, fontWeight: 700}}>
        Статистика
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Выполненные задания */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AssignmentTurnedIn sx={{ fontSize: 36, color: "rgba(122, 0, 118, 1)" }} />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Выполнено заданий
            </Typography>
            <Typography variant="h5">{completedCount}</Typography>
          </Box>
        </Box>

        {/* Рейтинг */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Star sx={{ fontSize: 36, color: "rgba(122, 0, 118, 1)"  }} />
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
    </Box>
  );
};