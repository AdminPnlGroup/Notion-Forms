import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loginTime = localStorage.getItem('loginTime');
        const oneHour = 60 * 60 * 1000;

        if (loginTime && Date.now() - parseInt(loginTime, 10) < oneHour) {
            setIsAuthenticated(true);

            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
            }

        } else {
            localStorage.removeItem('loginTime');
            localStorage.removeItem('currentUser');
            setIsAuthenticated(false);
        }

        setAuthLoaded(true);
    }, []);

    const login = (user) => {
        setIsAuthenticated(true);
        setCurrentUser(user); // ตั้งค่าผู้ใช้งาน
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('currentUser', JSON.stringify(user)); // เซฟใน localStorage
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('loginTime');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, authLoaded, currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

