import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuizzes } from '../../services/quizService';
import { RiAddLine, RiFileListLine, RiTimeLine, RiQuestionLine, RiCalendarLine } from 'react-icons/ri';
import { CreateQuizModal } from '../../components/Modals/CreateQuizModal';
import type { Quiz } from '../../types/quiz';
import type { PaginatedResponse } from '../../types/common';

const Tests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createModal, setCreateModal] = useState(false);
  const PAGE_SIZE = 10;

  const { data, isLoading, error } = useQuery<PaginatedResponse<Quiz>>({
    queryKey: ['quizzes', currentPage],
    queryFn: () => getQuizzes(currentPage, PAGE_SIZE)
  });

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.meta.pageCount && currentPage < data.meta.pageCount) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleCloseModal = () => {
    setCreateModal(false);
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
        <div className="text-rose-500">Error loading tests</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testlar</h1>
          <p className="text-gray-600 mt-1">Barcha testlar ro'yxati</p>
        </div>
        <button 
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 shadow-sm"
        >
          <RiAddLine size={20} />
          <span>Yangi test</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Test nomi</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Davomiyligi</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Savollar soni</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Boshlash vaqti</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Holati</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.data.map((quiz: Quiz) => (
              <tr key={quiz.id} className="group hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                      <RiFileListLine className="text-blue-600" size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{quiz.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiTimeLine className="text-gray-400" size={16} />
                    <span>{quiz.duration} daqiqa</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiQuestionLine className="text-gray-400" size={16} />
                    <span>{quiz.questionCount} ta</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiCalendarLine className="text-gray-400" size={16} />
                    <span>{quiz.startDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                    ${quiz.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      quiz.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {quiz.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="md:hidden divide-y divide-gray-100">
        {data?.data.map((quiz: Quiz) => (
          <div key={quiz.id} className="p-4 hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                <RiFileListLine className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <RiTimeLine className="text-gray-400" size={14} />
                  <span>{quiz.duration} daqiqa</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 pl-15">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RiQuestionLine className="text-gray-400" size={14} />
                <span>Savollar soni: {quiz.questionCount} ta</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RiCalendarLine className="text-gray-400" size={14} />
                <span>Boshlash vaqti: {quiz.startDate}</span>
              </div>
              <div>
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                  ${quiz.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    quiz.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'}
                `}>
                  {quiz.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Jami {data?.meta.total} ta test
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors ${
              currentPage === 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            Oldingi
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
            {currentPage} / {data?.meta.pageCount}
          </span>
          <button 
            onClick={handleNextPage}
            disabled={!data?.meta.pageCount || currentPage >= data.meta.pageCount}
            className={`px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors ${
              !data?.meta.pageCount || currentPage >= data.meta.pageCount
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            Keyingi
          </button>
        </div>
      </div>

      {createModal && (
        <CreateQuizModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Tests; 