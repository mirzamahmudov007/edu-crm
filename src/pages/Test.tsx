import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestByAccessId, getTestQuestions, submitTest } from '../services/tests.service';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft, Check, Clock, AlertTriangle } from 'lucide-react';

interface QuestionResult {
  questionId: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface TestResult {
  id: number;
  test: {
    title: string;
    description: string;
  };
  score: number;
  submissionTime: string;
}

interface TestSubmissionResponse {
  testResult: TestResult;
  questionResults: QuestionResult[];
}

const TestProgress: React.FC<{
  currentQuestion: number;
  totalQuestions: number;
  remainingTime: number;
  onTimeUp: () => void;
  isCorrect: boolean;
}> = ({ currentQuestion, totalQuestions, remainingTime }) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-purple-600">
            Savol {currentQuestion}/{totalQuestions}
          </span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600" 
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className={`font-mono font-bold ${remainingTime < 60 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

const Test: React.FC = () => {
  const { testAccessId } = useParams<{ testAccessId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestSubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isCorrect, __] = useState<boolean>(false);
  const [currentQuestionIndex, _] = useState<number>(0);

  useEffect(() => {
    if (testAccessId && testAccessId !== 'undefined') {
      fetchTest();
    } else {
      setError('Noto\'g\'ri test identifikatori');
      setLoading(false);
    }
  }, [testAccessId]);

  useEffect(() => {
    console.log('Test data:', test);
    console.log('Questions data:', questions);
  }, [test, questions]);

  useEffect(() => {
    if (test) {
      setRemainingTime(test.duration * 60);
    }
  }, [test]);

  useEffect(() => {
    if (remainingTime <= 0) {
      showToast('Test vaqti tugadi!', 'warning');
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    // Simple toast implementation - in a real app, you'd use a proper toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
    } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  const fetchTest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const testResponse = await getTestByAccessId(testAccessId!);
      
      if (!testResponse) {
        throw new Error('Test topilmadi');
      }
      
      setTest(testResponse);
      
      if (testResponse && testResponse.id) {
        const questionsResponse = await getTestQuestions(testResponse.id);
        console.log('Questions from API:', questionsResponse);
        setQuestions(questionsResponse);
      } else {
        throw new Error('Test identifikatori topilmadi');
      }
    } catch (error: any) {
      console.error('Testni olishda xatolik:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          setError('Sizga bu testni ko\'rish uchun ruxsat yo\'q. Iltimos, o\'qituvchingiz bilan bog\'laning.');
        } else if (error.response.status === 404) {
          setError('Test topilmadi. Test identifikatori noto\'g\'ri yoki test o\'chirilgan bo\'lishi mumkin.');
        } else {
          setError(`Server xatosi: ${error.response.status}. ${error.response.data?.message || 'Ma\'lumot yo\'q'}`);
        }
      } else if (error.request) {
        setError('Server bilan bog\'lanishda xatolik. Iltimos, internet aloqangizni tekshiring.');
      } else {
        setError(`Xatolik: ${error.message}`);
      }
      
      showToast('Testni olishda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('Submitting answers:', answers);
      
      const response = await submitTest(testAccessId!, answers);
      
      setTestResults(response);
      
      showToast('Test muvaffaqiyatli topshirildi', 'success');
    } catch (error: any) {
      console.error('Testni topshirishda xatolik:', error);
      
      if (error.response) {
        if (error.response.status === 403) {
          setError('Sizga bu testni topshirish uchun ruxsat yo\'q.');
        } else if (error.response.status === 404) {
          setError('Test topilmadi. Test identifikatori noto\'g\'ri yoki test o\'chirilgan bo\'lishi mumkin.');
        } else {
          setError(`Server xatosi: ${error.response.status}. ${error.response.data?.message || 'Ma\'lumot yo\'q'}`);
        }
      } else if (error.request) {
        setError('Server bilan bog\'lanishda xatolik. Iltimos, internet aloqangizni tekshiring.');
      } else {
        setError(`Xatolik: ${error.message}`);
      }
      
      showToast('Testni topshirishda xatolik', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / questions.length) * 100);
  };

  const handleViewAllResults = () => {
    navigate('/student/results');
  };

  const fetchQuestions = async () => {
    try {
      if (test && test.id) {
        const questionsResponse = await getTestQuestions(test.id);
        console.log('Questions fetched manually:', questionsResponse);
        setQuestions(questionsResponse);
      }
    } catch (error) {
      console.error('Savollarni olishda xatolik:', error);
      showToast('Savollarni olishda xatolik', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-700">Xatolik</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => navigate('/student/tests')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Testlarga Qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-700">Test Topilmadi</h3>
              <p className="text-yellow-600">Siz qidirayotgan test topilmadi.</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button 
              onClick={() => navigate('/student/tests')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Testlarga Qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testResults) {
    const { testResult, questionResults } = testResults;
    const correctAnswers = questionResults.filter(q => q.isCorrect).length;
    const totalQuestions = questionResults.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-purple-500">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{testResult.test.title}</h1>
          <p className="text-gray-600 mb-4">{testResult.test.description}</p>
          <div className="h-px bg-gray-200 my-4"></div>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-center text-purple-700">
                {scorePercentage}%
              </div>
              <div className="text-sm text-center text-gray-600">
                {correctAnswers} / {totalQuestions} to'g'ri
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Topshirilgan vaqt:</div>
              <div className="text-sm text-gray-600">
                {new Date(testResult.submissionTime).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h2 className="text-xl font-bold text-white">Savollar Natijalari</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {questionResults.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  {item.isCorrect ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      To'g'ri
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Noto'g'ri
                    </span>
                  )}
                </div>
                <p className="text-gray-800 mb-3 font-medium">{item.questionText}</p>
                <div className="ml-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-sm text-gray-700">Sizning javobingiz:</span>
                    <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>
                      {item.studentAnswer}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-sm text-gray-700">To'g'ri javob:</span>
                      <span className="text-green-600">{item.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={handleViewAllResults}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <Check className="w-5 h-5" />
            Barcha Natijalarimni Ko'rish
          </button>
        </div>
      </div>
    );
  }

  if (test && (!questions || questions.length === 0)) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{test.title}</h1>
          <p className="text-gray-600 mb-6">{test.description}</p>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 mb-4">Savollar yuklanmoqda...</p>
            <button 
              onClick={fetchQuestions}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Savollarni qayta yuklash
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TestProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length || 0}
        remainingTime={remainingTime}
        onTimeUp={() => showToast('Test vaqti tugadi!', 'warning')}
        isCorrect={isCorrect}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-purple-500">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{test?.title}</h1>
            <p className="text-gray-600 mb-4">{test?.description}</p>
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500" 
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {Object.keys(answers).length}/{questions.length} savollar javob berildi
              </div>
            </div>
          </div>

          {questions && questions.length > 0 ? (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div 
                  key={question.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-600 font-bold text-sm">
                        {index + 1}
                      </span>
                      {question.text}
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="grid gap-3">
                      {question.options && question.options.map((option: string, optIndex: number) => {
                        const colors = [
                          'from-red-500 to-red-400',
                          'from-blue-500 to-blue-400',
                          'from-yellow-500 to-yellow-400',
                          'from-green-500 to-green-400',
                          'from-purple-500 to-purple-400',
                          'from-pink-500 to-pink-400'
                        ];
                        const colorClass = colors[optIndex % colors.length];
                        
                        return (
                          <label 
                            key={optIndex}
                            className={`
                              relative block p-4 rounded-lg cursor-pointer transition-all
                              ${answers[question.id] === option 
                                ? `bg-gradient-to-r ${colorClass} text-white shadow-md` 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}
                            `}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              checked={answers[question.id] === option}
                              onChange={() => handleAnswerChange(question.id, option)}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                              <div className={`
                                flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                                ${answers[question.id] === option 
                                  ? 'bg-white text-gray-800' 
                                  : 'bg-white text-gray-600 border border-gray-300'}
                              `}>
                                {String.fromCharCode(65 + optIndex)}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-yellow-700">Savollar topilmadi</h3>
                  <p className="text-yellow-600">Bu testda savollar mavjud emas yoki ularni yuklab olishda xatolik yuz berdi.</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <button 
              onClick={handleSubmit}
              disabled={!questions || Object.keys(answers).length !== questions.length || submitting}
              className={`
                inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full shadow-lg 
                transition-all transform hover:-translate-y-1
                ${!questions || Object.keys(answers).length !== questions.length || submitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl'}
              `}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Topshirilmoqda...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Testni Topshirish
                </>
              )}
            </button>
            {!questions || Object.keys(answers).length !== questions.length ? (
              <p className="text-sm text-gray-500 mt-2">
                Testni topshirish uchun barcha savollarga javob bering
              </p>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Test;
