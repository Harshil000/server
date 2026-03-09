import '../styles/form.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import PasswordInput from '../components/PasswordInput'
import ErrorMessage from '../components/ErrorMessage'

const Login = () => {
  const navigate = useNavigate()

  // Use custom form hook for state management (Hooks Layer)
  const { formData, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  })

  // Use auth hook for business logic (Hooks Layer)
  const { handleLogin, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await handleLogin(formData)
      console.log('Login successful')
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <main>
      <ErrorMessage error={error} />
      <div className="form-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      <div className="redirect">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </main>
  )
}

export default Login