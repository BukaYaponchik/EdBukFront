import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    phone: string;
    role: 'admin' | 'teacher' | 'client';
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    avatar?: string;
    courseIds?: string[]; // Add courseIds property to store course IDs
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Проверка localStorage при загрузке
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = (userData: User) => {
        const mergedUser = {
            ...userData,
            courseIds: userData.courseIds || [] // Добавляем курс IDs из ответа сервера
        };
        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
