import './App.scss'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { useAuthPresenter } from './presenters/useAuthPresenter'
import { YMaps } from '@pbe/react-yandex-maps';
const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY

function App() {
  return (
    <YMaps query={{ 
      apikey: YANDEX_MAPS_API_KEY, 
      suggest_apikey: YANDEX_MAPS_API_KEY,
      lang: 'ru_RU',
      load: 'Map,Placemark,geocode,suggest,SuggestView,geoObject.addon.balloon,control.ZoomControl'
    }}>
      <AppInit />
      <RouterProvider router={router} />
    </YMaps>
  )
}

function AppInit() {
  const { checkAuth } = useAuthPresenter()

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  return null
}

export default App
