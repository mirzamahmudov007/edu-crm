import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Select, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchAllGroups, createGroup, addStudentToGroup } from '../../store/groupsSlice';
import { Group } from '../../store/groupsSlice';
import { usersService } from '../../services/users.service';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;

const Groups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups } = useSelector((state: RootState) => state.groups);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [isShowStudentsModalVisible, setIsShowStudentsModalVisible] = useState(false);
  const [selectedGroup, _] = useState<Group | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [addStudentForm] = Form.useForm();
  const [createStudentForm] = Form.useForm();
  const [deletedGroups, setDeletedGroups] = useState<Group[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllGroups());
    fetchTeachers();
    fetchDeletedGroups();
  }, [dispatch]);

  const fetchTeachers = async () => {
    try {
      const response = await usersService.getAllTeachers();
      setTeachers(response);
    } catch (error) {
      message.error('Failed to fetch teachers');
    }
  };

  const fetchDeletedGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8081/api/groups/admin/deleted');
      setDeletedGroups(response.data);
    } catch (error) {
      message.error('O\'chirilgan guruhlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (values: { name: string; teacherUsername: string }) => {
    try {
      const selectedTeacher = teachers.find(t => t.username === values.teacherUsername);
      if (!selectedTeacher) {
        message.error('Selected teacher not found');
        return;
      }

      await dispatch(createGroup({
        name: values.name,
        teacherUsername: selectedTeacher.username
      })).unwrap();
      
      message.success('Group created successfully');
      setIsModalVisible(false);
      form.resetFields();
      dispatch(fetchAllGroups());
    } catch (error) {
      message.error('Failed to create group');
    }
  };

  const handleAddExistingStudent = async (values: { username: string }) => {
    if (!selectedGroup) return;
    try {
      await dispatch(addStudentToGroup({ 
        groupId: selectedGroup.id, 
        username: values.username 
      })).unwrap();
      message.success('Student added successfully');
      addStudentForm.resetFields();
      dispatch(fetchAllGroups());
    } catch (error) {
      message.error('Failed to add student');
    }
  };

  const handleCreateAndAddStudent = async (values: any) => {
    if (!selectedGroup) return;
    try {
      const createResponse = await usersService.createUser({
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        role: 'STUDENT'
      });

      if (createResponse) {
        await dispatch(addStudentToGroup({
          groupId: selectedGroup.id,
          username: values.username
        })).unwrap();
        
        message.success('Student created and added to group successfully');
        createStudentForm.resetFields();
        dispatch(fetchAllGroups());
      }
    } catch (error) {
      message.error('Failed to create and add student');
    }
  };

  // const handleShowStudents = (group: Group) => {
  //   setSelectedGroup(group);
  //   setIsShowStudentsModalVisible(true);
  // };

  const handleSoftDelete = async (id: number) => {
    try {
      await axios.put(`http://localhost:8081/api/groups/${id}/soft-delete`);
      message.success('Guruh muvaffaqiyatli o\'chirildi');
      dispatch(fetchAllGroups());
      fetchDeletedGroups();
    } catch (error) {
      message.error('Guruhni o\'chirishda xatolik yuz berdi');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await axios.put(`http://localhost:8081/api/groups/${id}/restore`);
      message.success('Guruh muvaffaqiyatli tiklandi');
      dispatch(fetchAllGroups());
      fetchDeletedGroups();
    } catch (error) {
      message.error('Guruhni tiklashda xatolik yuz berdi');
    }
  };

  const handleHardDelete = async (id: number) => {
    try {
      await axios.delete(`/api/groups/${id}`);
      message.success('Guruh butunlay o\'chirildi');
      fetchDeletedGroups();
    } catch (error) {
      message.error('Guruhni o\'chirishda xatolik yuz berdi');
    }
  };

  const columns = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'O\'qituvchi',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: any) => teacher?.fullName || 'Belgilanmagan',
    },
    {
      title: 'O\'quvchilar soni',
      dataIndex: 'students',
      key: 'studentsCount',
      render: (students: any[]) => students?.length || 0,
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Group) => (
        <Space>
          {!showDeleted ? (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {/* Edit logic */}}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleSoftDelete(record.id)}
              />
            </>
          ) : (
            <>
              <Button
                type="text"
                className="text-green-600 hover:text-green-700"
                icon={<UndoOutlined />}
                onClick={() => handleRestore(record.id)}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleHardDelete(record.id)}
              />
            </>
          )}
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    }
  ];

  return (
    <div className="p-6 bg-white">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {showDeleted ? 'O\'chirilgan guruhlar' : 'Faol guruhlar'}
          </h2>
          <div className="flex gap-4">
            <Button
              type={showDeleted ? 'default' : 'primary'}
              onClick={() => setShowDeleted(false)}
            >
              Faol guruhlar
            </Button>
            <Button
              type={showDeleted ? 'primary' : 'default'}
              danger={showDeleted}
              onClick={() => setShowDeleted(true)}
            >
              O'chirilganlar
            </Button>
            {!showDeleted && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="bg-blue-600"
              >
                Yangi guruh
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={showDeleted ? deletedGroups : groups}
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
      </div>

      <Modal
        title="Yangi guruh yaratish"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            name="name"
            label="Guruh nomi"
            rules={[{ required: true, message: 'Guruh nomini kiriting!' }]}
          >
            <Input placeholder="Guruh nomini kiriting" />
          </Form.Item>
          <Form.Item
            name="teacherUsername"
            label="O'qituvchi"
            rules={[{ required: true, message: 'O\'qituvchini tanlang!' }]}
          >
            <Select
              placeholder="O'qituvchini tanlang"
              showSearch
              optionFilterProp="children"
            >
              {teachers.map(teacher => (
                <Option key={teacher.username} value={teacher.username}>
                  {teacher.fullName} ({teacher.username})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Bekor qilish
              </Button>
              <Button type="primary" htmlType="submit" className="bg-blue-600">
                Yaratish
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Student to Group"
        open={isAddStudentModalVisible}
        onCancel={() => {
          setIsAddStudentModalVisible(false);
          addStudentForm.resetFields();
          createStudentForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Add Existing Student" key="1">
            <Form form={addStudentForm} onFinish={handleAddExistingStudent}>
              <Form.Item
                name="username"
                label="Student Username"
                rules={[{ required: true, message: 'Please input student username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Existing Student
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Create New Student" key="2">
            <Form form={createStudentForm} onFinish={handleCreateAndAddStudent}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please input username!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input password!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please input full name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Create and Add Student
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>

      <Modal
        title={`Students in ${selectedGroup?.name}`}
        open={isShowStudentsModalVisible}
        onCancel={() => setIsShowStudentsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Table
          columns={studentColumns}
          dataSource={selectedGroup?.students}  
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default Groups;