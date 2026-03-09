import { createContext, useState,  } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    return (
        <AuthContext.Provider value={{user , loading , error , setUser , setLoading , setError}}>
            {children}
        </AuthContext.Provider>
    )
}