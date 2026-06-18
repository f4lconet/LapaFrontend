import { Alert } from '@mui/material'

interface AdminAlertProps {
  show: boolean
}

export const AdminAlert = ({ show }: AdminAlertProps) => {
  if (!show) return null

  return (
    <Alert 
      severity="info" 
      sx={{ 
        mb: { xs: 1.5, sm: 2 },
        fontSize: { xs: '12px', sm: '13px', md: '14px' }
      }}
    >
      Вы вошли как администратор. Вы можете:
      <ul style={{ margin: '8px 0 0 20px', fontSize: 'inherit' }}>
        <li>Кликнуть на любую дату, чтобы добавить событие</li>
        <li>Кликнуть на событие, чтобы редактировать или удалить его</li>
        <li>Перетаскивать события для изменения даты</li>
      </ul>
    </Alert>
  )
}