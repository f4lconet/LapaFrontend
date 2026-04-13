import { Chip } from '@mui/material';
import { type UserRole, roleRuMap } from '../../models/user.model';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <Chip
      label={roleRuMap[role]}
      size="small"
      sx={{ ml: 1, fontWeight: 'medium' }}
      color='secondary'
    />
  );
};