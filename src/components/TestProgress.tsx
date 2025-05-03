import React from 'react';
import { Progress, Card, Space, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import confetti from 'canvas-confetti';

const { Text } = Typography;

interface TestProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  remainingTime: number;
  onTimeUp: () => void;
  isCorrect?: boolean;
}

const TestProgress: React.FC<TestProgressProps> = ({
  currentQuestion,
  totalQuestions,
  remainingTime,
  onTimeUp,
  isCorrect
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  React.useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isCorrect]);

  React.useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp();
      return;
    }

    return () => {};
  }, [remainingTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Progress 
          percent={progress} 
          status={remainingTime < 30 ? "exception" : "active"}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
        <Space>
          <ClockCircleOutlined />
          <Text type={remainingTime < 30 ? "danger" : "secondary"}>
            Qolgan vaqt: {formatTime(remainingTime)}
          </Text>
        </Space>
        <Text type="secondary">
          Savol {currentQuestion} / {totalQuestions}
        </Text>
      </Space>
    </Card>
  );
};

export default TestProgress; 