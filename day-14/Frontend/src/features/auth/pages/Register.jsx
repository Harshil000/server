import '../styles/form.scss'
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useForm } from '../hooks/useForm'
import PasswordInput from '../components/PasswordInput'
import ErrorMessage from '../components/ErrorMessage'

const Register = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  // Use custom form hook for state management (Hooks Layer)
  const { formData, handleChange, resetForm } = useForm({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: ''
  })

  // Use auth hook for business logic (Hooks Layer)
  const { handleRegister, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Get file reference from DOM (UI responsibility)
    const profilePicFile = fileInputRef.current?.files[0] || null

    try {
      // Hook handles FormData construction (business logic)
      await handleRegister(formData, profilePicFile)
      console.log('Registration successful')
      navigate('/login')
      resetForm()
      e.target.reset()
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <main>
      <ErrorMessage error={error} />
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
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

          <textarea
            name="bio"
            placeholder="Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            type="file"
            name="profilePic"
            accept="image/*"
            ref={fileInputRef}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>

      <div className="redirect">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </main>
  )
}

export default Register