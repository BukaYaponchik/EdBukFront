import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Authentication/RegistrationForm/RegistrationForm';
import Timetable from './pages/Hat/Timetable/Timetable';
import LoginForm from './pages/Authentication/LoginForm/LoginForm';
import ConfirmationNumber from './pages/Authentication/ConfirmationNumber/ConfirmationNumber';
import { AuthProvider } from './Context/AuthContext';
import { ProtectedRoute } from "./Components/ProtectedRoute";

const App: React.FC = () => {
    return (
        <Router> {/* Добавьте Router на верхний уровень */}
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/confirmationnumber" element={<ConfirmationNumber />} />

                    <Route path="/timetable" element={
                        <ProtectedRoute roles={['admin', 'teacher', 'client']}>
                            <Timetable />
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;