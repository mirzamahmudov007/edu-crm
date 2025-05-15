import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchUsers, createUser, updateUser, User } from '../../store/usersSlice';

const { Option } = Select;

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, status } = useSelector((state: RootState) => state.users);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  // const handleDeleteUser = async (id: number) => {
  //   try {
  //     await dispatch(deleteUser(id)).unwrap();
  //     message.success('User deleted successfully');
  //   } catch (error) {
  //     message.error('Failed to delete user');
  //   }
  // };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, userData: values })).unwrap();
        message.success('User updated successfully');
      } else {
        await dispatch(createUser(values)).unwrap();
        message.success('User created successfully');
      }
      setIsModalVisible(false);
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <>
          <Button type="link" onClick={() => handleEditUser(record)}>
            Edit
          </Button>
          {/* <Button type="link" danger onClick={() => handleDeleteUser(record.id)}>
            Delete
          </Button> */}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Button type="primary" onClick={handleAddUser} style={{ marginBottom: '16px' }}>
        Add User
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={status === 'loading'}
      />
      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          {!editingUser && (
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input username!' }]}
            >
              <Input />
            </Form.Item>
          )}
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select>
              <Option value="ADMIN">Admin</Option>
              <Option value="TEACHER">Teacher</Option>
              <Option value="STUDENT">Student</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users; 