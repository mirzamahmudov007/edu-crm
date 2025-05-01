import React from 'react';
import { Table, Card, Avatar, Tag } from 'antd';
import { TrophyOutlined, UserOutlined } from '@ant-design/icons';

interface LeaderboardEntry {
  id: number;
  rank: number;
  studentName: string;
  totalPoints: number;
  testsCompleted: number;
  averageScore: number;
  streak: number;
}

interface LeaderboardProps {
  data: LeaderboardEntry[];
  loading?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data, loading }) => {
  const columns = [
    {
      title: 'O\'rin',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => {
        let color = '';
        switch (rank) {
          case 1:
            color = '#ffd700'; // Gold
            break;
          case 2:
            color = '#c0c0c0'; // Silver
            break;
          case 3:
            color = '#cd7f32'; // Bronze
            break;
          default:
            color = '#1890ff';
        }
        return (
          <Tag color={color} style={{ margin: 0 }}>
            {rank}
          </Tag>
        );
      },
    },
    {
      title: 'Talaba',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record: LeaderboardEntry) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar icon={<UserOutlined />} />
          <span>{text}</span>
          {record.rank <= 3 && (
            <TrophyOutlined style={{ 
              color: record.rank === 1 ? '#ffd700' : 
                     record.rank === 2 ? '#c0c0c0' : '#cd7f32' 
            }} />
          )}
        </div>
      ),
    },
    {
      title: 'Jami Ball',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      sorter: (a: LeaderboardEntry, b: LeaderboardEntry) => a.totalPoints - b.totalPoints,
    },
    {
      title: 'Testlar',
      dataIndex: 'testsCompleted',
      key: 'testsCompleted',
    },
    {
      title: 'O\'rtacha Ball',
      dataIndex: 'averageScore',
      key: 'averageScore',
      render: (score: number) => `${score}%`,
    },
    {
      title: 'Seriya',
      dataIndex: 'streak',
      key: 'streak',
      render: (streak: number) => (
        <Tag color={streak >= 5 ? 'success' : streak >= 3 ? 'warning' : 'default'}>
          {streak} kun
        </Tag>
      ),
    },
  ];

  return (
    <Card title="Reyting Jadvali" loading={loading}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        size="middle"
      />
    </Card>
  );
};

export default Leaderboard; 