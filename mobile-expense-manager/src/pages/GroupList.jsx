import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGroupsByUserId } from '../services/firestoreService';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const GroupCard = ({ group, onClick }) => {
  return (
    <Card onClick={onClick} className="mb-3">
      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
      <p className="text-sm text-gray-500 mt-1">
        Nhấn để xem chi tiết
      </p>
    </Card>
  );
};

const GroupList = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const userGroups = await getGroupsByUserId(user.userId);
      setGroups(userGroups);
    } catch (err) {
      setError('Không thể tải danh sách nhóm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Xin chào, {user?.username}
            </h1>
            <p className="text-sm text-gray-600">
              {isAdmin ? 'Quản trị viên' : 'Người dùng'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>

        {/* Admin Dashboard Link */}
        {isAdmin && (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            Quản lý hệ thống
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {/* Groups List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Nhóm của bạn
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : groups.length === 0 ? (
          // Empty State
          <Card className="text-center py-8">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có nhóm nào
            </h3>
            <p className="text-gray-600">
              Liên hệ quản trị viên để được thêm vào nhóm
            </p>
          </Card>
        ) : (
          // Groups List
          <div>
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => handleGroupClick(group.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GroupList;
