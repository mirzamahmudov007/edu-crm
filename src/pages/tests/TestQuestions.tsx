import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { getQuizQuestions, getQuizById } from "../../services/quizService";
import { RiArrowLeftLine, RiArrowRightLine, RiArrowLeftSLine, RiEditLine, RiSaveLine, RiCloseLine } from 'react-icons/ri';
import axiosInstance from "../../api/axiosInstance";

interface Answer {
  id: string;
  text: string;
  label: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface Quiz {
  id: string;
  title: string;
}

const TestQuestions = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
    fetchQuiz();
    fetchQuestions(page);
    // eslint-disable-next-line
  }, [id, searchParams]);

  const fetchQuiz = async () => {
    if (!id) return;
    try {
      const data = await getQuizById(id);
      setQuiz(data);
    } catch {}
  };

  const fetchQuestions = async (page: number) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getQuizQuestions(id, { page, pageSize: 10 });
      setQuestions(data.data || []);
      setTotalPages(data.meta?.pageCount || 1);
    } catch (error) {
      setError("Savollarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (value: number) => {
    setSearchParams({ page: value.toString() });
  };

  const handleEditClick = (question: Question) => {
    setEditingQuestion(question.id);
    setEditedQuestion({ ...question });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditedQuestion(null);
  };

  const handleSaveEdit = async () => {
    if (!editedQuestion) return;
    try {
      setIsLoading(true);
      await axiosInstance.put(`/questions/${editedQuestion.id}`, {
        text: editedQuestion.text,
        answers: editedQuestion.answers.map(answer => ({
          text: answer.text,
          label: answer.label,
          isCorrect: answer.isCorrect
        })),
        quizId: id
      });
      setEditingQuestion(null);
      setEditedQuestion(null);
      fetchQuestions(currentPage);
    } catch (error) {
      setError("Savolni saqlashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (field: string, value: string) => {
    if (!editedQuestion) return;
    setEditedQuestion({
      ...editedQuestion,
      [field]: value
    });
  };

  const handleAnswerChange = (answerId: string, field: string, value: string | boolean) => {
    if (!editedQuestion) return;
    setEditedQuestion({
      ...editedQuestion,
      answers: editedQuestion.answers.map(answer =>
        answer.id === answerId ? { ...answer, [field]: value } : answer
      )
    });
  };

  if (isLoading && !quiz) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-rose-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to={`/tests/${id}`}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RiArrowLeftLine size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
              <p className="text-gray-600 mt-1">Test savollari</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                {editingQuestion === question.id ? (
                  <div className="space-y-4">
                    <textarea
                      className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      rows={2}
                      value={editedQuestion?.text}
                      onChange={(e) => handleQuestionChange('text', e.target.value)}
                      placeholder="Savol matni"
                    />
                    {editedQuestion?.answers.map((answer) => (
                      <div key={answer.id} className="flex gap-4 items-center">
                        <input
                          type="text"
                          className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={answer.text}
                          onChange={(e) => handleAnswerChange(answer.id, 'text', e.target.value)}
                          placeholder="Javob matni"
                        />
                        <input
                          type="text"
                          className="w-24 p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          value={answer.label}
                          onChange={(e) => handleAnswerChange(answer.id, 'label', e.target.value)}
                          placeholder="Belgi"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={answer.isCorrect}
                            onChange={(e) => handleAnswerChange(answer.id, 'isCorrect', e.target.checked)}
                          />
                          <span className="text-sm text-gray-600">To'g'ri</span>
                        </label>
                      </div>
                    ))}
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleCancelEdit}
                      >
                        <div className="flex items-center gap-2">
                          <RiCloseLine size={16} />
                          <span>Bekor qilish</span>
                        </div>
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleSaveEdit}
                      >
                        <div className="flex items-center gap-2">
                          <RiSaveLine size={16} />
                          <span>Saqlash</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">
                        {index + 1 + (currentPage - 1) * 10}. {question.text}
                      </h3>
                      <button
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => handleEditClick(question)}
                      >
                        <RiEditLine size={20} />
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`p-4 rounded-lg border ${
                            answer.isCorrect
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                answer.isCorrect ? 'bg-green-100' : 'bg-gray-100'
                              }`}
                            >
                              <span
                                className={`text-sm font-medium ${
                                  answer.isCorrect ? 'text-green-600' : 'text-gray-600'
                                }`}
                              >
                                {answer.label}
                              </span>
                            </div>
                            <span
                              className={`text-sm ${
                                answer.isCorrect ? 'text-green-700' : 'text-gray-700'
                              }`}
                            >
                              {answer.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {/* Jami savollar soni quiz obyektidan yoki meta'dan olinadi */}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <RiArrowLeftSLine size={20} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      pageNum === currentPage
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <RiArrowRightLine size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestQuestions;
