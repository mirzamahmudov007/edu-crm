import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, message, Space, Button, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestResultDetails } from '../../services/tests.service';

const { Title, Text } = Typography;

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

const TestResults: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState<TestResult['test'] | null>(null);
  
  // Check if we're viewing results for a specific test or all results
  const isSpecificTest = testId !== undefined;

  useEffect(() => {
    fetchResults();
  }, [testId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getTestResultDetails("1");
      
      if (isSpecificTest) {
        // Filter results for the specific test
        const testResults = data.filter((result: TestResult) => result.test.id === Number(testId));
        setResults(testResults);
        if (testResults.length > 0) {
          setTestInfo(testResults[0].test);
        }
      } else {
        // Show all results
        setResults(data);
      }
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
      // Only show this column when viewing all results
      hidden: isSpecificTest,
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
      render: (score: number) => (
        <Tag color={score >= 60 ? 'green' : 'red'}>
          {score}
        </Tag>
      ),
    },
    {
      title: 'Test Period',
      key: 'testPeriod',
      render: (record: TestResult) => (
        <>
          {new Date(record.test.startTime).toLocaleDateString()} - {new Date(record.test.endTime).toLocaleDateString()}
        </>
      ),
      // Only show this column when viewing all results
      hidden: isSpecificTest,
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

  // Filter out hidden columns
  const visibleColumns = columns.filter(column => !column.hidden);

  return (
    <div>
      {isSpecificTest && testInfo && (
        <Card className="mb-6">
          <Title level={2}>{testInfo.title}</Title>
          <Text>{testInfo.description}</Text>
          <div style={{ marginTop: 16 }}>
            <Text strong>Test Period: </Text>
            <Text>
              {new Date(testInfo.startTime).toLocaleString()} - {new Date(testInfo.endTime).toLocaleString()}
            </Text>
          </div>
        </Card>
      )}

      <Card title={isSpecificTest ? "Student Results" : "All Test Results"}>
        <Table
          dataSource={results}
          columns={visibleColumns}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default TestResults; 