import { Box, Container, Typography } from "@mui/material"
import { ROUTES } from "../../routes/routes"
import { Link } from "react-router-dom"

import PetImage from '../../assets/images/drawer-open-button.svg?react'
const Feed = () => {
  
  return (
    
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <PetImage/>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Лапа Помощи
        </Typography>
      </Box>

      <Typography 
        variant="h6" 
        component="p" 
        sx={{ 
          lineHeight: 1.5, 
          mb: 4,
          fontWeight: 400,
          textAlign: 'center' 
        }}
      >
        Лапа Помощи — это централизованная цифровая экосистема, которая 
        систематизирует, упрощает и повышает эффективность волонтерской 
        деятельности в сфере помощи бездомным животным и поддержки приютов. 
        Платформа призвана интеллектуально связывать потребности отдельных 
        животных, приютов, временных хозяев с компетенциями и возможностями 
        волонтеров, создавая персонализированный и максимально релевантный 
        поток задач для каждого участника.
      </Typography>

      <Box sx={{ textAlign: 'center' }}>
        <Link to={ROUTES.LOGIN}>
          <Typography variant="h6">
            Перейти на сайт
          </Typography>
        </Link>
      </Box>
    </Container>
  )
}

export default Feed