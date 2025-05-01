import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Tabs } from 'antd';
import { EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTeacherGroups } from '../../store/groupsSlice';
import { Group } from '../../store/groupsSlice';
import { usersService } from '../../services/users.service';
import { groupsService } from '../../services/groups.service';

const { TabPane } = Tabs;

const TeacherGroups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, status } = useSelector((state: RootState) => state.groups);
  const [isShowStudentsModalVisible, setIsShowStudentsModalVisible] = useState(false);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [addStudentForm] = Form.useForm();
  const [createStudentForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchTeacherGroups());
  }, [dispatch]);

  const handleShowStudents = (group: Group) => {
    setSelectedGroup(group);
    setIsShowStudentsModalVisible(true);
  };

  const handleAddExistingStudent = async (values: { username: string }) => {
    if (!selectedGroup) return;
    try {
      await groupsService.addStudent(selectedGroup.id, values.username);
      message.success('Student added successfully');
      addStudentForm.resetFields();
      setIsAddStudentModalVisible(false);
      dispatch(fetchTeacherGroups());
    } catch (error) {
      console.error('Error adding student:', error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to add student');
      }
    }
  };

  const handleCreateAndAddStudent = async (values: any) => {
    if (!selectedGroup) return;
    try {
      // First create the student
      await usersService.createUser({
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        role: 'STUDENT'
      });

      // Then add them to the group
      await groupsService.addStudent(selectedGroup.id, values.username);
      
      message.success('Student created and added to group successfully');
      createStudentForm.resetFields();
      setIsAddStudentModalVisible(false);
      dispatch(fetchTeacherGroups());
    } catch (error) {
      console.error('Error creating/adding student:', error);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to create and add student');
      }
    }
  };

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Number of Students',
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
      <h1>My Groups</h1>
      
      <Table
        columns={columns}
        dataSource={groups}
        rowKey="id"
        loading={status === 'loading'}
      />

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
    </div>
  );
};

export default TeacherGroups; 