import axios from 'axios'

const api = axios.create(
    {
        baseURL: "http://localhost:3000/api/users/",
        withCredentials: true
    }
)

export async function getme() {
    try {
        const me = await api.get('/getMe')
        const myPosts = await axios.get('http://localhost:3000/api/posts/myPosts', { withCredentials: true })

        return {
            me: me.data.user,
            posts: myPosts.data.posts,
            followers: me.data.followers || [],
            otherUsers: me.data.otherUsers || [],
            followRequests: me.data.followRequests || [],
            counts: me.data.counts || { followers: 0, following: 0 },
        }
    } catch (error) {
        throw error
    }
}

export async function followUser(username) {
    try {
        const response = await api.get(`/follow/${username}`)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.msg || 'Failed to send follow request')
    }
}

export async function unfollowUser(username) {
    try {
        const response = await api.get(`/unfollow/${username}`)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.msg || 'Failed to unfollow user')
    }
}

export async function changeFollowRequestStatus(username, status) {
    try {
        const response = await api.get(`/changeFollowerStatus/${username}/${status}`)
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.msg || 'Failed to update follow request')
    }
}