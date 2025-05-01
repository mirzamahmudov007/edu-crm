import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, DatePicker, notification, Card, Space, Steps, Typography, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTeacherGroups } from '../../store/groupsSlice';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { testsService } from '../../services/tests.service';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

const CreateTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { groups } = useSelector((state: RootState) => state.groups);
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<Question[]>([{
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  }]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdTestId, setCreatedTestId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTeacherGroups());
  }, [dispatch]);

  const validateQuestions = () => {
    const errors: string[] = [];
    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        errors.push(`Savol ${index + 1}: Savol matni kiritilmagan`);
      }
      const validOptions = question.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        errors.push(`Savol ${index + 1}: Kamida 2 ta variant kiritish kerak`);
      }
      if (!validOptions.includes(question.correctAnswer)) {
        errors.push(`Savol ${index + 1}: To'g'ri javob variantlar qatorida bo'lishi kerak`);
      }
    });
    return errors;
  };

  const handleCreateTest = async (values: any) => {
    try {
      setLoading(true);
      const [startTime, endTime] = values.testTime;
      
      if (!startTime || !endTime) {
        notification.error({
          message: 'Xatolik',
          description: 'Iltimos, test vaqtini to\'g\'ri tanlang',
        });
        return;
      }

      // Validate group
      const selectedGroup = groups.find((g : any) => g.id === values.groupId);
      if (!selectedGroup) {
        notification.error({
          message: 'Xatolik',
          description: 'Iltimos, guruhni to\'g\'ri tanlang',
        });
        return;
      }

      const testData = {
        title: values.title.trim(),
        description: values.description.trim(),
        groupId: Number(values.groupId),
        startTime: startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: endTime.format('YYYY-MM-DDTHH:mm:ss')
      };

      // Create test
      const response = await testsService.createTest(testData);
      
      if (!response || !response.id) {
        throw new Error('Test yaratishda xatolik');
      }

      setCreatedTestId(response.id);
      notification.success({
        message: 'Muvaffaqiyatli',
        description: 'Test muvaffaqiyatli yaratildi. Endi savollarni qo\'shishingiz mumkin.',
      });
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Test yaratishda xatolik:', error);
      notification.error({
        message: 'Xatolik',
        description: error.response?.data || 'Test yaratishda xatolik. Iltimos, qayta urinib ko\'ring.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestions = async () => {
    try {
      if (!createdTestId) {
        notification.error({
          message: 'Xatolik',
          description: 'Test identifikatori topilmadi. Iltimos, avval test yarating.',
        });
        return;
      }

      const questionErrors = validateQuestions();
      if (questionErrors.length > 0) {
        notification.error({
          message: 'Xatolik',
          description: (
            <ul>
              {questionErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ),
        });
        return;
      }

      setLoading(true);
      const validQuestions = questions.filter(q => 
        q.text.trim() && 
        q.options.some(opt => opt.trim()) && 
        q.correctAnswer.trim()
      );

      for (const question of validQuestions) {
        await testsService.addQuestion(createdTestId, {
          text: question.text.trim(),
          options: question.options.filter(opt => opt.trim()),
          correctAnswer: question.correctAnswer.trim()
        });
      }

      notification.success({
        message: 'Muvaffaqiyatli',
        description: 'Savollar muvaffaqiyatli qo\'shildi',
      });
      navigate('/tests');
    } catch (error: any) {
      console.error('Savollarni qo\'shishda xatolik:', error);
      notification.error({
        message: 'Xatolik',
        description: error.response?.data || 'Savollarni qo\'shishda xatolik. Iltimos, qayta urinib ko\'ring.',
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    } else {
      notification.warning({
        message: 'Ogohlantirish',
        description: 'Kamida bitta savol bo\'lishi kerak',
      });
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const steps = [
    {
      title: 'Test Ma\'lumotlari',
      content: (
        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateTest}
            requiredMark={false}
          >
            <Form.Item
              name="title"
              label="Test Nomi"
              rules={[{ required: true, message: 'Iltimos, test nomini kiriting' }]}
            >
              <Input placeholder="Test nomini kiriting" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Test Tavsifi"
              rules={[{ required: true, message: 'Iltimos, test tavsifini kiriting' }]}
            >
              <TextArea rows={4} placeholder="Test haqida qisqacha ma'lumot" />
            </Form.Item>

            <Form.Item
              name="groupId"
              label="Guruh"
              rules={[{ required: true, message: 'Iltimos, guruhni tanlang' }]}
            >
              <Select placeholder="Guruhni tanlang">
                {groups.map((group:any) => (
                  <Option key={group.id} value={group.id}>{group.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="testTime"
              label="Test Vaqti"
              rules={[{ required: true, message: 'Iltimos, test vaqtini tanlang' }]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                style={{
                  height: '45px',
                  padding: '0 32px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                  border: 'none'
                }}
              >
                Testni Yaratish
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      title: 'Savollar',
      content: (
        <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {questions.map((question, qIndex) => (
              <Card 
                key={qIndex}
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Savol {qIndex + 1}</Text>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeQuestion(qIndex)}
                    />
                  </div>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Input
                    placeholder="Savol matnini kiriting"
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  />
                  <Text strong>Variantlar:</Text>
                  {question.options.map((option, oIndex) => (
                    <Input
                      key={oIndex}
                      placeholder={`Variant ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      suffix={
                        <Radio
                          checked={question.correctAnswer === option}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', option)}
                        />
                      }
                    />
                  ))}
                </Space>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={addQuestion}
              icon={<PlusOutlined />}
              style={{ width: '100%', height: '45px', borderRadius: '6px' }}
            >
              Yangi Savol Qo'shish
            </Button>
            <Button
              type="primary"
              onClick={handleAddQuestions}
              loading={loading}
              icon={<SaveOutlined />}
              style={{
                height: '45px',
                padding: '0 32px',
                borderRadius: '6px',
                fontSize: '16px',
                background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)',
                border: 'none'
              }}
            >
              Savollarni Saqlash
            </Button>
          </Space>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/tests')}
          style={{ marginBottom: 16 }}
        >
          Testlarga Qaytish
        </Button>
        <Title level={2}>Yangi Test Yaratish</Title>
        <Paragraph>
          Bu yerda siz yangi test yaratishingiz va unga savollar qo'shishingiz mumkin.
          Test yaratish uchun test ma'lumotlarini kiriting va keyin savollarni qo'shing.
        </Paragraph>
      </div>

      <Steps
        current={currentStep}
        items={steps.map(item => ({ title: item.title }))}
        style={{ marginBottom: 24 }}
      />

      {steps[currentStep].content}
    </div>
  );
};

export default CreateTest; 