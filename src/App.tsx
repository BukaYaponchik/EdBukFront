import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/Authentication/RegistrationForm/RegistrationForm';
import Shop from './pages/Hat/Shop/Shop';
import LoginForm from './pages/Authentication/LoginForm/LoginForm';
import ConfirmationNumber from './pages/Authentication/ConfirmationNumber/ConfirmationNumber';
import { AuthProvider } from './Context/AuthContext';
import { ProtectedRoute } from "./Components/ProtectedRoute";
import  ProfilePage  from "./pages/Hat/Profile/Profile";
import  Courses  from "./pages/Hat/Courses/Courses";
import  School  from "./pages/Hat/School/School";
import  Settings  from "./pages/Hat/Settings/Settings";

const App: React.FC = () => {
    return (
        <Router> {/* Добавьте Router на верхний уровень */}
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<RegistrationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/confirmationnumber" element={<ConfirmationNumber />} />

                    <Route path="/courses" element={
                        <ProtectedRoute roles={['admin', 'teacher', 'client']}>
                            <Courses />
                        </ProtectedRoute>
                    } />

                    <Route path="/school" element={
                        <ProtectedRoute roles={['admin', 'teacher', 'client']}>
                            <School />
                        </ProtectedRoute>
                    } />

                    <Route path="/shop" element={
                        <ProtectedRoute roles={['admin', 'teacher', 'client']}>
                            <Shop />
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute roles={['admin', 'teacher', 'client']}>
                            <Settings />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute roles={['admin', 'teacher', 'client']}>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />

                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;