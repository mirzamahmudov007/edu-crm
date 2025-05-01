import React, { useEffect, useState } from 'react';
import { Card, Table, message, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getTestResults } from '../../services/tests.service';

interface TestResult {
  id: number;
  test: {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
  student: {
    id: number;
    username: string;
    fullName: string;
    role: string;
  };
  score: number;
  submissionTime: string;
  testAccessId: string;
}

const TeacherResults: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();





  
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getTestResults();
      console.log('Test results data:', data);
      setResults(data);
    } catch (error) {
      console.error('Error fetching test results:', error);
      message.error('Failed to fetch test results');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Test Title',
      dataIndex: ['test', 'title'],
      key: 'title',
    },
    {
      title: 'Student',
      key: 'student',
      render: (record: TestResult) => `${record.student.fullName} (${record.student.username})`,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score,
    },
    {
      title: 'Test Period',
      key: 'testPeriod',
      render: (record: TestResult) => (
        <>
          {new Date(record.test.startTime).toLocaleDateString()} - {new Date(record.test.endTime).toLocaleDateString()}
        </>
      ),
    },
    {
      title: 'Submission Time',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: TestResult) => (
        <Space>
          <Button 
            type="primary" 
            onClick={() => navigate(`/teacher/results/${record.id}`)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Student Test Results">
      <Table
        dataSource={results}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default TeacherResults; 