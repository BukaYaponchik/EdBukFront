import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../GeneralStyles/Indication.css';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone: '+7 ',
        password: ''
    });
    const [errors, setErrors] = useState({
        phone: '',
        password: ''
    });

    // Валидация номера телефона
    const validatePhone = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '').slice(1);
        if (!/^\d{10}$/.test(cleaned)) return 'Некорректный номер телефона';
        return '';
    };

    // Валидация пароля с русскими буквами
    const validatePassword = (password: string) => {
        if (password.length < 8 || password.length > 24) return 'Длина пароля 8-24 символа';
        if (!/[\p{L}]/u.test(password) || !/\d/.test(password))
            return 'Пароль должен содержать буквы и цифры';
        return '';
    };

    // Обработчик для телефона
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const cleaned = input.replace(/\D/g, '').slice(0, 11);

        let formatted = '+7 ';
        if (cleaned.length > 1) {
            const rest = cleaned.slice(1);
            const parts = [
                rest.slice(0, 3),
                rest.slice(3, 6),
                rest.slice(6, 8),
                rest.slice(8, 10)
            ];

            formatted += parts[0] ? `(${parts[0]}` : '';
            formatted += parts[1] ? `) ${parts[1]}` : '';
            formatted += parts[2] ? ` ${parts[2]}` : '';
            formatted += parts[3] ? `-${parts[3]}` : '';
        }

        setFormData({...formData, phone: formatted});
        setErrors({...errors, phone: validatePhone(formatted)});
    };

    // Общий обработчик
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
        if (name === 'password') setErrors({...errors, password: validatePassword(value)});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalValidation = {
            phone: validatePhone(formData.phone),
            password: validatePassword(formData.password)
        };

        if (Object.values(finalValidation).every(x => x === '')) {
            navigate('/confirmationnumber');
        } else {
            setErrors(finalValidation);
        }
    };

    return (
        <div className="registration-page">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1>Вход</h1>
                {/* Поле Телефон */}
                <div className="form-group">
                    <label htmlFor="phone">Номер телефона:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        required
                        pattern="\+7\s\(\d{3}\)\s\d{3}\s\d{2}-\d{2}"
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>

                {/* Поле Пароль */}
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                        >
                            <img
                                src={showPassword ? "/icons/eye-open.png" : "/icons/eye-closed.png"}
                                alt="Toggle password visibility"
                                className="eye-icon"
                            />
                        </button>
                    </div>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                {/* Кнопка войти */}
                <button type="submit" className="submit-button">
                    Войти
                </button>

                {/* Сноска на переход */}
                <div className="login-prompt">
                    У вас нет аккаунта?{' '}
                    <a
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/');
                        }}
                    >
                        Зарегистрироваться
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;