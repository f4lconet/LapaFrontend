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
      sx={{ ml: 1, fontWeight: 400, fontSize: 20, backgroundColor: 'rgba(122, 0, 118, 1)', color: 'rgba(255, 255, 255, 1)' }}
    />
  );
};