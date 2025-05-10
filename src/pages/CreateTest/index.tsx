import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTeacherGroups } from '../../store/groupsSlice';
import { useNavigate } from 'react-router-dom';
import { testsService } from '../../services/tests.service';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

const CreateTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { groups } = useSelector((state: RootState) => state.groups);
  const [questions, setQuestions] = useState<Question[]>([{
    text: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  }]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdTestId, setCreatedTestId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    groupId: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    dispatch(fetchTeacherGroups());
  }, [dispatch]);

  const validateQuestions = () => {
    const errors: string[] = [];
    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        errors.push(`Question ${index + 1}: Question text is required`);
      }
      const validOptions = question.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        errors.push(`Question ${index + 1}: At least 2 options are required`);
      }
      if (!validOptions.includes(question.correctAnswer)) {
        errors.push(`Question ${index + 1}: Correct answer must be one of the options`);
      }
    });
    return errors;
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const testData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        groupId: Number(formData.groupId),
        startTime: formData.startTime,
        endTime: formData.endTime
      };

      const response = await testsService.createTest(testData);
      
      if (!response || !response.id) {
        throw new Error('Failed to create test');
      }

      setCreatedTestId(response.id);
      setCurrentStep(1);
    } catch (error: any) {
      console.error('Error creating test:', error);
      alert(error.message || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestions = async () => {
    try {
      if (!createdTestId) {
        alert('Test ID not found. Please create test first.');
        return;
      }

      const questionErrors = validateQuestions();
      if (questionErrors.length > 0) {
        alert(questionErrors.join('\n'));
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

      alert('Questions added successfully');
      navigate('/tests');
    } catch (error: any) {
      console.error('Error adding questions:', error);
      alert(error.message || 'Failed to add questions');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/tests')}
          className="mb-8 flex items-center text-white hover:text-purple-200 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Tests
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Steps */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center ${
                currentStep === 0
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              1. Test Details
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${
                currentStep === 1
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              2. Questions
            </button>
          </div>

          <div className="p-8">
            {currentStep === 0 ? (
              <form onSubmit={handleCreateTest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter test title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter test description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Group
                  </label>
                  <select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a group</option>
                    {groups.map((group: any) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Creating...' : 'Create Test'}
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                {questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="bg-gray-50 rounded-xl p-6 space-y-4 relative"
                  >
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question {qIndex + 1}
                      </label>
                      <textarea
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your question"
                    required
                  />
                      {/* <input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your question"
                      /> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="relative">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              question.correctAnswer === option
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300'
                            }`}
                            placeholder={`Option ${oIndex + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => updateQuestion(qIndex, 'correctAnswer', option)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center ${
                              question.correctAnswer === option
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex-1 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddQuestions}
                    disabled={loading}
                    className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Questions'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;