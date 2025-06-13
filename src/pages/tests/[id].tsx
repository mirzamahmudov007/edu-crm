import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { getQuizQuestions } from '../../services/quizService';
import { RiArrowLeftLine, RiTimeLine, RiQuestionLine, RiCalendarLine, RiArrowRightLine, RiArrowLeftSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const TestDetails = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz-questions', id, page],
    queryFn: () => getQuizQuestions(id as string, { page, pageSize })
  });

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

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
        <div className="text-rose-500">Error loading test details</div>
      </div>
    );
  }

  const quiz = data?.data[0]?.quiz;
  const totalPages = data?.meta?.pageCount || 1;

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
              <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
              <p className="text-gray-600 mt-1">Test savollari</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RiTimeLine className="text-gray-400" size={16} />
              <span>{quiz?.duration} daqiqa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RiQuestionLine className="text-gray-400" size={16} />
              <span>{quiz?.questionCount} ta savol</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RiCalendarLine className="text-gray-400" size={16} />
              <span>{new Date(quiz?.startDate).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {data?.data.map((question: any, index: number) => (
            <div key={question.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-blue-600">{index + 1 + (page - 1) * pageSize}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{question.text}</h3>
                  <div className="space-y-3">
                    {question.answers.map((answer: any) => (
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Jami {data?.meta?.total} ta savol
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`p-2 rounded-lg ${
                page === 1
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
                    pageNum === page
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`p-2 rounded-lg ${
                page === totalPages
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
  );
};

export default TestDetails; 