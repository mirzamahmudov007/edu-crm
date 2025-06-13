import  { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuizzes, deleteQuiz, updateQuiz } from '../../services/quizService';
import { RiAddLine, RiFileListLine, RiTimeLine, RiQuestionLine, RiCalendarLine, RiEditLine, RiDeleteBinLine, RiEyeLine } from 'react-icons/ri';
import { CreateQuizModal } from '../../components/Modals/CreateQuizModal';
import { EditQuizModal } from '../../components/Modals/EditQuizModal';
import type { Quiz } from '../../types/quiz';
import { Link } from 'react-router-dom';

const Tests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createModal, setCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showFilters, _] = useState(false);
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes', currentPage],
    queryFn: () => getQuizzes(currentPage, PAGE_SIZE)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setIsDeleteModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateQuiz(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setIsEditModalOpen(false);
      setSelectedQuiz(null);
    },
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

  const handleEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  const handleDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedQuiz) {
      deleteMutation.mutate(selectedQuiz.id);
    }
  };

  const handleSave = (data: any) => {
    if (selectedQuiz) {
      updateMutation.mutate({ id: selectedQuiz.id, data });
    }
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
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testlar</h1>
            <p className="text-gray-600 mt-1">Barcha testlar ro'yxati</p>
          </div>
          <button
            onClick={() => setCreateModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RiAddLine size={20} />
            Yangi test
          </button>
        </div>

        {/* Search and Filter */}
        {/* <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Test nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-sm ${
              showFilters 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <RiFilterLine size={18} />
            <span>Filter</span>
          </button>
        </div> */}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="">Barcha holatlar</option>
                  <option value="active">Faol</option>
                  <option value="pending">Kutilmoqda</option>
                  <option value="completed">Yakunlangan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Savollar soni</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="">Barcha</option>
                  <option value="1-10">1-10</option>
                  <option value="11-20">11-20</option>
                  <option value="21-30">21-30</option>
                  <option value="31+">31+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tartib</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="name_asc">Nomi (A-Z)</option>
                  <option value="name_desc">Nomi (Z-A)</option>
                  <option value="date_asc">Sana (Eskidan yangi)</option>
                  <option value="date_desc">Sana (Yangi dan eski)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T/R
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test nomi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Davomiyligi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Savollar soni
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Boshlash vaqti
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holati
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.data.map((quiz: Quiz, index: number) => (
              <tr key={quiz.id} className="group hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {(currentPage - 1) * PAGE_SIZE + index + 1}
                </td>
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
                    <span>{new Date(quiz.startDate).toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : quiz.status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {quiz.status === 'active'
                      ? 'Faol'
                      : quiz.status === 'completed'
                      ? 'Yakunlangan'
                      : 'Kutilmoqda'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/tests/${quiz.id}`}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ko'rish"
                    >
                      <RiEyeLine size={18} />
                    </Link>
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Tahrirlash"
                    >
                      <RiEditLine size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz)}
                      className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {isEditModalOpen && selectedQuiz && (
        <EditQuizModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedQuiz(null);
          }}
          quizId={selectedQuiz.id}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && selectedQuiz && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Testni o'chirish</h2>
            <p className="text-gray-600 mb-6">
              "{selectedQuiz.title}" testini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? 'O\'chirilmoqda...' : 'O\'chirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests; 