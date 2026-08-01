import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, setError } from '../auth.slice.js';
import { register, login , getMe } from '../services/auth.service.js';

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            const data = await register({ email, username, password });
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to register"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ EmailOrUsername, password }) {
        try {
            dispatch(setLoading(true));
            const data = await login({ EmailOrUsername, password });
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to login"));
        } finally {
            dispatch(setLoading(false));
        }

    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user data"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    }
}