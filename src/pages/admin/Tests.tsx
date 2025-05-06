import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Card, Row, Col, Tabs, Tag, Statistic, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import { getAllTests, createTest, deleteTest, TestFilters, getDetailedTestResult, getTeacherTests } from '../../services/tests.service';
import { getAllGroups, Group } from '../../services/groups.service';
import { getAllTeachers, Teacher } from '../../services/teachers.service';
import { Test } from '../../types';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { TabPane } = Tabs;

const AdminTests: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [filters, setFilters] = useState<TestFilters>({});
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [selectedResultData, setSelectedResultData] = useState<any>(null);
  const { user } = useSelector((state: any) => state.auth);
  
  const fetchGroups = async () => {
    try {
      const data = await getAllGroups();
      setGroups(data);
    } catch (error: any) {
      message.error('Guruhlarni olishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(data);
    } catch (error: any) {
      message.error('O\'qituvchilarni olishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    }
  };

  const fetchTests = async () => {
    try {
      setLoading(true);
      let data = null;
      if(user.role === "ADMIN"){
         data = await getAllTests(filters);
      }else{
       data = await getTeacherTests();
      }
      if (Array.isArray(data)) {
        setTests(data);
      } else {
        message.error('Serverdan noto\'g\'ri formatda javob');
        setTests([]);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error('Iltimos, bu sahifaga kirish uchun tizimga kiring');
        navigate('/login');
      } else {
        message.error('Testlarni olishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
        setTests([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResults = async (testId: number) => {
    try {
      setLoadingResults(true);
      const response = await fetch(`https://api.lms.itechacademy.uz/api/test-results/${testId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Test natijalarini olishda xatolik');
      }
      
      const data = await response.json();
      setTestResults(data);
    } catch (error: any) {
      message.error('Test natijalarini olishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchTests();
  }, [filters]);

  useEffect(() => {
    if (selectedTest) {
      fetchTestResults(selectedTest.id);
    }
  }, [selectedTest]);

  const columns = [
    {
      title: 'Sarlavha',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tavsif',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Guruh',
      dataIndex: ['group', 'name'],
      key: 'group',
    },
    {
      title: 'O\'qituvchi',
      dataIndex: ['teacher', 'fullName'],
      key: 'teacher',
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          ACTIVE: 'green',
          COMPLETED: 'blue',
          UPCOMING: 'orange',
        };
        const statusText = {
          ACTIVE: 'Faol',
          COMPLETED: 'Yakunlangan',
          UPCOMING: 'Kutilmoqda',
        };
        return <Tag color={colors[status as keyof typeof colors]}>{statusText[status as keyof typeof statusText]}</Tag>;
      },
    },
    {
      title: 'Boshlanish Vaqti',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => dayjs(text).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Tugash Vaqti',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text: string) => dayjs(text).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: 'Savollar Soni',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Test) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const resultColumns = [
    {
      title: 'Talaba',
      dataIndex: ['student', 'fullName'],
      key: 'student',
    },
    {
      title: 'Ball',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: any) => {
        const totalQuestions = record.totalQuestions || 0;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        return (
          <div>
            <div>{score} / {totalQuestions}</div>
            <div style={{ color: percentage >= 70 ? 'green' : percentage >= 50 ? 'orange' : 'red' }}>
              {percentage}%
            </div>
          </div>
        );
      },
    },
    {
      title: 'Topshirilgan Vaqt',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      render: (text: string) => text ? dayjs(text).format('DD.MM.YYYY HH:mm') : 'Topshirilmagan',
    },
    {
      title: 'Holat',
      key: 'status',
      render: (_: any, record: any) => {
        if (!record.submissionTime) {
          return <Tag color="default">Boshlanmagan</Tag>;
        }
        return <Tag color="green">Yakunlangan</Tag>;
      },
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => handleViewResultDetails(record.id)}
        >
          Batafsil Ko'rish
        </Button>
      ),
    },
  ];

  const handleFilterChange = (key: keyof TestFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

 
  const handleEdit = (test: Test) => {
    setEditingTest(test);
    form.setFieldsValue({
      ...test,
      startTime: test.startTime ? dayjs(test.startTime).format('YYYY-MM-DDTHH:mm') : undefined,
      endTime: test.endTime ? dayjs(test.endTime).format('YYYY-MM-DDTHH:mm') : undefined,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Bu testni o\'chirishni xohlaysizmi?',
      content: 'Bu amalni qaytarib bo\'lmaydi.',
      onOk: async () => {
        try {
          await deleteTest(id);
          message.success('Test muvaffaqiyatli o\'chirildi');
          fetchTests();
        } catch (error: any) {
          if (error.response?.status === 401) {
            message.error('Iltimos, bu amalni bajarish uchun tizimga kiring');
            navigate('/login');
          } else {
            message.error('Testni o\'chirishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
          }
        }
      },
    });
  };

  const handleView = (test: Test) => {
    setSelectedTest(test);
    setIsViewModalVisible(true);
  };

  const handleViewResultDetails = async (resultId: number) => {
    try {
      console.log('Fetching test result details for ID:', resultId);
      const data = await getDetailedTestResult(resultId);
      console.log('Received test result data:', data);
      setSelectedResultData(data);
      setIsResultModalVisible(true);
    } catch (error: any) {
      console.error('Error in handleViewResultDetails:', error);
      message.error('Natija tafsilotlarini olishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingTest) {
        // TODO: API mavjud bo'lganda testni yangilash funksionalligini amalga oshirish
        message.success('Test muvaffaqiyatli yangilandi');
      } else {
        await createTest({
          title: values.title,
          description: values.description,
          startTime: values.startTime,
          endTime: values.endTime,
          groupId: values.groupId,
        });
        message.success('Test muvaffaqiyatli yaratildi');
      }
      setIsModalVisible(false);
      fetchTests();
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error('Iltimos, bu amalni bajarish uchun tizimga kiring');
        navigate('/login');
      } else {
        message.error('Testni saqlashda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
      }
    }
  };

  const getTestStatus = (test: Test) => {
    const now = dayjs();
    const startTime = dayjs(test.startTime);
    const endTime = dayjs(test.endTime);
    
    console.log(startTime);
    
    if (now.isBefore(startTime)) {
      return 'UPCOMING';
    } else if (now.isAfter(endTime)) {
      return 'COMPLETED';
    } else {
      return 'ACTIVE';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '#3f8600'; // yashil
      case 'COMPLETED':
        return '#1890ff'; // ko'k
      case 'UPCOMING':
        return '#faad14'; // to'q sariq
      default:
        return '#d9d9d9'; // kulrang
    }
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        {user.role === "TEACHER" ? <Row>
          <Button onClick={()=> navigate("/tests/create")}>Test qoshish</Button>
        </Row> : ""}
        {user.role === "ADMIN" ? 
        <Row gutter={16}>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Guruh bo'yicha filtrlash"
              allowClear
              onChange={(value) => handleFilterChange('groupId', value)}
            >
              {groups.map(group => (
                <Option key={group.id} value={group.id}>{group.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="O'qituvchi bo'yicha filtrlash"
              allowClear
              onChange={(value) => handleFilterChange('teacherId', value)}
            >
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>{teacher.fullName}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Holat bo'yicha filtrlash"
              allowClear
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="ACTIVE">Faol</Option>
              <Option value="COMPLETED">Yakunlangan</Option>
              <Option value="UPCOMING">Kutilmoqda</Option>
            </Select>
          </Col>
        </Row> : ""}
      </Card>

     
      <Table 
        columns={columns} 
        dataSource={tests} 
        rowKey="id" 
        loading={loading}
      />
      
      <Modal
        title={editingTest ? 'Testni Tahrirlash' : 'Yangi Test Qo\'shish'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Sarlavha"
            rules={[{ required: true, message: 'Iltimos, test sarlavhasini kiriting!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Tavsif"
            rules={[{ required: true, message: 'Iltimos, tavsifni kiriting!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Boshlanish Vaqti"
            rules={[{ required: true, message: 'Iltimos, boshlanish vaqtini tanlang!' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Tugash Vaqti"
            rules={[{ required: true, message: 'Iltimos, tugash vaqtini tanlang!' }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="groupId"
            label="Guruh"
            rules={[{ required: true, message: 'Iltimos, guruhni tanlang!' }]}
          >
            <Select>
              {groups.map(group => (
                <Option key={group.id} value={group.id}>{group.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Test Tafsilotlari"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        width={1000}
        footer={null}
      >
        {selectedTest && (
          <div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Test Ma'lumotlari" key="1">
                <Card>
                  <Row gutter={16}>
                    <Col span={12}>
                      <h2>{selectedTest.title}</h2>
                      <p>{selectedTest.description}</p>
                      <Divider />
                      <p><strong>Guruh:</strong> {selectedTest.group?.name}</p>
                      <p><strong>O'qituvchi:</strong> {selectedTest.group?.teacher?.fullName}</p>
                      <p><strong>Savollar Soni:</strong> {selectedTest.questions?.length || 0}</p>
                    </Col>
                    <Col span={12}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic 
                            title="Boshlanish Vaqti" 
                            value={dayjs(selectedTest.startTime).format('DD.MM.YYYY HH:mm')} 
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic 
                            title="Tugash Vaqti" 
                            value={dayjs(selectedTest.endTime).format('DD.MM.YYYY HH:mm')} 
                          />
                        </Col>
                      </Row>
                      <Divider />
                      <Row gutter={16}>
                        <Col span={24}>
                          <Statistic 
                            title="Holat" 
                            value={getTestStatus(selectedTest)}
                            valueStyle={{ color: getStatusColor(getTestStatus(selectedTest)) }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab="Test Natijalari" key="2">
                <Table
                  columns={resultColumns}
                  dataSource={testResults}
                  rowKey="id"
                  loading={loadingResults}
                />
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>

      <Modal
        title="Talaba Test Natijalari"
        open={isResultModalVisible}
        onCancel={() => setIsResultModalVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setIsResultModalVisible(false)}>
            Bekor qilish
          </Button>,
          <Button key="ok" type="primary" onClick={() => setIsResultModalVisible(false)}>
            Yopish
          </Button>
        ]}
      >
        {selectedResultData && (
          <div>
            <Card>
              <Row gutter={16}>
                <Col span={24}>
                  <h2>{selectedResultData.testResult.test.title}</h2>
                  <p>{selectedResultData.testResult.test.description}</p>
                  <Divider />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Jami Ball"
                    value={`${selectedResultData.testResult.score}/${selectedResultData.testResult.totalQuestions}`}
                    valueStyle={{ color: selectedResultData.testResult.score === selectedResultData.testResult.totalQuestions ? '#3f8600' : '#cf1322' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Foiz"
                    value={Math.round((selectedResultData.testResult.score / selectedResultData.testResult.totalQuestions) * 100)}
                    suffix="%"
                    valueStyle={{ 
                      color: Math.round((selectedResultData.testResult.score / selectedResultData.testResult.totalQuestions) * 100) >= 70 
                        ? '#3f8600' 
                        : '#cf1322' 
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Topshirilgan Vaqt"
                    value={selectedResultData.testResult.submissionTime ? dayjs(selectedResultData.testResult.submissionTime).format('DD.MM.YYYY HH:mm') : 'Topshirilmagan'}
                  />
                </Col>
              </Row>
            </Card>

            <Divider orientation="left">Savollar Tafsilotlari</Divider>

            {selectedResultData.questionResults.map((result: any, index: number) => (
              <Card 
                key={result.questionId} 
                style={{ 
                  marginBottom: 16,
                  borderLeft: `4px solid ${result.isCorrect ? '#52c41a' : '#ff4d4f'}`,
                }}
                className={result.isCorrect ? 'correct-answer' : 'incorrect-answer'}
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <h3 style={{ margin: 0 }}>Savol {index + 1}</h3>
                      <Tag color={result.isCorrect ? 'success' : 'error'}>
                        {result.isCorrect ? 'To\'g\'ri' : 'Noto\'g\'ri'}
                      </Tag>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{result.questionText}</p>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#666' }}>Talaba Javobi:</p>
                      <div style={{ 
                        padding: '8px', 
                        backgroundColor: result.isCorrect ? '#f6ffed' : '#fff2f0',
                        border: `1px solid ${result.isCorrect ? '#b7eb8f' : '#ffccc7'}`,
                        borderRadius: '4px'
                      }}>
                        {result.studentAnswer || 'Javob berilmagan'}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#666' }}>To'g'ri Javob:</p>
                      <div style={{ 
                        padding: '8px', 
                        backgroundColor: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: '4px'
                      }}>
                        {result.correctAnswer}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}

            <style>
              {`
                .correct-answer {
                  background-color: #f6ffed;
                }
                .incorrect-answer {
                  background-color: '#fff2f0';
                }
              `}
            </style>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTests; 