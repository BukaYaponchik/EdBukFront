import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../GeneralStyles/Indication.css';
import { apiSMS, ENDPOINTSSMS } from '../../../API/apiSMS';
import { api, ENDPOINTS } from '../../../API/api';
import { useAuth } from '../../../Context/AuthContext';

const ConfirmationNumber: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const { login } = useAuth();

    const handleResendCode = async () => {
        try {
            await apiSMS.post(ENDPOINTSSMS.RESEND_CODE, {});
            setTimeLeft(60);
            setIsTimerActive(true); // Активируем таймер заново
            setError('');
        } catch (error) {
            setError('Ошибка при отправке кода');
        }
    };

    useEffect(() => {
        if (!isTimerActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsTimerActive(false); // Останавливаем таймер
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isTimerActive]); // Зависимость от isTimerActive

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Проверка кода
            const verifyResponse = await apiSMS.post(ENDPOINTSSMS.VERIFY_CODE, { code });

            if (!verifyResponse.success) {
                throw new Error("Код неверен");
            }

            // 2. Регистрация пользователя
            const tempData = sessionStorage.getItem('tempRegistrationData');
            if (!tempData) throw new Error('Данные регистрации утеряны');

            const registrationData = JSON.parse(tempData);
            const registerResponse = await api.post(ENDPOINTS.REGISTER, {
                ...registrationData,
                phone: registrationData.phone.replace(/\D/g, '')
            });

            // 3. Проверка данных пользователя
            if (!registerResponse.user) {
                throw new Error("Данные пользователя не получены");
            }

            // 4. Авторизация и переход
            login(registerResponse.user);
            sessionStorage.removeItem('tempRegistrationData');
            navigate('/timetable');

        } catch (error) {
            console.error("Ошибка:", error);
            setError('Неверный код или ошибка регистрации');
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="registration-page">
            <form className="registration-form" onSubmit={handleSubmit}>
                <h1>Подтверждение номера телефона</h1>

                <div className="form-group">
                    <label htmlFor="code">Код подтверждения:</label>
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.replace(/\D/g, ''));
                            setError('');
                        }}
                        maxLength={4}
                        required
                    />
                    {error && <div className="error-message">{error}</div>}

                    <div className="resend-code">
                        {timeLeft === 0 ? (
                            <button
                                type="button"
                                className="resend-button"
                                onClick={handleResendCode}
                            >
                                Отправить код повторно
                            </button>
                        ) : (
                            <span>Отправить код повторно через {formatTime(timeLeft)}</span>
                        )}
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    Подтвердить
                </button>
            </form>
        </div>
    );
};

export default ConfirmationNumber;