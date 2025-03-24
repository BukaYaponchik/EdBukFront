import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '../../../Components/Header/Header';
import { api } from '../../../API/api';
import './Settings.css';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    role: 'client' | 'teacher' | 'curator' | 'admin';
}

interface UsersCache {
    [key: string]: User[];
}

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'clients' | 'teachers' | 'curators' | 'admins'>('clients');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchField, setSearchField] = useState<keyof User>('phone');
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Cache to store users by role to prevent re-fetching
    const usersCache = useRef<UsersCache>({});

    const roleMap = {
        clients: 'client',
        teachers: 'teacher',
        curators: 'curator',
        admins: 'admin'
    };

    // Memoize the fetch function to prevent unnecessary re-creation
    const fetchUsers = useCallback(async (tab: string) => {
        const roleKey = roleMap[tab as keyof typeof roleMap];

        // Return cached data if available
        if (usersCache.current[roleKey]) {
            setUsers(usersCache.current[roleKey]);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(`/users?role=${roleKey}`);
            const filteredUsers = response.data.filter(
                (user: User) => user.role === roleKey
            );

            // Update cache
            usersCache.current[roleKey] = filteredUsers;
            setUsers(filteredUsers);
            setError('');
        } catch (err) {
            setError('Ошибка загрузки данных');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(activeTab);
    }, [activeTab, fetchUsers]);

    // Switch tab with smooth transition
    const handleTabChange = (tab: 'clients' | 'teachers' | 'curators' | 'admins') => {
        // Only update if it's a different tab
        if (tab !== activeTab) {
            setActiveTab(tab);
            // Clear search when switching tabs for consistency
            setSearchQuery('');
        }
    };

    // Основная фильтрация данных
    const filteredUsers = users.filter(user => {
        if (!searchQuery.trim()) return true;
        const fieldValue = user[searchField];
        if (fieldValue === undefined || fieldValue === null) return false;
        return fieldValue.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Стабильный обработчик ввода
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Фокус на поле ввода после изменения активной вкладки
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [activeTab]);

    const renderTableSection = () => (
        <div className="settings-section">
            <form onSubmit={(e) => e.preventDefault()} className="search-container">
                <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value as keyof User)}
                    className="search-select"
                >
                    <option value="phone">Телефон</option>
                    <option value="firstName">Имя</option>
                    <option value="lastName">Фамилия</option>
                    <option value="email">Email</option>
                </select>

                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </form>

            <div className="table-container">
                {loading ? (
                    <div className="loading">Загрузка...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Дата рождения</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="no-results">Нет данных для отображения</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.birthDate}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="settings-page">
                <div className="sidebar">
                    <button
                        className={`tab-button ${activeTab === 'clients' ? 'active' : ''}`}
                        onClick={() => handleTabChange('clients')}
                    >
                        Клиенты
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'teachers' ? 'active' : ''}`}
                        onClick={() => handleTabChange('teachers')}
                    >
                        Учителя
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'curators' ? 'active' : ''}`}
                        onClick={() => handleTabChange('curators')}
                    >
                        Кураторы
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
                        onClick={() => handleTabChange('admins')}
                    >
                        Администраторы
                    </button>
                </div>

                <div className="main-content">
                    {renderTableSection()}
                </div>
            </div>
        </>
    );
};

export default Settings;
