
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
const navigate = useNavigate();
  useEffect(() => {
    fetchTests();
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
    console.log(`Starting test: ${testAccessId}`);
    message.info(`Test ${testAccessId} would start now`);
  };

  const handleViewResults = () => {
    navigate(`/student/results`)
    console.log('Viewing results');
    message.info('Navigating to results page');
  };

  const columns = [
    {
      title: 'Test nomi',
      dataIndex: ['test', 'title'],
      key: 'title',
      width: '25%',
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
      width: '30%',
      ellipsis: true,
    },
    {
      title: 'Davomiyligi (daq)',
      dataIndex: ['test', 'duration'],
      key: 'duration',
      width: '15%',
      render: (duration: number) => duration || 'Ko‘rsatilmagan',
    },
    {
      title: 'Holati',
      key: 'status',
      width: '15%',
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
      width: '15%',
      align: 'center' as const,
      render: (record: Test) => (
        <Space>
          {!record.submissionTime && (
            <Button
              type="primary"
              onClick={() => handleStartTest(record.testAccessId)}
              className="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 border-none hover:from-blue-600 hover:to-purple-700"
            >
              Testni boshlash
            </Button>
          )}
          {record.submissionTime && (
            <Button
              onClick={handleViewResults}
              className="rounded-md"
            >
              Natijalarni ko‘rish
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mavjud testlar</h2>
          <p className="text-gray-500">Sizga biriktirilgan testlar ro‘yxati</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={tests}
          rowKey="id"
          loading={loading}
          bordered
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta`,
            pageSizeOptions: ['10', '20', '50'],
            defaultPageSize: 10,
          }}
        />
      </div>
    </div>
  );
};

export default StudentTests;
