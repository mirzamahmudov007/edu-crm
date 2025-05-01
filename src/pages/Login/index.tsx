import React, { useState } from 'react';
import { Form, Input, Button, Card, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

interface LoginForm {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(login(values));
      if (login.fulfilled.match(resultAction)) {
        const { user } = resultAction.payload;
        message.success('Login successful!');
        
        // Add console.log to debug
        console.log('User role:', user.role);
        
        // Redirect based on role
        switch (user.role) {
          case 'TEACHER':
            navigate('/groups');
            break;
          case 'STUDENT':
            navigate('/student');
            break;
          case 'ADMIN':
            navigate('/admin');
            break;
          default:
            message.error('Unknown user role');
            break;
        }
      } else {
        message.error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Sign in</h1>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Username" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}; 