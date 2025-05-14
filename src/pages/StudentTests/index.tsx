import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Grid, Card, List } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getStudentTests } from '../../services/tests.service';
import { useNavigate } from 'react-router-dom';

const { useBreakpoint } = Grid;

interface Test {
  id: number;
  testAccessId: string;
  test: {
    id: number;
    title: string;
    description: string;
    duration: number;
  };
  submissionTime: string | null;
}

const StudentTests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data: any = await getStudentTests();
      setTests(data);
    } catch (error) {
      console.error('Sinovlarni yuklashda xatolik:', error);
      message.error('Sinovlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testAccessId: string) => {
    navigate(`/test/${testAccessId}`);
    message.info(`Test boshlandi`);
  };

  const handleViewResults = () => {
    navigate(`/student/results`);
    message.info('Natijalar sahifasiga o‘tildi');
  };

  // Desktop table columns
  const columns = [
    {
      title: 'Test nomi',
      dataIndex: ['test', 'title'],
      key: 'title',
      width: 200,
      render: (text: string) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
          <span className="font-semibold">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Tavsif',
      dataIndex: ['test', 'description'],
      key: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Davomiyligi (daq)',
      dataIndex: ['test', 'duration'],
      key: 'duration',
      width: 150,
      render: (duration: number) => duration || 'Ko‘rsatilmagan',
    },
    {
      title: 'Holati',
      key: 'status',
      width: 150,
      render: (record: Test) => (
        record.submissionTime ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Yakunlangan
          </Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="processing">
            Mavjud
          </Tag>
        )
      ),
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: 200,
      render: (record: Test) => (
        <Space size="small">
          {!record.submissionTime && (
            <Button
              type="primary"
              onClick={() => handleStartTest(record.testAccessId)}
              className="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700"
              size="middle"
            >
              Testni boshlash
            </Button>
          )}
          {record.submissionTime && (
            <Button
              onClick={handleViewResults}
              className="rounded-md"
              size="middle"
            >
              Natijalarni ko'rish
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Mobile card view
  const renderMobileCards = () => (
    <List
      dataSource={tests}
      loading={loading}
      renderItem={(item: Test) => (
        <List.Item>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <span className="font-semibold">{item.test.title}</span>
              </Space>
            }
            style={{ width: '100%', marginBottom: 16 }}
          >
            <div className="mb-2">
              <span className="text-gray-600">Tavsif:</span> {item.test.description}
            </div>
            <div className="mb-2">
              <span className="text-gray-600">Davomiylik:</span> {item.test.duration || 'Ko‘rsatilmagan'} daqiqa
            </div>
            <div className="mb-3">
              {item.submissionTime ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Yakunlangan
                </Tag>
              ) : (
                <Tag icon={<ClockCircleOutlined />} color="processing">
                  Mavjud
                </Tag>
              )}
            </div>
            <div className="flex justify-end">
              {!item.submissionTime ? (
                <Button
                  type="primary"
                  onClick={() => handleStartTest(item.testAccessId)}
                  className="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700"
                  size="small"
                  block
                >
                  Testni boshlash
                </Button>
              ) : (
                <Button
                  onClick={handleViewResults}
                  className="rounded-md"
                  size="small"
                  block
                >
                  Natijalarni ko'rish
                </Button>
              )}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mavjud testlar</h2>
          <p className="text-sm sm:text-base text-gray-500">Sizga biriktirilgan testlar ro'yxati</p>
        </div>
      </div>

      {screens.xs ? (
        renderMobileCards()
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <Table
            columns={columns}
            dataSource={tests}
            rowKey="id"
            loading={loading}
            bordered
            scroll={{ x: true }}
            size="middle"
            pagination={{
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta`,
              pageSizeOptions: ['10', '20', '50'],
              defaultPageSize: 10,
            }}
            sticky
          />
        </div>
      )}
    </div>
  );
};

export default StudentTests;