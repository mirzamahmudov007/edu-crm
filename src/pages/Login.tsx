import React from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { AppDispatch } from '../store';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const resultAction = await dispatch(login(values));
      if (login.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        message.success('Tizimga muvaffaqiyatli kirdingiz!');
        
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'TEACHER') {
          navigate('/groups');
        } else if (user.role === 'STUDENT') {
          navigate('/student/tests');
        }
      } else {
        message.error('Kirish muvaffaqiyatsiz: ' + (resultAction.error?.message || 'Noma\'lum xatolik'));
      }
    } catch (error) {
      message.error('Kirish muvaffaqiyatsiz: ' + (error instanceof Error ? error.message : 'Noma\'lum xatolik'));
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>ITECH Test Platformasi</Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Test tizimiga kirish
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Iltimos, foydalanuvchi nomini kiriting!' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#1890ff' }} />} 
              placeholder="Foydalanuvchi nomi" 
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Iltimos, parolni kiriting!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Parol"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              style={{ 
                height: '45px',
                borderRadius: '6px',
                fontSize: '16px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 