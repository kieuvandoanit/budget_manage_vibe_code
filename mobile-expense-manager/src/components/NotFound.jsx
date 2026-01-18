import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // If user is authenticated, redirect to home (groups)
      // If not authenticated, redirect to login
      const redirectPath = isAuthenticated ? '/groups' : '/login';
      
      // Redirect after a short delay
      const timer = setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Trang không tồn tại</p>
        <p className="text-gray-500">
          Đang chuyển hướng...
        </p>
        <div className="mt-6">
          <LoadingSpinner size="md" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
