import axios from 'axios'

const api = axios.create(
    {
        baseURL: "http://localhost:3000/api/posts/",
        withCredentials: true
    }
)

export async function getFeed() {
    try {
        const response = await api.get('/feed')
        return response.data
    } catch (error) {
        throw new Error (error.response?.data?.msg || 'Failed to fetch feed')
    }
}

export async function createPost(formData) {
    try {
        const response = await api.post('/', formData)
        console.log('API response:', response.status);
        return response.status
    } catch (error) {
        throw new Error (error.response?.data?.msg || 'Failed to create post')
    }
}