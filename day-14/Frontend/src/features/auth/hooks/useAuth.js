import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, getme } from "../services/auth.api";

export function useAuth() {
    const context = useContext(AuthContext)
    
    const { user, loading, error, setUser, setLoading, setError } = context

    const handleLogin = async (formData) => {
        setLoading(true)
        setError(null)
        try {
            const response = await login(formData)
            setUser(response.user)
            return response
        } catch (err) {
            const errorMessage = err.message || 'Login failed'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (formData, profilePicFile = null) => {
        setLoading(true)
        setError(null)
        try {
            // Build FormData in hooks layer (business logic), not UI layer
            const data = new FormData()
            data.append('name', formData.name)
            data.append('userName', formData.username)
            data.append('email', formData.email)
            data.append('password', formData.password)
            data.append('bio', formData.bio || '')
            
            // Add profile picture if provided
            if (profilePicFile) {
                data.append('profilePic', profilePicFile)
            }

            const response = await register(data)
            setUser(response.user)
            return response
        } catch (err) {
            const errorMessage = err.message || 'Registration failed'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, error, handleLogin, handleRegister };
}