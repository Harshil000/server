import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})

export async function register(formData) {
    try {
        const response = await api.post(
            '/register',
            formData
        )
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error (error.response.data.msg || 'Registration failed')
        } else if (error.request) {
            throw new Error('Network error. Please try again.')
        } else {
            throw new Error('Something went wrong')
        }
    }
}

export async function login(formData) {
    try {
        const response = await api.post(
            '/login',
            formData
        )
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.msg || 'Login failed')
        } else if (error.request) {
            throw new Error('Network error. Please try again.')
        } else {
            throw new Error('Something went wrong')
        }
    }
}