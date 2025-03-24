import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import Header from '../../../Components/Header/Header';
import { api, ENDPOINTS } from '../../../API/api';
import './Profile.css';

const convertDDMMYYYYToYYYYMMDD = (dateString: string) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const convertYYYYMMDDToDDMMYYYY = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
};

// Мемоизация компонента формы профиля
const ProfileForm = memo(({
                              formData,
                              isEditing,
                              onFieldChange,
                              onFileUpload,
                              onSubmit,
                              onCancelEdit,
                              onStartEdit
                          }: {
    formData: any;
    isEditing: boolean;
    onFieldChange: (field: string, value: string) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancelEdit: () => void;
    onStartEdit: () => void;
}) => {
    // Выносим обработчик события кнопки в отдельную функцию
    // для предотвращения всплытия события
    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Предотвращаем всплытие события
        onStartEdit();
    };

    return (
        <div className="profile-content">
            <div className="profile-header">
                <label className="avatar-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileUpload}
                        disabled={!isEditing}
                    />
                    <img
                        src={formData.avatar || '/default-avatar.png'}
                        alt="Аватар"
                        className="avatar-image"
                    />
                </label>
            </div>

            <form className="profile-form" onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Имя:</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => onFieldChange('firstName', e.target.value)}
                        readOnly={!isEditing}
                        style={{
                            background: isEditing ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            color: isEditing ? '#333' : 'white'
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Фамилия:</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => onFieldChange('lastName', e.target.value)}
                        readOnly={!isEditing}
                        style={{
                            background: isEditing ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            color: isEditing ? '#333' : 'white'
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => onFieldChange('email', e.target.value)}
                        readOnly={!isEditing}
                        style={{
                            background: isEditing ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            color: isEditing ? '#333' : 'white'
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Дата рождения:</label>
                    <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => onFieldChange('birthDate', e.target.value)}
                        disabled={!isEditing}
                        style={{
                            background: isEditing ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            color: isEditing ? '#333' : 'white'
                        }}
                        pattern="\d{4}-\d{2}-\d{2}"
                    />
                </div>

                <div className="form-actions">
                    {isEditing ? (
                        <>
                            <button type="submit" className="save-button">
                                Сохранить
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={onCancelEdit}
                            >
                                Отмена
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="edit-button"
                            onClick={handleEditClick}
                        >
                            Редактировать
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
});

const ProfilePage: React.FC = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'purchases' | 'lessons'>('profile');
    const [isEditing, setIsEditing] = useState(false);

    // Используем useRef для данных формы, чтобы избежать ререндеринга при вводе
    const formDataRef = useRef({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        avatar: ''
    });

    // Состояние для контролируемого обновления интерфейса
    const [formState, setFormState] = useState({...formDataRef.current});

    // Флаг для отслеживания первой инициализации
    const isInitializedRef = useRef(false);

    // Инициализация данных профиля
    useEffect(() => {
        if (user && !isInitializedRef.current) {
            const userData = {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                birthDate: convertDDMMYYYYToYYYYMMDD(user.birthDate || ''),
                avatar: user.avatar || ''
            };
            formDataRef.current = userData;
            setFormState({...userData});
            isInitializedRef.current = true;
        }
    }, [user]);

    // Обработчик изменения полей формы
    const handleFieldChange = useCallback((field: string, value: string) => {
        formDataRef.current = {
            ...formDataRef.current,
            [field]: value
        };
        // Обновляем состояние для отображения в интерфейсе
        setFormState(prev => ({...prev, [field]: value}));
    }, []);

    // Обработчик загрузки файла
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const avatar = reader.result as string;
                formDataRef.current = {...formDataRef.current, avatar};
                setFormState(prev => ({...prev, avatar}));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // Обработчик отправки формы
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing || !user) return;

        try {
            const dataToSend = {
                ...formDataRef.current,
                userId: user.id,
                birthDate: convertYYYYMMDDToDDMMYYYY(formDataRef.current.birthDate)
            };

            // Отправка на сервер
            const updatedUser = await api.post(ENDPOINTS.UPDATE_PROFILE, dataToSend);

            // Обновляем контекст и localStorage
            login({
                ...user,
                ...updatedUser
            });

            setIsEditing(false);
        } catch (error) {
            console.error('Ошибка обновления:', error);
            // Можно добавить уведомление об ошибке
        }
    }, [isEditing, user, login]);

    // Обработчик отмены редактирования
    const handleCancelEdit = useCallback(() => {
        if (user) {
            const userData = {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                birthDate: convertDDMMYYYYToYYYYMMDD(user.birthDate || ''),
                avatar: user.avatar || ''
            };
            formDataRef.current = userData;
            setFormState({...userData});
        }
        setIsEditing(false);
    }, [user]);

    // Обработчик начала редактирования
    const handleStartEdit = useCallback(() => {
        console.log('Начало редактирования');
        setIsEditing(true);
    }, []);

    const PurchasesContent = () => (
        <div className="purchases-content">
            <h2>История покупок</h2>
            <div className="empty-state">
                <p>У вас пока нет совершенных покупок</p>
            </div>
        </div>
    );

    const LessonsContent = () => (
        <div className="lessons-content">
            <h2>Активные занятия</h2>
            <div className="empty-state">
                <p>У вас нет активных занятий</p>
            </div>
        </div>
    );

    console.log('Текущий режим редактирования:', isEditing);

    return (
        <>
            <Header />
            <div className="profile-page">
                <div className="sidebar">
                    <button
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Профиль
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'lessons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lessons')}
                    >
                        Активные занятия
                    </button>

                    <button
                        className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
                        onClick={() => setActiveTab('purchases')}
                    >
                        Покупки
                    </button>
                </div>

                <div className="main-content">
                    {activeTab === 'profile' && (
                        <ProfileForm
                            formData={formState}
                            isEditing={isEditing}
                            onFieldChange={handleFieldChange}
                            onFileUpload={handleFileUpload}
                            onSubmit={handleSubmit}
                            onCancelEdit={handleCancelEdit}
                            onStartEdit={handleStartEdit}
                        />
                    )}
                    {activeTab === 'purchases' && <PurchasesContent />}
                    {activeTab === 'lessons' && <LessonsContent />}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
