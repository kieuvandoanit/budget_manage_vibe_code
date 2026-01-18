import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import UserManagement from '../components/admin/UserManagement';
import GroupManagement from '../components/admin/GroupManagement';
import GroupMemberManagement from '../components/admin/GroupMemberManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Người dùng' },
    { id: 'groups', label: 'Nhóm' },
    { id: 'members', label: 'Thành viên' }
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/groups')}
          className="mb-4"
        >
          ← Quay lại trang chủ
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý hệ thống
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'groups' && <GroupManagement />}
        {activeTab === 'members' && <GroupMemberManagement />}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
