import { useState, useEffect } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../../services/firestoreService';
import Button from '../Button';
import Card from '../Card';
import Modal from '../Modal';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username là bắt buộc';
    if (!formData.password) newErrors.password = 'Password là bắt buộc';
    if (!formData.name.trim()) newErrors.name = 'Tên là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      await createUser(formData);
      onSuccess();
      onClose();
      // Reset form
      setFormData({ username: '', password: '', name: '', role: 'user' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm người dùng">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
          disabled={loading}
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={loading}
        />
        
        <Input
          label="Tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          disabled={loading}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vai trò <span className="text-danger">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Đang lưu...' : 'Thêm'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        role: user.role || 'user'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username là bắt buộc';
    if (!formData.name.trim()) newErrors.name = 'Tên là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      await updateUser(user.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sửa người dùng">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
          disabled={loading}
        />
        
        <Input
          label="Tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          disabled={loading}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vai trò <span className="text-danger">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Đang lưu...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err) {
      setError('Không thể xóa người dùng: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className="mb-4">
        <Button fullWidth onClick={() => setShowAddModal(true)}>
          + Thêm người dùng
        </Button>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách người dùng ({users.length})
        </h3>
        
        <div className="space-y-3">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                  user.role === 'admin' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(user)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => setDeleteConfirm(user.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchUsers}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Xác nhận xóa"
        >
          <p className="mb-4">Bạn có chắc muốn xóa người dùng này?</p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setDeleteConfirm(null)}>
              Hủy
            </Button>
            <Button variant="danger" fullWidth onClick={() => handleDelete(deleteConfirm)}>
              Xóa
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
