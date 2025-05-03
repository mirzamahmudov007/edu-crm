import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Select, DatePicker, message } from 'antd';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Result {
  id: number;
  studentName: string;
  testName: string;
  score: number;
  totalQuestions: number;
  completionTime: string;
  status: string;
}

const Results: React.FC = () => {
  const [results, _] = useState<Result[]>([
    {
      id: 1,
      studentName: 'John Doe',
      testName: 'Math Test',
      score: 85,
      totalQuestions: 20,
      completionTime: '2024-03-15 14:30:00',
      status: 'COMPLETED',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      testName: 'Physics Test',
      score: 92,
      totalQuestions: 30,
      completionTime: '2024-03-15 15:45:00',
      status: 'COMPLETED',
    },
  ]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Test',
      dataIndex: 'testName',
      key: 'testName',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: Result) => `${score}/${record.totalQuestions}`,
    },
    {
      title: 'Completion Time',
      dataIndex: 'completionTime',
      key: 'completionTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Result) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload()}
          />
        </Space>
      ),
    },
  ];

  const handleView = (result: Result) => {
    Modal.info({
      title: 'Test Result Details',
      width: 600,
      content: (
        <div>
          <p><strong>Student:</strong> {result.studentName}</p>
          <p><strong>Test:</strong> {result.testName}</p>
          <p><strong>Score:</strong> {result.score}/{result.totalQuestions}</p>
          <p><strong>Completion Time:</strong> {result.completionTime}</p>
          <p><strong>Status:</strong> {result.status}</p>
        </div>
      ),
    });
  };

  const handleDownload = () => {
    // Implement download functionality
    message.success('Downloading result...');
  };

  const handleFilter = (values: any) => {
    console.log('Filter values:', values);
    setIsFilterModalVisible(false);
    // Implement filter functionality
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsFilterModalVisible(true)}>
          Filter Results
        </Button>
      </div>
      <Table columns={columns} dataSource={results} rowKey="id" />
      
      <Modal
        title="Filter Results"
        open={isFilterModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsFilterModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleFilter}>
          <Form.Item name="dateRange" label="Date Range">
            <RangePicker />
          </Form.Item>
          <Form.Item name="test" label="Test">
            <Select allowClear>
              <Option value="math">Math Test</Option>
              <Option value="physics">Physics Test</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select allowClear>
              <Option value="COMPLETED">Completed</Option>
              <Option value="IN_PROGRESS">In Progress</Option>
              <Option value="EXPIRED">Expired</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Results; 