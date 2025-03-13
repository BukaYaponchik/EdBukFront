import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../GeneralStyles/Indication.css';

const ConfirmationNumber: React.FC = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft === 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleResendCode = () => {
        // Здесь будет запрос на бэкенд для повторной отправки кода
        setTimeLeft(60);
        setCanResend(false);
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === '1234') {
            navigate('/timetable');
        } else {
            setError('Неверный код подтверждения');
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
                        {canResend ? (
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