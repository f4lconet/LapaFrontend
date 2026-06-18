import { Typography, Box, Rating } from '@mui/material';
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
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={{ 
          fontSize: { xs: '18px', sm: '20px', md: '24px' }, 
          fontWeight: 700
        }}
      >
        Статистика
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 1.5, sm: 2, md: 3 }, 
        flexWrap: 'wrap' 
      }}>
        {/* Выполненные задания */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 1.5 },
          flexDirection: { xs: 'column', sm: 'row' },
          minWidth: { xs: '100px', sm: 'auto' },
        }}>
          <AssignmentTurnedIn sx={{ 
            fontSize: { xs: '28px', sm: '32px', md: '36px' }, 
            color: "rgba(122, 0, 118, 1)" 
          }} />
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
            >
              Выполнено заданий
            </Typography>
            <Typography 
              variant="h5"
              sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }}
            >
              {completedCount}
            </Typography>
          </Box>
        </Box>

        {/* Рейтинг */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 1.5 },
          flexDirection: { xs: 'column', sm: 'row' },
          minWidth: { xs: '100px', sm: 'auto' },
        }}>
          <Star sx={{ 
            fontSize: { xs: '28px', sm: '32px', md: '36px' }, 
            color: "rgba(122, 0, 118, 1)"  
          }} />
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
            >
              Рейтинг
            </Typography>
            {formattedRating ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 1 },
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}>
                <Typography 
                  variant="h5"
                  sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }}
                >
                  {formattedRating}
                </Typography>
                <Rating 
                  value={Number(formattedRating)} 
                  precision={0.1} 
                  readOnly 
                  sx={{
                    '& .MuiRating-root': {
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    },
                    '& .MuiRating-icon': {
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    }
                  }}
                />
                {reviewsCount != null && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '11px', sm: '12px', md: '13px' } }}
                  >
                    ({reviewsCount})
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: { xs: '12px', sm: '13px', md: '14px' } }}
              >
                Нет оценок
              </Typography>
            )}
          </Box>
        </Box>
      </Box>  
    </Box>
  );
};