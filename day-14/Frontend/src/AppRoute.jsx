import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'

const AppRoute = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoute