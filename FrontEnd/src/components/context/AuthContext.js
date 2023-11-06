import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(null);

    useEffect(() => {
        // Load the auth state from localStorage when the component mounts
        const user = localStorage.getItem('user');
        if (user) {
            setAuthState(JSON.parse(user));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setAuthState(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuthState(null);
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
