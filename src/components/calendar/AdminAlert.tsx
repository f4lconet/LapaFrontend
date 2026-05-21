import { Alert } from '@mui/material'

interface AdminAlertProps {
  show: boolean
}

export const AdminAlert = ({ show }: AdminAlertProps) => {
  if (!show) return null

  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      Вы вошли как администратор. Вы можете:
      <ul style={{ margin: '8px 0 0 20px' }}>
        <li>Кликнуть на любую дату, чтобы добавить событие</li>
        <li>Кликнуть на событие, чтобы редактировать или удалить его</li>
        <li>Перетаскивать события для изменения даты</li>
      </ul>
    </Alert>
  )
}