import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getStudentTests } from '../../services/tests.service';
import { useNavigate } from 'react-router-dom';

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
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
    
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data :any = await getStudentTests();
      setTests(data);
    } catch (error) {
      console.error('Sinovlarni yuklashda xatolik:', error);
      message.error('Sinovlarni yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testAccessId: string) => {
    navigate(`/test/${testAccessId}`)
    message.info(`Test boshlandi`);
  };

  const handleViewResults = () => {
    navigate(`/student/results`)
    message.info('Natijalar sahifasiga o\'tildi');
  };

  const columns : any= [
    {
      title: 'Test nomi',
      dataIndex: ['test', 'title'],
      key: 'title',
      width: 200,
      fixed: screenWidth < 768 ? 'left' : undefined,
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
      fixed: screenWidth < 768 ? 'right' : undefined,
      render: (record: Test) => (
        <Space size="small">
          {!record.submissionTime && (
            <Button
              type="primary"
              onClick={() => handleStartTest(record.testAccessId)}
              className="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700"
              size={screenWidth < 500 ? 'small' : 'middle'}
            >
              {screenWidth > 400 ? 'Testni boshlash' : 'Boshlash'}
            </Button>
          )}
          {record.submissionTime && (
            <Button
              onClick={handleViewResults}
              className="rounded-md"
              size={screenWidth < 500 ? 'small' : 'middle'}
            >
              {screenWidth > 400 ? 'Natijalarni ko‘rish' : 'Natijalar'}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mb-2 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mavjud testlar</h2>
          <p className="text-sm sm:text-base text-gray-500">Sizga biriktirilgan testlar ro‘yxati</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={tests}
          rowKey="id"
          loading={loading}
          bordered
          scroll={{
            x: screenWidth < 768 ? 800 : '100%',
            y: screenWidth < 768 ? 400 : undefined,
          }}
          size={screenWidth < 500 ? 'small' : 'middle'}
          pagination={{
            showSizeChanger: screenWidth > 500,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta`,
            pageSizeOptions: ['10', '20', '50'],
            defaultPageSize: 10,
            simple: screenWidth < 500,
          }}
          sticky
        />
      </div>
    </div>
  );
};

export default StudentTests;