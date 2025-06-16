import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizByDId } from "../../services/quizService";
import { RiArrowLeftLine, RiTimeLine, RiQuestionLine, RiCalendarLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

interface Quiz {
  id: string;
  title: string;
  duration?: number;
  questionCount?: number;
  startDate?: string;
  status?: string;
  group?: { name: string };
}

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await getQuizByDId(id);
        setQuiz(data);
      } catch (error) {
        setError("Test ma'lumotlarini yuklashda xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (isLoading) {
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

  if (!quiz) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/tests"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RiArrowLeftLine size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-gray-600 mt-1">Test tafsilotlari</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RiTimeLine className="text-gray-400" size={16} />
              <span>{quiz.duration ?? '-'} daqiqa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RiQuestionLine className="text-gray-400" size={16} />
              <span>{quiz.questionCount ?? '-'} ta savol</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RiCalendarLine className="text-gray-400" size={16} />
              <span>
                {quiz.startDate
                  ? new Date(quiz.startDate).toLocaleString()
                  : 'Sana yo‘q'}
              </span>
            </div>
            {quiz.status && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="capitalize">{quiz.status}</span>
              </div>
            )}
          </div>
        </div>
        {quiz.group?.name && (
          <div className="mt-4 text-gray-700">
            <span className="font-semibold">Guruh: </span>
            {quiz.group.name}
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => navigate(`/tests/${id}/questions`)}
          >
            Savollar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDetails; 