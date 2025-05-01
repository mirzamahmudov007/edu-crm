import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Tag, Card, Row, Col, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Test } from '../../types';
import { getTeacherTests, deleteTest } from '../../services/tests.service';
// import groupsService from '../../services/groups.service';

const TeacherTests: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await getTeacherTests();
      setTests(response);
      
      // Calculate stats
      const now = dayjs();
      const activeTests = response.filter(test => 
        dayjs(test.startTime).isBefore(now) && dayjs(test.endTime).isAfter(now)
      );
      const completedTests = response.filter(test => 
        dayjs(test.endTime).isBefore(now)
      );

      setStats({
        total: response.length,
        active: activeTests.length,
        completed: completedTests.length,
      });
    } catch (error) {
      notification.error({
        message: 'Xatolik',
        description: 'Testlarni olishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId: number) => {
    try {
      await deleteTest(testId);
      notification.success({
        message: 'Muvaffaqiyatli',
        description: 'Test muvaffaqiyatli o\'chirildi.',
      });
      fetchTests();
    } catch (error) {
      notification.error({
        message: 'Xatolik',
        description: 'Testni o\'chirishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
      });
    }
  };

  const getTestStatus = (test: Test) => {
    const now = dayjs();
    const startTime = dayjs(test.startTime);
    const endTime = dayjs(test.endTime);

    if (now.isBefore(startTime)) {
      return <Tag color="blue">Rejalashtirilgan</Tag>;
    } else if (now.isAfter(endTime)) {
      return <Tag color="red">Tugatilgan</Tag>;
    } else {
      return <Tag color="green">Faol</Tag>;
    }
  };

  const columns = [
    {
      title: 'Sarlavha',
      dataIndex: 'title',
      key: 'title',
      sorter: (a: Test, b: Test) => a.title.localeCompare(b.title),
    },
    {
      title: 'Guruh',
      dataIndex: ['group', 'name'],
      key: 'group',
      sorter: (a: Test, b: Test) => a.group.name.localeCompare(b.group.name),
    },
    {
      title: 'Holat',
      key: 'status',
      render: (_: unknown, record: Test) => getTestStatus(record),
    },
    {
      title: 'Boshlanish vaqti',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: Test, b: Test) => dayjs(a.startTime).unix() - dayjs(b.startTime).unix(),
    },
    {
      title: 'Tugash vaqti',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: Test, b: Test) => dayjs(a.endTime).unix() - dayjs(b.endTime).unix(),
    },
    {
      title: 'Savollar',
      dataIndex: ['questions', 'length'],
      key: 'questions',
      render: (_: any, record: any) => record.totalQuestions|| 0,
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Test) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/tests/${record.id}/results`)}
          >
            Natijalar
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/tests/edit/${record.id}`)}
          >
            Tahrirlash
          </Button>
          <Popconfirm
            title="Testni o'chirish"
            description="Haqiqatan ham bu testni o'chirmoqchimisiz?"
            onConfirm={() => handleDeleteTest(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button danger icon={<DeleteOutlined />}>
              O'chirish
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>Jami testlar</h3>
              <h2>{stats.total}</h2>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>Faol testlar</h3>
              <h2>{stats.active}</h2>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <h3>Tugatilgan testlar</h3>
              <h2>{stats.completed}</h2>
            </div>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Mening testlarim</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/tests/create')}
          size="large"
        >
          Yangi test yaratish
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tests}
        rowKey="id"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Jami ${total} ta test`,
        }}
      />
    </div>
  );
};

export default TeacherTests; 