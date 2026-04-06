import { Container } from "@mui/material"
import { ROUTES } from "../../routes/routes"
import { Link } from "react-router-dom"

const Feed = () => {
  return (
    <>
      <Container>
        <Link to={ROUTES.LOGIN}>Авторизация</Link>
      </Container>
    </>
  )
}

export default Feed