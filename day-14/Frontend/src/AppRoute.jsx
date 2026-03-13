import { createBrowserRouter } from "react-router-dom"
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from "./features/post/pages/Feed";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Feed />
    },
    {
        path: "/about",
        element: <h1>About</h1>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);