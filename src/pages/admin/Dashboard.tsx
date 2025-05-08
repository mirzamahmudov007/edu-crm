import React from 'react';
import { Card, List, Avatar } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  RiseOutlined,
  StarOutlined
} from '@ant-design/icons';

// Mock data for top students
const topStudents = [
  { name: 'John Doe', score: 98, avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysz=1&w=40' },
  { name: 'Jane Smith', score: 96, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysz=1&w=40' },
  { name: 'Mike Johnson', score: 95, avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysz=1&w=40' }
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">2,451</p>
              <p className="text-xs text-green-600">↑ 12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <TeamOutlined className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Groups</p>
              <p className="text-2xl font-bold">48</p>
              <p className="text-xs text-green-600">↑ 8% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOutlined className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-green-600">↑ 5% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <RiseOutlined className="text-2xl text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-green-600">↑ 3% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <TrophyOutlined className="text-yellow-500" />
              <span>Top Performing Students</span>
            </div>
          }
          className="shadow-md"
        >
          <List
            itemLayout="horizontal"
            dataSource={topStudents}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<span className="font-semibold">{item.name}</span>}
                  description={
                    <div className="flex items-center space-x-2">
                      <StarOutlined className="text-yellow-500" />
                      <span>{item.score}% Average Score</span>
                    </div>
                  }
                />
                <div className="text-sm font-semibold text-gray-500">#{index + 1}</div>
              </List.Item>
            )}
          />
        </Card>

        {/* Recent Activity */}
        <Card 
          title={
            <div className="flex items-center space-x-2">
              <TeamOutlined className="text-blue-500" />
              <span>Group Statistics</span>
            </div>
          }
          className="shadow-md"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Active Groups</span>
              <span className="text-green-600 font-bold">32</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Students per Group (avg)</span>
              <span className="text-blue-600 font-bold">15</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Completion Rate</span>
              <span className="text-purple-600 font-bold">92%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Active Courses</span>
              <span className="text-orange-600 font-bold">24</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;