import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getGroupById,
  getGroupMembers,
  getTransactionsByGroup,
  updateExpense,
  deleteExpense
} from '../services/firestoreService';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import Input from '../components/Input';

// Format currency in VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const MemberList = ({ members }) => {
  // Sort members by balance (descending)
  const sortedMembers = [...members].sort((a, b) => b.balance - a.balance);

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thành viên
      </h3>
      <div className="space-y-3">
        {sortedMembers.map(member => (
          <div 
            key={member.id}
            className="flex items-center justify-between py-2 border-b last:border-b-0"
          >
            <div>
              <p className="font-medium text-gray-900">{member.userName}</p>
              <p className="text-sm text-gray-500">@{member.username}</p>
            </div>
            <div className={`text-right ${member.balance >= 0 ? 'text-success' : 'text-danger'}`}>
              <p className="font-semibold">{formatCurrency(member.balance)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const TransactionHistory = ({ transactions, members, selectedUserId, onUserChange, currentUserId, onEdit, onDelete }) => {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB - dateA;
  });

  // Filter transactions by selected user
  const filteredTransactions = selectedUserId === 'all' 
    ? sortedTransactions 
    : sortedTransactions.filter(t => t.userId === selectedUserId);

  // Get user name for transaction
  const getUserName = (userId) => {
    const member = members.find(m => m.userId === userId);
    return member?.userName || 'Unknown';
  };

  // Check if current user can edit/delete this transaction
  const canModify = (transaction) => {
    return transaction.userId === currentUserId;
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Lịch sử chi tiêu
      </h3>

      {/* User Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo người dùng
        </label>
        <select
          value={selectedUserId}
          onChange={(e) => onUserChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả thành viên</option>
          {members.map(member => (
            <option key={member.userId} value={member.userId}>
              {member.userName}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Chưa có giao dịch nào
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map(transaction => (
            <div 
              key={transaction.id}
              className="py-3 border-b last:border-b-0"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {getUserName(transaction.userId)}
                  </p>
                </div>
                <p className="font-semibold text-red-600 ml-3">
                  -{formatCurrency(transaction.amount)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {formatDate(transaction.createdAt)}
                </p>
                
                {/* Edit/Delete buttons - only show for own transactions */}
                {canModify(transaction) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(transaction)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit/Delete modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchGroupData();
  }, [groupId, user]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch group info
      const groupData = await getGroupById(groupId);
      setGroup(groupData);
      
      // Fetch members
      const membersData = await getGroupMembers(groupId);
      setMembers(membersData);
      
      // Fetch ALL transactions for the group (not just user's)
      const transactionsData = await getTransactionsByGroup(groupId);
      setTransactions(transactionsData);
    } catch (err) {
      setError('Không thể tải thông tin nhóm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = () => {
    navigate(`/groups/${groupId}/expense`);
  };

  const handleBack = () => {
    navigate('/groups');
  };

  const handleUserFilterChange = (userId) => {
    setSelectedUserId(userId);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditDescription(transaction.description);
    setShowEditModal(true);
  };

  const handleDelete = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTransaction) return;
    
    try {
      setActionLoading(true);
      setError('');
      
      const amount = parseFloat(editAmount);
      
      if (isNaN(amount) || amount <= 0) {
        setError('Số tiền không hợp lệ');
        return;
      }
      
      await updateExpense(
        selectedTransaction.id,
        user.userId,
        groupId,
        amount,
        editDescription
      );
      
      // Refresh data
      await fetchGroupData();
      
      // Close modal
      setShowEditModal(false);
      setSelectedTransaction(null);
      setEditAmount('');
      setEditDescription('');
    } catch (err) {
      setError('Không thể cập nhật chi tiêu: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;
    
    try {
      setActionLoading(true);
      setError('');
      
      await deleteExpense(
        selectedTransaction.id,
        user.userId,
        groupId
      );
      
      // Refresh data
      await fetchGroupData();
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedTransaction(null);
    } catch (err) {
      setError('Không thể xóa chi tiêu: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="mb-4"
        >
          ← Quay lại
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {group?.name}
        </h1>

        {/* Create Expense Button */}
        <Button
          fullWidth
          onClick={handleCreateExpense}
        >
          Nhập chi tiêu
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {/* Member List */}
      <MemberList members={members} />

      {/* Transaction History with Filter */}
      <TransactionHistory 
        transactions={transactions}
        members={members}
        selectedUserId={selectedUserId}
        onUserChange={handleUserFilterChange}
        currentUserId={user?.userId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Sửa chi tiêu"
      >
        <form onSubmit={handleEditSubmit}>
          <Input
            label="Số tiền"
            type="number"
            name="amount"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            placeholder="Nhập số tiền"
            required
            disabled={actionLoading}
          />
          
          <Input
            label="Mô tả"
            type="text"
            name="description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Nhập mô tả"
            required
            disabled={actionLoading}
          />
          
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowEditModal(false)}
              disabled={actionLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={actionLoading}
            >
              {actionLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa"
      >
        <p className="text-gray-700 mb-6">
          Bạn có chắc chắn muốn xóa chi tiêu này không? Số dư của bạn sẽ được cập nhật lại.
        </p>
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => setShowDeleteModal(false)}
            disabled={actionLoading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="danger"
            fullWidth
            onClick={handleDeleteConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default GroupDetail;
