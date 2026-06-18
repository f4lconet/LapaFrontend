import { Chip } from '@mui/material';
import { type UserRole, roleRuMap } from '../../models/user.model';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <Chip
      label={roleRuMap[role]}
      size="medium"
      sx={{ 
        mb: { xs: 0.1, sm: 1 },
        fontWeight: 400, 
        fontSize: { xs: '14px', sm: '16px', md: '20px' }, 
        backgroundColor: 'rgba(122, 0, 118, 1)', 
        color: 'rgba(255, 255, 255, 1)',
        height: { xs: '28px', sm: '32px', md: '40px' },
      }}
    />
  );
};