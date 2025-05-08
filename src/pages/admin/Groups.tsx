import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Select, Tabs, Tag } from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchAllGroups, createGroup, addStudentToGroup } from '../../store/groupsSlice';
import { Group } from '../../store/groupsSlice';
import { usersService } from '../../services/users.service';
import { EyeOutlined, UserAddOutlined } from '@ant-design/icons';


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

  const handleShowStudents = (group: Group) => {
    setSelectedGroup(group);
    setIsShowStudentsModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Mentor',
      dataIndex: ['teacher', 'fullName'],
      key: 'teacher',
      width: '15%',
    },
    {
      title: 'Members',
      dataIndex: 'students',
      key: 'students',
      render: (students: any[]) => students?.length || 0,
      width: '10%',
      align: 'center' as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <Tag color="green">Active</Tag> 
      ),
      width: '10%',
      align: 'center' as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Group) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleShowStudents(record)}
          >
          </Button>
          <Button
          type='text'
            icon={<UserAddOutlined />}
            onClick={() => {
              setSelectedGroup(record);
              setIsAddStudentModalVisible(true);
            }}
          >
          </Button>
        </Space>
      ),
      width: '10%',
      align: 'center' as const,
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
    <div style={{ padding: '24px', backgroundColor: '#fff' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 className="text-2xl font-bold text-gray-800">Gruhlar</h2>
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
        bordered
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 10,
        }}
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