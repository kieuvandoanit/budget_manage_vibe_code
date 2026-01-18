import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createExpense } from '../services/firestoreService';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateExpense = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    
    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Số tiền là bắt buộc';
    } else if (isNaN(amount)) {
      newErrors.amount = 'Số tiền phải là số';
    } else if (amount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }
    
    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      const amount = parseFloat(formData.amount);
      
      await createExpense(
        user.userId,
        groupId,
        amount,
        formData.description.trim()
      );
      
      setSuccess(true);
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate(`/groups/${groupId}`);
      }, 1000);
    } catch (err) {
      setError('Không thể tạo chi tiêu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Nhập chi tiêu
        </h1>
        <p className="text-gray-600">
          Thêm chi tiêu mới vào nhóm
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-success rounded-lg p-4 mb-4">
          <p className="text-success font-medium">
            ✓ Đã tạo chi tiêu thành công!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />
      )}

      {/* Expense Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
          <Input
            label="Số tiền (VND)"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Nhập số tiền"
            error={errors.amount}
            required
            disabled={loading || success}
          />

          {/* Description Textarea */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
              <span className="text-danger ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chi tiêu"
              required
              disabled={loading || success}
              rows={4}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.description ? 'border-danger' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleCancel}
              disabled={loading || success}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              fullWidth
              disabled={loading || success}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Đang lưu...
                </span>
              ) : (
                'Lưu chi tiêu'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateExpense;
