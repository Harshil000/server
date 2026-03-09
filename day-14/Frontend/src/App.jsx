import './style.scss'
import AppRoute from './AppRoute'
import { AuthProvider } from './features/auth/auth.context'

const App = () => {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  )
}

export default App