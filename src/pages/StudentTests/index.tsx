import React, { useEffect, useState } from 'react';
import { Card, Button, Table, Tag, message, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getStudentTests } from '../../services/tests.service';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentTests: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await getStudentTests();
      setTests(data);
    } catch (error) {
      console.error('Testlarni olishda xatolik:', error);
      message.error('Testlarni olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Test Nomi',
      dataIndex: ['test', 'title'],
      key: 'title',
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Tavsif',
      dataIndex: ['test', 'description'],
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Vaqt (minut)',
      dataIndex: ['test', 'duration'],
      key: 'duration',
      render: (duration: number) => duration || 'Ko\'rsatilmagan',
    },
    {
      title: 'Holat',
      key: 'status',
      render: (record: any) => {
        if (record.submissionTime) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Bajarilgan
            </Tag>
          );
        }
        return (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Mavjud
          </Tag>
        );
      },
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: any) => (
        <Space>
          {!record.submissionTime && (
            <Button 
              type="primary" 
              onClick={() => navigate(`/test/${record.testAccessId}`)}
              style={{
                borderRadius: '6px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Testni Boshlash
            </Button>
          )}
          {record.submissionTime && (
            <Button 
              onClick={() => navigate(`/student/results`)}
              style={{ borderRadius: '6px' }}
            >
              Natijalarni Ko'rish
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        style={{ 
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Mavjud Testlar</Title>
          <Text type="secondary">Sizga tayinlangan testlar ro'yxati</Text>
        </div>

        <Table
          dataSource={tests}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami ${total} ta test`,
            style: { marginTop: 16 }
          }}
          style={{ 
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        />
      </Card>
    </div>
  );
};

export default StudentTests; 