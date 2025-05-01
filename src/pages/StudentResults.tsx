import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tag, Space, Button, message, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getStudentResults } from '../services/tests.service';
import dayjs from 'dayjs';
import { TestResult } from '../types';

const { Title, Text } = Typography;

const StudentResults: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getStudentResults();
      setResults(data);
    } catch (error) {
      console.error('Natijalarni olishda xatolik:', error);
      message.error('Test natijalarini olishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number, totalQuestions: number): string => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getScoreText = (score: number, totalQuestions: number): string => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage >= 80) return 'A\'lo';
    if (percentage >= 60) return 'Yaxshi';
    return 'Yaxshilash Kerak';
  };

  const columns = [
    {
      title: 'Test Nomi',
      dataIndex: ['test', 'title'],
      key: 'title',
      render: (text: string, record: TestResult) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.test.description}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Ball',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: TestResult) => {
        const totalQuestions = record.test.questions.length;
        const percentage = (score / totalQuestions) * 100;
        return (
          <Space direction="vertical" align="center" size={0}>
            <Text strong>{score}/{totalQuestions}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {percentage.toFixed(1)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Topshirilgan Vaqt',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      render: (time: string | null) => {
        if (!time) return <Text type="secondary">Topshirilmagan</Text>;
        return (
          <Space direction="vertical" size={0}>
            <Text>{dayjs(time).format('DD.MM.YYYY')}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs(time).format('HH:mm')}
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Holat',
      key: 'status',
      render: (record: TestResult) => {
        const totalQuestions = record.test.questions.length;
        const color = getScoreColor(record.score, totalQuestions);
        const text = getScoreText(record.score, totalQuestions);

        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (record: TestResult) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => navigate(`/student/results/${record.id}`)}
          >
            Batafsil Ko'rish
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={2}>Mening Test Natijalarim</Title>
        <Text>Bu yerda siz o'z test natijalaringiz va ballaringizni ko'rishingiz mumkin.</Text>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          dataSource={results}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami ${total} ta natija`
          }}
          locale={{
            emptyText: (
              <Empty
                description="Hozircha test natijalari mavjud emas"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )
          }}
        />
      </Card>
    </div>
  );
};

export default StudentResults; 