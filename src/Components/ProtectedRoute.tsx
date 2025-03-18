import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const ProtectedRoute: React.FC<{
    children: React.ReactNode;
    roles?: Array<'admin' | 'teacher' | 'client'>;
}> = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};