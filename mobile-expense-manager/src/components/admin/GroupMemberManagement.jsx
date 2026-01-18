import { useState, useEffect } from 'react';
import {
  getAllGroups,
  getAllUsers,
  getGroupMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  updateMemberBalance
} from '../../services/firestoreService';
import Button from '../Button';
import Card from '../Card';
import Modal from '../Modal';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const AddMemberModal = ({ isOpen, onClose, groupId, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    initialBalance: '0'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userId) newErrors.userId = 'Vui lòng chọn người dùng';
    const balance = parseFloat(formData.initialBalance);
    if (isNaN(balance)) newErrors.initialBalance = 'Số dư phải là số';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const balance = parseFloat(formData.initialBalance);
      await addMemberToGroup(groupId, formData.userId, balance);
      onSuccess();
      onClose();
      setFormData({ userId: '', initialBalance: '0' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm thành viên">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Người dùng <span className="text-danger">*</span>
          </label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            disabled={loading}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.userId ? 'border-danger' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn người dùng</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} (@{user.username})
              </option>
            ))}
          </select>
          {errors.userId && <p className="mt-1 text-sm text-danger">{errors.userId}</p>}
        </div>
        
        <Input
          label="Số dư ban đầu (VND)"
          type="number"
          name="initialBalance"
          value={formData.initialBalance}
          onChange={handleChange}
          error={errors.initialBalance}
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

const AdjustBalanceModal = ({ isOpen, onClose, member, onSuccess }) => {
  const [formData, setFormData] = useState({ newBalance: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({ newBalance: member.balance.toString() });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const balance = parseFloat(formData.newBalance);
    if (isNaN(balance)) newErrors.newBalance = 'Số dư phải là số';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      const balance = parseFloat(formData.newBalance);
      await updateMemberBalance(member.id, balance);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Điều chỉnh số dư">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} onClose={() => setError('')} />}
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Thành viên</p>
          <p className="font-medium text-gray-900">{member?.userName}</p>
          <p className="text-sm text-gray-600 mt-2">Số dư hiện tại</p>
          <p className="font-semibold text-lg">{formatCurrency(member?.balance || 0)}</p>
        </div>
        
        <Input
          label="Số dư mới (VND)"
          type="number"
          name="newBalance"
          value={formData.newBalance}
          onChange={handleChange}
          error={errors.newBalance}
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

const GroupMemberManagement = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [selectedGroupId]);

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

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      setError('');
      const data = await getGroupMembers(selectedGroupId);
      setMembers(data);
    } catch (err) {
      setError('Không thể tải danh sách thành viên: ' + err.message);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await removeMemberFromGroup(memberId);
      setRemoveConfirm(null);
      fetchMembers();
    } catch (err) {
      setError('Không thể xóa thành viên: ' + err.message);
    }
  };

  const handleAdjustBalance = (member) => {
    setSelectedMember(member);
    setShowAdjustModal(true);
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

      {/* Group Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chọn nhóm
        </label>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Chọn nhóm --</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {selectedGroupId && (
        <>
          <div className="mb-4">
            <Button fullWidth onClick={() => setShowAddModal(true)}>
              + Thêm thành viên
            </Button>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thành viên ({members.length})
            </h3>
            
            {membersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : members.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Chưa có thành viên nào
              </p>
            ) : (
              <div className="space-y-3">
                {members.map(member => (
                  <div key={member.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.userName}</p>
                      <p className="text-sm text-gray-500">@{member.username}</p>
                      <p className={`text-sm font-semibold mt-1 ${
                        member.balance >= 0 ? 'text-success' : 'text-danger'
                      }`}>
                        {formatCurrency(member.balance)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleAdjustBalance(member)}>
                        Điều chỉnh
                      </Button>
                      <Button variant="danger" onClick={() => setRemoveConfirm(member.id)}>
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        groupId={selectedGroupId}
        onSuccess={fetchMembers}
      />

      <AdjustBalanceModal
        isOpen={showAdjustModal}
        onClose={() => {
          setShowAdjustModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSuccess={fetchMembers}
      />

      {removeConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setRemoveConfirm(null)}
          title="Xác nhận xóa"
        >
          <p className="mb-4">Bạn có chắc muốn xóa thành viên này khỏi nhóm?</p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setRemoveConfirm(null)}>
              Hủy
            </Button>
            <Button variant="danger" fullWidth onClick={() => handleRemove(removeConfirm)}>
              Xóa
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupMemberManagement;
