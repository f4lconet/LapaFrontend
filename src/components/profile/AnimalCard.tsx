import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  CardMedia,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { DeleteOutlined, Edit, Pets, OpenInNew, Visibility } from '@mui/icons-material';
import { type Animal } from '../../models/user.model';
import { useNavigate } from 'react-router-dom';

interface AnimalCardProps {
  animal: Animal;
  onDelete?: (id: string) => void;
  onEdit?: (animal: Animal) => void;
  isOwnProfile: boolean;
  showCuratorButton?: boolean;
}

export const AnimalCard = ({
  animal,
  onDelete,
  onEdit,
  isOwnProfile,
  showCuratorButton = false,
}: AnimalCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    if (onDelete && window.confirm(`Удалить животное "${animal.name}"?`)) {
      onDelete(animal.id);
    }
  };

  const handleOpenMap = (lat?: number, lng?: number) => {
    if (lat != null && lng != null) {
      const url = `https://yandex.ru/maps/?ll=${lng},${lat}&z=15&pt=${lng},${lat}`;
      window.open(url, '_blank');
    }
  };

  const handleViewCurator = () => {
    navigate(`/profile/${animal.curatorId}`);
  };

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          width: '100%',
          maxWidth: 345,
          height: showCuratorButton ? 420 : 380,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: 'rgba(248, 247, 255, 1)',
          padding: '10px',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
        onClick={handleCardClick}
      >
        {animal.photoUrl ? (
          <CardMedia
            component="img"
            height="167px"
            image={animal.photoUrl}
            alt={animal.name}
            sx={{ borderRadius: '10px', width: '100%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <Box
            sx={{
              height: 167,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              flexShrink: 0,
            }}
          >
            <Pets fontSize="large" color="disabled" />
          </Box>
        )}

        <CardContent sx={{ flex: 1, overflow: 'hidden', pb: 0 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 400 }} gutterBottom>
            Имя: {animal.name}
          </Typography>

          <Typography sx={{ fontSize: '16px', fontWeight: 400 }} gutterBottom>
            Возраст: {`${animal.age} ${getAgeText(animal.age)}`}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 400, flex: 1 }} noWrap>
              Локация: {animal.locationText}
            </Typography>
            {animal.locationLat != null && animal.locationLng != null && (
              <Button
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMap(animal.locationLat, animal.locationLng);
                }}
                sx={{
                  height: '30px',
                  minWidth: '30px',
                  width: '30px',
                  p: 0,
                  borderRadius: '10px',
                  flexShrink: 0,
                }}
              >
                <OpenInNew fontSize="small" />
              </Button>
            )}
          </Box>

          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 400,
              mt: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Описание: {animal.description || 'Нет описания'}
          </Typography>
        </CardContent>

        {showCuratorButton && (
          <CardActions sx={{ justifyContent: 'end', pt: 1, pb: 1, flexShrink: 0 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Visibility />}
              onClick={(e) => {
                e.stopPropagation();
                handleViewCurator();
              }}
              
            >
              Куратор
            </Button>
          </CardActions>
        )}

        {isOwnProfile && (
          <Box 
            sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(animal)} sx={{ bgcolor: 'background.paper' }}>
                <Edit fontSize="small" color="primary" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={handleDelete} sx={{ bgcolor: 'background.paper' }}>
                <DeleteOutlined fontSize="small" color="primary" />
              </IconButton>
            )}
          </Box>
        )}
      </Card>

      {/* Диалог с полной информацией */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle sx={{ fontSize: 24, fontWeight: 700 }}>{animal.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {animal.photoUrl && (
              <Box
                component="img"
                src={animal.photoUrl}
                alt={animal.name}
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
            )}

            
            <Typography sx={{ fontSize: '16px', fontWeight: 400 }} gutterBottom>
              Возраст: {`${animal.age} ${getAgeText(animal.age)}`}
            </Typography>
            <Typography sx={{ fontSize: '16px', fontWeight: 400, flex: 1 }} noWrap>
              Локация: {animal.locationText}
            </Typography>

            <Typography variant="body1">{animal.description || 'Нет описания'}</Typography>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {animal.locationLat != null && animal.locationLng != null && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    handleOpenMap(animal.locationLat, animal.locationLng);
                  }}
                  startIcon={<OpenInNew fontSize="small" />}
                >
                  На карте
                </Button>
              )}
              {!isOwnProfile && showCuratorButton && (
                <Button variant="outlined" startIcon={<Visibility />} onClick={handleViewCurator}>
                  Куратор
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

function getAgeText(age: number): string {
  if (age % 10 === 1 && age % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(age % 10) && ![12, 13, 14].includes(age % 100)) return 'года';
  return 'лет';
}