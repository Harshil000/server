import './features/shared/global.scss'
import { RouterProvider } from 'react-router-dom'
import { router } from './AppRoute'
import { AuthProvider } from './features/auth/auth.context'
import PostContextProvider from './features/post/post.context'

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <RouterProvider router={router} />
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App