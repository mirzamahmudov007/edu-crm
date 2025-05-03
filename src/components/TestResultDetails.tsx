import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, List, Tag, Spin, Alert, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getDetailedTestResult } from '../services/tests.service';

const { Title, Text, Paragraph } = Typography;

interface QuestionResult {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface TestResultDetails {
  testResult: {
    id: number;
    test: {
      title: string;
      description: string;
    };
    score: number;
    submissionTime: string | null;
  };
  questionResults: QuestionResult[];
}

const TestResultDetails: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultDetails, setResultDetails] = useState<TestResultDetails | null>(null);

  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        setLoading(true);
        if (!resultId) {
          throw new Error('Test result ID is missing');
        }
        const data = await getDetailedTestResult(parseInt(resultId));
        setResultDetails(data);
      } catch (err) {
        setError('Failed to load test result details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetails();
  }, [resultId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !resultDetails) {
    return (
      <Alert
        message="Error"
        description={error || 'Failed to load test result details'}
        type="error"
        showIcon
      />
    );
  }

  const { testResult, questionResults } = resultDetails;
  const correctAnswers = questionResults.filter(q => q.isCorrect).length;
  const totalQuestions = questionResults.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <Title level={2}>{testResult.test.title}</Title>
        <Paragraph>{testResult.test.description}</Paragraph>
        <Divider />
        <div className="flex justify-between items-center">
          <div>
            <Text strong>Score: </Text>
            <Text>{correctAnswers} out of {totalQuestions} ({scorePercentage}%)</Text>
          </div>
          <div>
            <Text strong>Submitted: </Text>
            <Text>{testResult.submissionTime ? new Date(testResult.submissionTime).toLocaleString() : 'Not submitted'}</Text>
          </div>
        </div>
      </Card>

      <Card title="Question Results">
        <List
          dataSource={questionResults}
          renderItem={(item, index) => (
            <List.Item>
              <div className="w-full">
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">Question {index + 1}:</span>
                  {item.isCorrect ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">Correct</Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">Incorrect</Tag>
                  )}
                </div>
                <Paragraph className="mb-2">{item.questionText}</Paragraph>
                <div className="ml-4">
                  <Text strong>Your answer: </Text>
                  <Text type={item.isCorrect ? "success" : "danger"}>{item.studentAnswer}</Text>
                  {!item.isCorrect && (
                    <>
                      <br />
                      <Text strong>Correct answer: </Text>
                      <Text type="success">{item.correctAnswer}</Text>
                    </>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default TestResultDetails; 