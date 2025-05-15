import * as React from 'react';
import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { 
  fetchUsers, 
  fetchDeletedUsers,
  createUser, 
  updateUser, 
  softDeleteUser, 
  restoreUser, 
  hardDeleteUser,
  User
} from '../../store/usersSlice';

const { Option } = Select;
const { Search } = Input;

interface UserFormData {
  username: string;
  password?: string;
  fullName: string;
  role: string;
}



const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, deletedUsers, status } = useSelector((state: RootState) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<UserFormData>();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [hardDeleteModalOpen, setHardDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDeletedUsers());
  }, [dispatch]);

  const displayedUsers = showDeleted ? deletedUsers : users;

  const filteredUsers = displayedUsers.filter((user: User) => {
    const matchesSearch = searchText.toLowerCase() === '' || 
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '25%',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: '35%',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '20%',
      render: (role: string) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
          role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {role}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          {!showDeleted ? (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                danger
              />
            </>
          ) : (
            <>
              <Button
                type="text"
                icon={<UndoOutlined />}
                onClick={() => handleRestore(record.id)}
                className="text-green-600 hover:text-green-700"
              />
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => handlePermanentDelete(record.id)}
                danger
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    setChangePassword(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setChangePassword(false);
    form.setFieldsValue({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setSelectedUserId(id);
    setDeleteModalOpen(true);
  };

  const handleRestore = (id: number) => {
    setSelectedUserId(id);
    setRestoreModalOpen(true);
  };

  const handlePermanentDelete = (id: number) => {
    setSelectedUserId(id);
    setHardDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUserId) return;
    try {
      await dispatch(softDeleteUser(selectedUserId)).unwrap();
      message.success('Foydalanuvchi muvaffaqiyatli o\'chirildi');
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
    } catch (error) {
      message.error('Foydalanuvchini o\'chirishda xatolik yuz berdi');
    }
    setDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedUserId) return;
    try {
      await dispatch(restoreUser(selectedUserId)).unwrap();
      message.success('Foydalanuvchi muvaffaqiyatli tiklandi');
      dispatch(fetchUsers());
      dispatch(fetchDeletedUsers());
    } catch (error) {
      message.error('Foydalanuvchini tiklashda xatolik yuz berdi');
    }
    setRestoreModalOpen(false);
    setSelectedUserId(null);
  };

  const handleHardDeleteConfirm = async () => {
    if (!selectedUserId) return;
    try {
      await dispatch(hardDeleteUser(selectedUserId)).unwrap();
      message.success('Foydalanuvchi butunlay o\'chirildi');
      dispatch(fetchDeletedUsers());
    } catch (error) {
      message.error('Foydalanuvchini o\'chirishda xatolik yuz berdi');
    }
    setHardDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        const updateData = {
          ...values,
          id: editingUser.id,
        };
        
        // Only include password if changePassword is true
        if (changePassword && values.password) {
          updateData.password = values.password;
        }
        
        await dispatch(updateUser({ 
          id: editingUser.id, 
          userData: updateData 
        })).unwrap();
        message.success('User updated successfully');
      } else {
        if (!values.password) {
          message.error('Password is required for new users');
          return;
        }
        await dispatch(createUser(values)).unwrap();
        message.success('User added successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {showDeleted ? 'O\'chirilgan foydalanuvchilar' : 'Faol foydalanuvchilar'}
          </h2>
          <div className="flex gap-4">
            <Button
              type={showDeleted ? 'default' : 'primary'}
              onClick={() => setShowDeleted(false)}
            >
              Faol foydalanuvchilar
            </Button>
            <Button
              type={showDeleted ? 'primary' : 'default'}
              danger={showDeleted}
              onClick={() => setShowDeleted(true)}
            >
              O'chirilganlar
            </Button>
            {!showDeleted && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="bg-blue-600"
              >
                Yangi qo'shish
              </Button>
            )}
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <Search
            placeholder="Username yoki FIO bo'yicha qidirish"
            allowClear
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Role bo'yicha filterlash"
            allowClear
            style={{ width: 200 }}
            onChange={(value: string | null) => setRoleFilter(value)}
          >
            <Option value="ADMIN">Admin</Option>
            <Option value="TEACHER">O'qituvchi</Option>
            <Option value="STUDENT">O'quvchi</Option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={status === 'loading'}
          bordered
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 10,
          }}
        />
      </div>
      
      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          
          {/* Password field for new users or when changing password */}
          {(!editingUser || changePassword) && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: !editingUser, message: 'Please input password!' }]}
            >
              <Input.Password className="rounded-md" />
            </Form.Item>
          )}
          
          {/* Change password checkbox for editing */}
          {editingUser && (
            <Form.Item>
              <Button type="link" onClick={() => setChangePassword(!changePassword)}>
                {changePassword ? 'Cancel password change' : 'Change password'}
              </Button>
            </Form.Item>
          )}
          
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select className="rounded-md">
              <Option value="ADMIN">Admin</Option>
              <Option value="TEACHER">Teacher</Option>
              <Option value="STUDENT">Student</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Soft Delete Confirmation Modal */}
      <Modal
        title="Foydalanuvchini o'chirish"
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedUserId(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedUserId(null);
            }}
          >
            Bekor qilish
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleDeleteConfirm}
          >
            O'chirish
          </Button>,
        ]}
      >
        <p>Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz? U o'chirilganlar ro'yxatiga ko'chiriladi.</p>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        title="Foydalanuvchini qayta tiklash"
        open={restoreModalOpen}
        onCancel={() => {
          setRestoreModalOpen(false);
          setSelectedUserId(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setRestoreModalOpen(false);
              setSelectedUserId(null);
            }}
          >
            Bekor qilish
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleRestoreConfirm}
          >
            Tiklash
          </Button>,
        ]}
      >
        <p>Haqiqatan ham bu foydalanuvchini qayta tiklamoqchimisiz? U faol foydalanuvchilar ro'yxatiga qaytariladi.</p>
      </Modal>

      {/* Hard Delete Confirmation Modal */}
      <Modal
        title="Foydalanuvchini butunlay o'chirish"
        open={hardDeleteModalOpen}
        onCancel={() => {
          setHardDeleteModalOpen(false);
          setSelectedUserId(null);
        }}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => {
              setHardDeleteModalOpen(false);
              setSelectedUserId(null);
            }}
          >
            Bekor qilish
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleHardDeleteConfirm}
          >
            Butunlay o'chirish
          </Button>,
        ]}
      >
        <div>
          <p className="text-red-600 font-medium mb-2">Diqqat!</p>
          <p>Bu amalni ortga qaytarib bo'lmaydi. Foydalanuvchi tizimdan butunlay o'chiriladi.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Users;