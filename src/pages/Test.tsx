import React, { useState, useEffect } from 'react';
import { Card, Radio, Button, Typography, Space, Progress, message, List, Tag, Divider, Alert } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestByAccessId, getTestQuestions, submitTest } from '../services/tests.service';
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';
import TestProgress from '../components/TestProgress';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface QuestionResult {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface TestResult {
  id: number;
  test: {
    title: string;
    description: string;
  };
  score: number;
  submissionTime: string;
}

interface TestSubmissionResponse {
  testResult: TestResult;
  questionResults: QuestionResult[];
}

const Test: React.FC = () => {
  const { testAccessId } = useParams<{ testAccessId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestSubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isCorrect, _] = useState<boolean>(false);
  const [currentQuestionIndex, ___] = useState<number>(0);

  useEffect(() => {
    if (testAccessId && testAccessId !== 'undefined') {
      fetchTest();
    } else {
      setError('Noto\'g\'ri test identifikatori');
      setLoading(false);
    }
  }, [testAccessId]);

  // Debug useEffect to log test and questions data
  useEffect(() => {
    console.log('Test data:', test);
    console.log('Questions data:', questions);
  }, [test, questions]);

  useEffect(() => {
    if (test) {
      // Convert minutes to seconds
      setRemainingTime(test.duration * 60);
    }
  }, [test]);

  useEffect(() => {
    if (remainingTime <= 0) {
      // Instead of automatically submitting, just show a message
      message.warning('Test vaqti tugadi!');
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First get the test details
      const testResponse = await getTestByAccessId(testAccessId!);
      
      if (!testResponse) {
        throw new Error('Test topilmadi');
      }
      
      setTest(testResponse);
      
      // Then get the questions for this test
      if (testResponse && testResponse.id) {
        const questionsResponse = await getTestQuestions(testResponse.id);
        console.log('Questions from API:', questionsResponse);
        setQuestions(questionsResponse);
      } else {
        throw new Error('Test identifikatori topilmadi');
      }
    } catch (error: any) {
      console.error('Testni olishda xatolik:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 403) {
          setError('Sizga bu testni ko\'rish uchun ruxsat yo\'q. Iltimos, o\'qituvchingiz bilan bog\'laning.');
        } else if (error.response.status === 404) {
          setError('Test topilmadi. Test identifikatori noto\'g\'ri yoki test o\'chirilgan bo\'lishi mumkin.');
        } else {
          setError(`Server xatosi: ${error.response.status}. ${error.response.data?.message || 'Ma\'lumot yo\'q'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('Server bilan bog\'lanishda xatolik. Iltimos, internet aloqangizni tekshiring.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Xatolik: ${error.message}`);
      }
      
      message.error('Testni olishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Log the answers for debugging
      console.log('Submitting answers:', answers);
      
      const response = await submitTest(testAccessId!, answers);
      
      // Set the test results to display immediately
      setTestResults(response);
      
      message.success('Test muvaffaqiyatli topshirildi');
    } catch (error: any) {
      console.error('Testni topshirishda xatolik:', error);
      
      // More detailed error handling
      if (error.response) {
        if (error.response.status === 403) {
          setError('Sizga bu testni topshirish uchun ruxsat yo\'q.');
        } else if (error.response.status === 404) {
          setError('Test topilmadi. Test identifikatori noto\'g\'ri yoki test o\'chirilgan bo\'lishi mumkin.');
        } else {
          setError(`Server xatosi: ${error.response.status}. ${error.response.data?.message || 'Ma\'lumot yo\'q'}`);
        }
      } else if (error.request) {
        setError('Server bilan bog\'lanishda xatolik. Iltimos, internet aloqangizni tekshiring.');
      } else {
        setError(`Xatolik: ${error.message}`);
      }
      
      message.error('Testni topshirishda xatolik');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / questions.length) * 100);
  };

  const handleViewAllResults = () => {
    navigate('/student/results');
  };


  // Function to manually fetch questions
  const fetchQuestions = async () => {
    try {
      if (test && test.id) {
        const questionsResponse = await getTestQuestions(test.id);
        console.log('Questions fetched manually:', questionsResponse);
        setQuestions(questionsResponse);
      }
    } catch (error) {
      console.error('Savollarni olishda xatolik:', error);
      message.error('Savollarni olishda xatolik');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <Card loading style={{ borderRadius: '12px' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: '12px' }}>
          <Alert
            message="Xatolik"
            description={error}
            type="error"
            showIcon
          />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/student/tests')}
              icon={<ArrowLeftOutlined />}
              style={{
                borderRadius: '6px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Testlarga Qaytish
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!test) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: '12px' }}>
          <Alert
            message="Test Topilmadi"
            description="Siz qidirayotgan test topilmadi."
            type="warning"
            showIcon
          />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button 
              type="primary" 
              onClick={() => navigate('/student/tests')}
              icon={<ArrowLeftOutlined />}
              style={{
                borderRadius: '6px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Testlarga Qaytish
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If test has been submitted, show results
  if (testResults) {
    const { testResult, questionResults } = testResults;
    const correctAnswers = questionResults.filter(q => q.isCorrect).length;
    const totalQuestions = questionResults.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Card 
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: 24
          }}
        >
          <Title level={2}>{testResult.test.title}</Title>
          <Paragraph>{testResult.test.description}</Paragraph>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>Ball: </Text>
              <Text>{correctAnswers} / {totalQuestions} ({scorePercentage}%)</Text>
            </div>
            <div>
              <Text strong>Topshirilgan vaqt: </Text>
              <Text>{new Date(testResult.submissionTime).toLocaleString()}</Text>
            </div>
          </div>
        </Card>

        <Card 
          title="Savollar Natijalari"
          style={{ 
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <List
            dataSource={questionResults}
            renderItem={(item, index) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ marginRight: 8, fontWeight: 'bold' }}>Savol {index + 1}:</span>
                    {item.isCorrect ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">To'g'ri</Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">Noto'g'ri</Tag>
                    )}
                  </div>
                  <Paragraph style={{ marginBottom: 8 }}>{item.questionText}</Paragraph>
                  <div style={{ marginLeft: 16 }}>
                    <Text strong>Sizning javobingiz: </Text>
                    <Text type={item.isCorrect ? "success" : "danger"}>{item.studentAnswer}</Text>
                    {!item.isCorrect && (
                      <>
                        <br />
                        <Text strong>To'g'ri javob: </Text>
                        <Text type="success">{item.correctAnswer}</Text>
                      </>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button 
            type="primary" 
            onClick={handleViewAllResults}
            icon={<CheckOutlined />}
            style={{
              height: '45px',
              padding: '0 32px',
              borderRadius: '6px',
              fontSize: '16px',
              background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
              border: 'none'
            }}
          >
            Barcha Natijalarimni Ko'rish
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while questions are being fetched
  if (test && (!questions || questions.length === 0)) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Title level={2}>{test.title}</Title>
          <Text>{test.description}</Text>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Progress type="circle" percent={100} status="active" />
            <Paragraph style={{ marginTop: 16 }}>Savollar yuklanmoqda...</Paragraph>
            <Button 
              type="primary" 
              onClick={fetchQuestions}
              style={{ marginTop: 16 }}
            >
              Savollarni qayta yuklash
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Otherwise, show the test form
  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <TestProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length || 0}
        remainingTime={remainingTime}
        onTimeUp={() => message.warning('Test vaqti tugadi!')}
        isCorrect={isCorrect}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginBottom: 24
            }}
          >
            <Title level={2}>{test?.title}</Title>
            <Text>{test?.description}</Text>
            <div style={{ marginTop: 16 }}>
              <Progress 
                percent={getProgress()} 
                status={getProgress() === 100 ? "success" : "active"}
                strokeColor={{
                  '0%': '#1890ff',
                  '100%': '#722ed1',
                }}
              />
            </div>
          </Card>

          {questions && questions.length > 0 ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {questions.map((question, index) => (
                <Card 
                  key={question.id}
                  style={{ 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <Title level={4}>Savol {index + 1}: {question.text}</Title>
                  <Radio.Group
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    value={answers[question.id]}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {question.options && question.options.map((option: string, index: number) => (
                        <Radio 
                          key={index} 
                          value={option}
                          style={{ 
                            margin: '8px 0',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #f0f0f0',
                            width: '100%',
                            transition: 'all 0.3s'
                          }}
                        >
                          {option}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </Card>
              ))}
            </Space>
          ) : (
            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Alert
                message="Savollar topilmadi"
                description="Bu testda savollar mavjud emas yoki ularni yuklab olishda xatolik yuz berdi."
                type="warning"
                showIcon
              />
            </Card>
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              loading={submitting}
              disabled={!questions || Object.keys(answers).length !== questions.length}
              icon={<CheckOutlined />}
              style={{
                height: '45px',
                padding: '0 32px',
                borderRadius: '6px',
                fontSize: '16px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Testni Topshirish
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Test; 