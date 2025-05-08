import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, Space, Button, message, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getStudentResults } from '../services/tests.service';
import dayjs from 'dayjs';
import { TestResult } from '../types';


const { Text } = Typography;

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
    if (percentage >= 80) return "A'lo";
    if (percentage >= 60) return 'Yaxshi';
    return 'Yaxshilash kerak';
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
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: '15%',
      align: 'center' as const,
      render: (record: TestResult) => (
        <Button
          type="primary"
          onClick={() => navigate(`/student/results/${record.id}`)}
          className="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700"
        >
          Batafsil ko‘rish
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mening Test Natijalarim</h2>
          <p className="text-gray-500">Bu yerda siz o‘z test natijalaringizni ko‘rishingiz mumkin</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table
          dataSource={results}
          columns={columns}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami ${total} ta natija`,
            pageSizeOptions: ['10', '20', '50'],
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
      </div>
    </div>
  );
};

export default StudentResults;
