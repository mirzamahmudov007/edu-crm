import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tabs, Tag, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
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

  const exportTestToWord = async (testId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/tests/export/${testId}/word`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const test = tests.find(t => t.id === testId);
      const fileName = test ? `test_${test.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx` : `test_${testId}.docx`;
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      message.success('Test muvaffaqiyatli export qilindi');
    } catch (error) {
      console.error('Export error:', error);
      message.error('Export jarayonida xatolik yuz berdi');
    }
  };

  const fetchTestResults = async (testId: number) => {
    try {
      setLoadingResults(true);
      const response = await fetch(`http://localhost:8081/api/test-results/${testId}`, {
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

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Tag color="green">Faol</Tag>;
      case 'COMPLETED': return <Tag color="blue">Yakunlangan</Tag>;
      case 'UPCOMING': return <Tag color="orange">Kutilmoqda</Tag>;
      default: return <Tag color="default">{status}</Tag>;
    }
  };

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
      const data = await getDetailedTestResult(resultId);
      setSelectedResultData(data);
      setIsResultModalVisible(true);
    } catch (error: any) {
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
    
    if (now.isBefore(startTime)) {
      return 'UPCOMING';
    } else if (now.isAfter(endTime)) {
      return 'COMPLETED';
    } else {
      return 'ACTIVE';
    }
  };

  const columns = [
    {
      title: 'Sarlavha',
      dataIndex: 'title',
      key: 'title',
      width: '15%',
    },
    {
      title: 'Guruh',
      dataIndex: ['group', 'name'],
      key: 'group',
      width: '10%',
    },
    {
      title: 'O\'qituvchi',
      dataIndex: ['teacher', 'fullName'],
      key: 'teacher',
      width: '10%',
    },
    {
      title: 'Holat',
      key: 'status',
      width: '8%',
      render: ( record: Test) => getStatusTag(getTestStatus(record)),
    },
    {
      title: 'Savollar Soni',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
      width: '5%',
      align: 'center' as const,
    },
    {
      title: 'Amallar',
      key: 'actions',
      width: '20%',
        align: 'center' as const,
      render: (record: Test) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
          <Button
            type="link"
            size="small"
            onClick={() => exportTestToWord(record.id)}
          >
            Word
          </Button>
        </Space>
      ),
    },
  ];

  
  return (
    <div style={{ padding: '24px', backgroundColor: '#fff' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="text-2xl font-bold text-gray-800">Testlar</h2>
        {user.role === "TEACHER" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/tests/create")}
          >
            Test qo'shish
          </Button>
        )}
      </div>

      {user.role === "ADMIN" && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <Select
              placeholder="Guruh bo'yicha filtrlash"
              allowClear
              onChange={(value) => handleFilterChange('groupId', value)}
              style={{ width: '100%' }}
            >
              {groups.map(group => (
                <Option key={group.id} value={group.id}>{group.name}</Option>
              ))}
            </Select>
            
            <Select
              placeholder="O'qituvchi bo'yicha filtrlash"
              allowClear
              onChange={(value) => handleFilterChange('teacherId', value)}
              style={{ width: '100%' }}
            >
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>{teacher.fullName}</Option>
              ))}
            </Select>
            
            <Select
              placeholder="Holat bo'yicha filtrlash"
              allowClear
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
            >
              <Option value="ACTIVE">Faol</Option>
              <Option value="COMPLETED">Yakunlangan</Option>
              <Option value="UPCOMING">Kutilmoqda</Option>
            </Select>
          </div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={tests}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 10,
        }}
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
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{selectedTest.title}</h2>
                      <p className="text-gray-600">{selectedTest.description}</p>
                      <Divider />
                      <p><strong className="text-gray-700">Guruh:</strong> {selectedTest.group?.name}</p>
                      <p><strong className="text-gray-700">O'qituvchi:</strong> {selectedTest.group?.teacher?.fullName}</p>
                      <p><strong className="text-gray-700">Savollar Soni:</strong> {selectedTest.totalQuestions || 0}</p>
                    </div>
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded">
                          <p className="text-sm font-medium text-gray-500">Boshlanish Vaqti</p>
                          <p className="text-lg">{dayjs(selectedTest.startTime).format('DD.MM.YYYY HH:mm')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded">
                          <p className="text-sm font-medium text-gray-500">Tugash Vaqti</p>
                          <p className="text-lg">{dayjs(selectedTest.endTime).format('DD.MM.YYYY HH:mm')}</p>
                        </div>
                      </div>
                      <Divider />
                      <div className="bg-gray-50 p-4 rounded">
                        <p className="text-sm font-medium text-gray-500">Holat</p>
                        {getStatusTag(getTestStatus(selectedTest))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Test Natijalari" key="2">
                <Table
                  columns={[
                    {
                      title: 'Talaba',
                      dataIndex: ['student', 'fullName'],
                      key: 'student',
                    },
                    {
                      title: 'Ball',
                      key: 'score',
                      render: (_, record: any) => {
                        const totalQuestions = record.totalQuestions || 0;
                        const percentage = totalQuestions > 0 ? Math.round((record.score / totalQuestions) * 100) : 0;
                        const percentageColor = percentage >= 70 ? 'green' : percentage >= 50 ? 'orange' : 'red';
                        
                        return (
                          <div>
                            <div>{record.score} / {totalQuestions}</div>
                            <div style={{ color: percentageColor }}>
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
                      render: (submissionTime: string) => 
                        submissionTime ? dayjs(submissionTime).format('DD.MM.YYYY HH:mm') : 'Topshirilmagan',
                    },
                    {
                      title: 'Holat',
                      key: 'status',
                      render: (_, record: any) => 
                        !record.submissionTime ? (
                          <Tag color="default">Boshlanmagan</Tag>
                        ) : (
                          <Tag color="green">Yakunlangan</Tag>
                        ),
                    },
                    {
                      title: 'Amallar',
                      key: 'actions',
                      render: (_, record: any) => (
                        <Button 
                          type="link"
                          onClick={() => handleViewResultDetails(record.id)}
                        >
                          Batafsil Ko'rish
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={testResults}
                  rowKey="id"
                  loading={loadingResults}
                  pagination={false}
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
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="grid grid-cols-1">
                <div>
                  <h2 className="text-xl font-bold">{selectedResultData.testResult.test.title}</h2>
                  <p className="text-gray-600">{selectedResultData.testResult.test.description}</p>
                  <Divider />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-medium text-gray-500">Jami Ball</p>
                  <p className={`text-lg ${selectedResultData.testResult.score === selectedResultData.testResult.totalQuestions ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedResultData.testResult.score}/{selectedResultData.testResult.totalQuestions}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-medium text-gray-500">Foiz</p>
                  <p className={`text-lg ${Math.round((selectedResultData.testResult.score / selectedResultData.testResult.totalQuestions) * 100) >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round((selectedResultData.testResult.score / selectedResultData.testResult.totalQuestions) * 100)}%
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-medium text-gray-500">Topshirilgan Vaqt</p>
                  <p className="text-lg">
                    {selectedResultData.testResult.submissionTime ? dayjs(selectedResultData.testResult.submissionTime).format('DD.MM.YYYY HH:mm') : 'Topshirilmagan'}
                  </p>
                </div>
              </div>
            </div>

            <Divider orientation="left">Savollar Tafsilotlari</Divider>

            {selectedResultData.questionResults.map((result: any, index: number) => (
              <div 
                key={result.questionId} 
                className={`mb-4 p-4 rounded-lg border-l-4 ${result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Savol {index + 1}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result.isCorrect ? 'To\'g\'ri' : 'Noto\'g\'ri'}
                    </span>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium">{result.questionText}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Talaba Javobi:</p>
                      <div className={`p-2 rounded ${result.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {result.studentAnswer || 'Javob berilmagan'}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">To'g'ri Javob:</p>
                      <div className="bg-green-50 p-2 rounded border border-green-200">
                        {result.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminTests;