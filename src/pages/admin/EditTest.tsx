import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Space, message, Modal, List, Typography, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import { getTestById, updateTest, addQuestion, deleteQuestion, updateQuestion } from '../../services/tests.service';
import { Test, Question } from '../../types';

const { Title, Text } = Typography;

interface TestWithQuestions extends Test {
  questions: Question[];
}

const EditTest: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [test, setTest] = useState<TestWithQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionForm] = Form.useForm();

  useEffect(() => {
    fetchTest();
  }, [testId]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const data = await getTestById(Number(testId));
      setTest(data as TestWithQuestions);
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      });
    } catch (error: any) {
      message.error('Testni olishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await updateTest(Number(testId), values);
      message.success('Test muvaffaqiyatli yangilandi');
      navigate('/admin/tests');
    } catch (error: any) {
      message.error('Testni yangilashda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    questionForm.resetFields();
    questionForm.setFieldsValue({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: undefined,
    });
    setIsQuestionModalVisible(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    questionForm.resetFields();
    questionForm.setFieldsValue({
      text: question.text,
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer,
    });
    setIsQuestionModalVisible(true);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    Modal.confirm({
      title: 'Bu savolni o\'chirishni xohlaysizmi?',
      content: 'Bu amalni qaytarib bo\'lmaydi.',
      onOk: async () => {
        try {
          await deleteQuestion(questionId);
          message.success('Savol muvaffaqiyatli o\'chirildi');
          fetchTest();
        } catch (error: any) {
          message.error('Savolni o\'chirishda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
        }
      },
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const currentOptions = questionForm.getFieldValue('options') || ['', '', '', ''];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    questionForm.setFieldsValue({ options: newOptions });

    // If the changed option was the correct answer, update it
    const currentCorrectAnswer = questionForm.getFieldValue('correctAnswer');
    if (currentCorrectAnswer === String.fromCharCode(65 + index)) {
      questionForm.setFieldsValue({ correctAnswer: value });
    }
  };

  const handleCorrectAnswerSelect = (index: number) => {
    const options = questionForm.getFieldValue('options') || ['', '', '', ''];
    if (options[index]?.trim()) {
      questionForm.setFieldsValue({ correctAnswer: String.fromCharCode(65 + index) });
    } else {
      message.warning('Iltimos, avval variantni kiriting!');
    }
  };

  const handleQuestionSubmit = async (values: any) => {
    try {
      // Validate options
      const validOptions = values.options.filter((opt: string) => opt.trim() !== '');
      if (validOptions.length < 2) {
        message.error('Kamida 2 ta variant kiritish kerak');
        return;
      }

      if (!values.correctAnswer) {
        message.error('To\'g\'ri javobni tanlang');
        return;
      }

      const formattedValues = {
        text: values.text,
        options: validOptions,
        correctAnswer: values.correctAnswer,
      };
      
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, formattedValues);
        message.success('Savol muvaffaqiyatli yangilandi');
      } else {
        await addQuestion(Number(testId), formattedValues);
        message.success('Savol muvaffaqiyatli qo\'shildi');
      }
      setIsQuestionModalVisible(false);
      fetchTest();
    } catch (error: any) {
      message.error('Savolni saqlashda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <Title level={2} className="mb-6">Testni Tahrirlash</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={test || undefined}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="title"
                label="Sarlavha"
                rules={[{ required: true, message: 'Iltimos, test sarlavhasini kiriting!' }]}
              >
                <Input className="w-full" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Tavsif"
                rules={[{ required: true, message: 'Iltimos, tavsifni kiriting!' }]}
              >
                <Input.TextArea className="w-full" />
              </Form.Item>

              <Form.Item
                name="startTime"
                label="Boshlanish Vaqti"
                rules={[{ required: true, message: 'Iltimos, boshlanish vaqtini tanlang!' }]}
              >
                <Input type="datetime-local" className="w-full" />
              </Form.Item>

              <Form.Item
                name="endTime"
                label="Tugash Vaqti"
                rules={[{ required: true, message: 'Iltimos, tugash vaqtini tanlang!' }]}
              >
                <Input type="datetime-local" className="w-full" />
              </Form.Item>
            </div>

            <div className="flex justify-end space-x-4">
              <Button onClick={() => navigate('/admin/tests')}>
                Bekor qilish
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Saqlash
              </Button>
            </div>
          </Form>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <Title level={3}>Savollar</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddQuestion}
            >
              Savol qo'shish
            </Button>
          </div>

          <List
            dataSource={test?.questions || []}
            renderItem={(question: Question) => (
              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Text className="text-lg font-medium">{question.text}</Text>
                    <div className="mt-2">
                      <Text type="secondary">To'g'ri javob: {question.correctAnswer}</Text>
                    </div>
                  </div>
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEditQuestion(question)}
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteQuestion(question.id)}
                    />
                  </Space>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        option === question.correctAnswer
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                          option === question.correctAnswer
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {option === question.correctAnswer && (
                          <CheckOutlined className="text-green-500 text-lg" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </Card>
      </div>

      <Modal
        title={editingQuestion ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}
        open={isQuestionModalVisible}
        onCancel={() => setIsQuestionModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={questionForm}
          layout="vertical"
          onFinish={handleQuestionSubmit}
          className="space-y-6"
        >
          <Form.Item
            name="text"
            label="Savol matni"
            rules={[{ required: true, message: 'Iltimos, savol matnini kiriting!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="options"
            label="Variantlar"
            rules={[{ required: true, message: 'Iltimos, variantlarni kiriting!' }]}
          >
            <div className="space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div 
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ${
                      questionForm.getFieldValue('correctAnswer') === String.fromCharCode(65 + index)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                    onClick={() => handleCorrectAnswerSelect(index)}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <Input
                    value={questionForm.getFieldValue('options')?.[index] || ''}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`${String.fromCharCode(65 + index)} variant`}
                    className="flex-1"
                    suffix={
                      questionForm.getFieldValue('correctAnswer') === String.fromCharCode(65 + index) && (
                        <CheckOutlined className="text-green-500" />
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Form.Item>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text type="secondary" className="block mb-2">
              To'g'ri javobni tanlash uchun variant oldidagi harfni bosing
            </Text>
            <div className="flex items-center space-x-2">
              <CheckOutlined className="text-green-500" />
              <Text type="secondary">Tanlangan to'g'ri javob</Text>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setIsQuestionModalVisible(false)}>
              Bekor qilish
            </Button>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EditTest; 