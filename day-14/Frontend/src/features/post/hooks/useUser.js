import { changeFollowRequestStatus, followUser, getme, unfollowUser } from "../services/user.api";

export function useUser() {
    const getMe = async () => {
        try {
            const data = await getme();
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    const handleFollowUser = async (username) => {
        const data = await followUser(username);
        return data;
    }

    const handleUnfollowUser = async (username) => {
        const data = await unfollowUser(username);
        return data;
    }

    const handleFollowRequestAction = async (username, status) => {
        const data = await changeFollowRequestStatus(username, status);
        return data;
    }

    return { getMe, handleFollowUser, handleUnfollowUser, handleFollowRequestAction }
}