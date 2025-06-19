import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuizzes, deleteQuiz, updateQuiz } from '../../services/quizService';
import { RiAddLine, RiFileListLine, RiTimeLine, RiQuestionLine, RiCalendarLine, RiEditLine, RiDeleteBinLine, RiEyeLine, RiPlayLine } from 'react-icons/ri';
import { CreateQuizModal } from '../../components/Modals/CreateQuizModal';
import { EditQuizModal } from '../../components/Modals/EditQuizModal';
import type { Quiz } from '../../types/quiz';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { ActionButton } from '../../components/ui/ActionButton';

const Tests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [createModal, setCreateModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Faol';
      case 'completed':
        return 'Yakunlangan';
      case 'pending':
        return 'Kutilmoqda';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-rose-500">Testlarni yuklashda xatolik yuz berdi</div>
      </Card>
    );
  }

  const headerStats = [
    {
      label: 'Jami testlar',
      value: data?.meta.total || 0,
      icon: <RiFileListLine size={24} />
    },
    {
      label: 'Faol testlar',
      value: data?.data.filter(t => t.status === 'active').length || 0,
      icon: <RiPlayLine size={24} />
    },
    {
      label: 'Yakunlangan',
      value: data?.data.filter(t => t.status === 'completed').length || 0,
      icon: <RiTimeLine size={24} />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Testlar"
        subtitle="Test va imtihonlarni boshqaring va nazorat qiling"
        gradient="bg-gradient-to-r from-rose-500 to-pink-500"
        stats={headerStats}
        action={
          <ActionButton
            variant="secondary"
            onClick={() => setCreateModal(true)}
            icon={<RiAddLine size={20} />}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Yangi test
          </ActionButton>
        }
      />

      {/* Tests Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Barcha testlar</h2>
          <p className="text-sm text-gray-600 mt-1">Tizimda mavjud bo'lgan barcha test va imtihonlar ro'yxati</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  T/R
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Test nomi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Davomiyligi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Savollar soni
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Boshlash vaqti
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Holati
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((quiz: Quiz, index: number) => (
                <tr key={quiz.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                        <RiFileListLine className="text-rose-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500">ID: {quiz.id}</div>
                      </div>
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
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                      {getStatusText(quiz.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/tests/${quiz.id}`}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ko'rish"
                      >
                        <RiEyeLine size={16} />
                      </Link>
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Tahrirlash"
                      >
                        <RiEditLine size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="O'chirish"
                      >
                        <RiDeleteBinLine size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Jami {data?.meta.total} ta test
          </div>
          <div className="flex items-center gap-2">
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Oldingi
            </ActionButton>
            <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
              {currentPage} / {data?.meta.pageCount}
            </span>
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={handleNextPage}
              disabled={!data?.meta.pageCount || currentPage >= data.meta.pageCount}
            >
              Keyingi
            </ActionButton>
          </div>
        </div>
      </Card>

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
              <ActionButton
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Bekor qilish
              </ActionButton>
              <ActionButton
                variant="danger"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'O\'chirilmoqda...' : 'O\'chirish'}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;