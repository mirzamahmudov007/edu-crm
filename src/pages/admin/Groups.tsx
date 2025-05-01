import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Select, Tabs } from 'antd';
import {  PlusOutlined, UserAddOutlined, EyeOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchAllGroups, createGroup, addStudentToGroup } from '../../store/groupsSlice';
import { Group } from '../../store/groupsSlice';
import { usersService } from '../../services/users.service';

const { Option } = Select;
const { TabPane } = Tabs;

const Groups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, status } = useSelector((state: RootState) => state.groups);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [isShowStudentsModalVisible, setIsShowStudentsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [addStudentForm] = Form.useForm();
  const [createStudentForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAllGroups());
    fetchTeachers();
  }, [dispatch]);

  const fetchTeachers = async () => {
    try {
      const response = await usersService.getAllTeachers();
      setTeachers(response);
    } catch (error) {
      message.error('Failed to fetch teachers');
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
      // First create the student
      const createResponse = await usersService.createUser({
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        role: 'STUDENT'
      });

      if (createResponse) {
        // Then add them to the group
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

  const handleShowStudents = (group: Group) => {
    setSelectedGroup(group);
    setIsShowStudentsModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Teacher',
      dataIndex: ['teacher', 'fullName'],
      key: 'teacher',
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (students: any[]) => students?.length,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Group) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleShowStudents(record)}
          >
            Show Students
          </Button>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setSelectedGroup(record);
              setIsAddStudentModalVisible(true);
            }}
          >
            Add Student
          </Button>
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Create Group
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={groups}
        rowKey="id"
        loading={status === 'loading'}
      />

      <Modal
        title="Create Group"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateGroup}>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: 'Please input group name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="teacherUsername"
            label="Teacher"
            rules={[{ required: true, message: 'Please select a teacher!' }]}
          >
            <Select placeholder="Select a teacher">
              {teachers.map(teacher => (
                <Option key={teacher.username} value={teacher.username}>
                  {teacher.fullName} ({teacher.username})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
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