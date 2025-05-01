import React, { useEffect, useState } from 'react';
import { Card, message, Button, Typography, Space, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestResultDetails } from '../../services/tests.service';

const { Title, Text, Paragraph } = Typography;

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

const TeacherResultDetails: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resultId) {
      fetchResultDetails();
    }
  }, [resultId]);

  const fetchResultDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!resultId) {
        setError('Result ID is missing');
        return;
      }
      const data = await getTestResultDetails(resultId);
      console.log('Test result details:', data);
      setResult(data);
    } catch (error) {
      console.error('Error fetching result details:', error);
      setError('Failed to fetch result details');
      message.error('Failed to fetch result details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Card loading />;
  }

  if (error || !result) {
    return (
      <Card>
        <Title level={4}>Error</Title>
        <Paragraph>{error || 'Result not found'}</Paragraph>
        <Button type="primary" onClick={() => navigate('/teacher/results')}>
          Back to Results
        </Button>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <Title level={2}>{result.test.title}</Title>
        <Paragraph>{result.test.description}</Paragraph>
        <Divider />
        <Space direction="vertical" size="small">
          <Text strong>Student: </Text>
          <Text>{result.student.fullName} ({result.student.username})</Text>
          <Text strong>Score: </Text>
          <Text>{result.score}</Text>
          <Text strong>Test Period: </Text>
          <Text>
            {new Date(result.test.startTime).toLocaleString()} - {new Date(result.test.endTime).toLocaleString()}
          </Text>
          <Text strong>Submitted: </Text>
          <Text>{new Date(result.submissionTime).toLocaleString()}</Text>
          <Text strong>Test Access ID: </Text>
          <Text>{result.testAccessId}</Text>
        </Space>
      </Card>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button type="primary" onClick={() => navigate('/teacher/results')}>
          Back to Results
        </Button>
      </div>
    </div>
  );
};

export default TeacherResultDetails; 