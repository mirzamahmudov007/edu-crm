import React from 'react';
import { Card, Form, Input, Button, message, Typography, Avatar, Space } from 'antd';
import { UserOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/authSlice';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const onFinish = async (values: any) => {
    try {
      await dispatch(updateProfile(values));
      message.success('Profil muvaffaqiyatli yangilandi');
    } catch (error) {
      message.error('Profilni yangilashda xatolik yuz berdi');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Space direction="vertical" size="large">
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#1890ff',
                fontSize: '40px'
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>{user?.fullName}</Title>
              <Text type="secondary">{user?.username}</Text>
            </div>
          </Space>
        </div>

        <Form
          name="profile"
          initialValues={{
            username: user?.username,
            fullName: user?.fullName,
          }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="Foydalanuvchi nomi"
            name="username"
            rules={[{ required: true, message: 'Foydalanuvchi nomini kiriting' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              disabled 
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            label="To'liq ism"
            name="fullName"
            rules={[{ required: true, message: 'To\'liq ismingizni kiriting' }]}
          >
            <Input 
              prefix={<EditOutlined style={{ color: '#1890ff' }} />}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            label="Yangi parol"
            name="password"
            rules={[
              { min: 6, message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            label="Yangi parolni tasdiqlang"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Parollar mos kelmadi'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{ 
                height: '45px',
                padding: '0 32px',
                borderRadius: '6px',
                fontSize: '16px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 