import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/groups', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username là bắt buộc';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await login(formData.username, formData.password);
      // Navigation will happen automatically via useEffect
    } catch (err) {
      setError(err.message || 'Sai username hoặc password');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center -mt-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý chi tiêu
            </h1>
            <p className="text-gray-600">
              Đăng nhập để tiếp tục
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Error Message */}
              {error && (
                <ErrorMessage 
                  message={error} 
                  onClose={() => setError('')}
                />
              )}

              {/* Username Input */}
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập username"
                error={errors.username}
                required
                disabled={loading}
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập password"
                error={errors.password}
                required
                disabled={loading}
              />

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Đang đăng nhập...
                  </span>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Demo: Cần tạo user trong Firestore trước</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
