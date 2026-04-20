import './App.scss'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { useAuthPresenter } from './presenters/useAuthPresenter'
import { useWebSocketInit } from './hooks/useWebSocketInit'

function App() {
  return (
    <>
      <AppInit />
      <RouterProvider router={router} />
    </>
  )
}

function AppInit() {
  const { checkAuth } = useAuthPresenter()
  useWebSocketInit()

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  return null
}

export default App
