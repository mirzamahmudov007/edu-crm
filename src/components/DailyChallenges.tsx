import React from 'react';
import { Card, Row, Col, Progress, Button, Tag, Space } from 'antd';
import { TrophyOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Challenge {
  id: number;
  title: string;
  description: string;
  challengeType: string;
  targetValue: number;
  currentProgress: number;
  rewardPoints: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
}

interface DailyChallengesProps {
  challenges: Challenge[];
  onClaimReward: (challengeId: number) => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({
  challenges,
  onClaimReward
}) => {
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'TEST_COMPLETION':
        return <TrophyOutlined style={{ color: '#1890ff' }} />;
      case 'ACCURACY':
        return <FireOutlined style={{ color: '#ff4d4f' }} />;
      case 'STREAK':
        return <ClockCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <TrophyOutlined />;
    }
  };

  const getTimeLeft = (endDate: string) => {
    const end = dayjs(endDate);
    const now = dayjs();
    const hours = end.diff(now, 'hour');
    const minutes = end.diff(now, 'minute') % 60;
    return `${hours}s ${minutes}d`;
  };

  return (
    <Card title="Kunlik Topshiriqlar">
      <Row gutter={[16, 16]}>
        {challenges.map((challenge) => (
          <Col span={8} key={challenge.id}>
            <Card
              hoverable
              style={{ 
                backgroundColor: challenge.isCompleted ? '#f6ffed' : '#fff',
                borderColor: challenge.isCompleted ? '#52c41a' : undefined
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    {getChallengeIcon(challenge.challengeType)}
                    <h3 style={{ margin: 0 }}>{challenge.title}</h3>
                  </Space>
                  <Tag color={challenge.isCompleted ? 'success' : 'processing'}>
                    {challenge.rewardPoints} ball
                  </Tag>
                </div>
                
                <p>{challenge.description}</p>
                
                <Progress
                  percent={Math.round((challenge.currentProgress / challenge.targetValue) * 100)}
                  status={challenge.isCompleted ? 'success' : 'active'}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tag color="default">
                    Qolgan vaqt: {getTimeLeft(challenge.endDate)}
                  </Tag>
                  {challenge.isCompleted && (
                    <Button 
                      type="primary"
                      onClick={() => onClaimReward(challenge.id)}
                    >
                      Mukofotni olish
                    </Button>
                  )}
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default DailyChallenges; 