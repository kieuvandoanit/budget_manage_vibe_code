import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup
} from '../../services/firestoreService';
import Button from '../Button';
import Card from '../Card';
import Modal from '../Modal';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const AddGroupModal = ({ isOpen, onClose, onSuccess, currentUserId }) => {
  const [formData, setFormData] = useState({ name: '' });
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
    if (!formData.name.trim()) newErrors.name = 'Tên nhóm là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      await createGroup({
        name: formData.name.trim(),
        createdBy: currentUserId
      });
      onSuccess();
      onClose();
      setFormData({ name: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm nhóm">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <Input
          label="Tên nhóm"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Nhập tên nhóm"
          required
          disabled={loading}
        />

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

const EditGroupModal = ({ isOpen, onClose, group, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (group) {
      setFormData({ name: group.name || '' });
    }
  }, [group]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên nhóm là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      await updateGroup(group.id, { name: formData.name.trim() });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sửa nhóm">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <Input
          label="Tên nhóm"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Nhập tên nhóm"
          required
          disabled={loading}
        />

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

const GroupManagement = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllGroups();
      setGroups(data);
    } catch (err) {
      setError('Không thể tải danh sách nhóm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setShowEditModal(true);
  };

  const handleDelete = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setDeleteConfirm(null);
      fetchGroups();
    } catch (err) {
      setError('Không thể xóa nhóm: ' + err.message);
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
          + Thêm nhóm
        </Button>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Danh sách nhóm ({groups.length})
        </h3>
        
        <div className="space-y-3">
          {groups.map(group => (
            <div key={group.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{group.name}</p>
                <p className="text-sm text-gray-500">
                  ID: {group.id}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(group)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => setDeleteConfirm(group.id)}>
                  Xóa
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AddGroupModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchGroups}
        currentUserId={user?.userId}
      />

      <EditGroupModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
        onSuccess={fetchGroups}
      />

      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Xác nhận xóa"
        >
          <p className="mb-4">
            Bạn có chắc muốn xóa nhóm này? Tất cả thành viên và giao dịch sẽ bị xóa.
          </p>
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

export default GroupManagement;
