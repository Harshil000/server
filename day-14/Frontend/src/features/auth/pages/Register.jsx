import '../styles/form.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('userName', formData.username)
      data.append('email', formData.email)
      data.append('password', formData.password)
      data.append('bio', formData.bio)

      const fileInput = e.target.profilePic
      if (fileInput.files[0]) {
        data.append('profilePic', fileInput.files[0])
      }

      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        data,
        { withCredentials: true }
      )

      setSuccess(response.data.msg || 'Registration successful!')
      console.log('Registration successful:', response.data)

      // Reset form
      setFormData({ name: '', username: '', email: '', password: '', bio: '' })
      e.target.reset()

    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg || 'Registration failed')
      } else if (error.request) {
        setError('Network error. Please try again.')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
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

          <div className="passContainer">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <span className="hide-show" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

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