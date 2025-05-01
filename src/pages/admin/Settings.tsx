import React from 'react';
import { Form, Input, Button, Card, Switch, InputNumber, message } from 'antd';

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Settings values:', values);
    message.success('Settings updated successfully');
  };

  return (
    <div>
      <h1>System Settings</h1>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            siteName: 'ITECH Test Platform',
            siteDescription: 'Online testing platform for educational institutions',
            maxTestDuration: 120,
            maxQuestionsPerTest: 50,
            enableEmailNotifications: true,
            enableAutoGrading: true,
            maintenanceMode: false,
          }}
        >
          <Form.Item
            label="Site Name"
            name="siteName"
            rules={[{ required: true, message: 'Please input site name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Site Description"
            name="siteDescription"
            rules={[{ required: true, message: 'Please input site description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Maximum Test Duration (minutes)"
            name="maxTestDuration"
            rules={[{ required: true, message: 'Please input maximum test duration!' }]}
          >
            <InputNumber min={1} max={480} />
          </Form.Item>

          <Form.Item
            label="Maximum Questions Per Test"
            name="maxQuestionsPerTest"
            rules={[{ required: true, message: 'Please input maximum questions per test!' }]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>

          <Form.Item
            label="Enable Email Notifications"
            name="enableEmailNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Enable Auto Grading"
            name="enableAutoGrading"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Maintenance Mode"
            name="maintenanceMode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 