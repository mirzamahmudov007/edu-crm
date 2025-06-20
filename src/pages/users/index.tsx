import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteTeacher, deleteStudent, updateTeacher, updateStudent, createTeacher, createStudent } from '../../services/userService';
import { format } from 'date-fns';
import { RiEditLine, RiDeleteBinLine, RiUserLine, RiPhoneLine, RiShieldLine, RiTimeLine, RiAddLine, RiEyeLine, RiGraduationCapLine, RiBookLine } from 'react-icons/ri';
import { EditTeacherModal } from '../../components/Modals/EditTeacherModal';
import { EditStudentModal } from '../../components/Modals/EditStudentModal';
import { CreateUserModal } from '../../components/Modals/CreateUserModal';
import { UserDetailsModal } from '../../components/Modals/UserDetailsModal';
import { useState } from 'react';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';
import type { User, PaginatedResponse } from '../../types/user';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { ActionButton } from '../../components/ui/ActionButton';

// Types
interface EditModalState {
  type: 'TEACHER' | 'STUDENT';
  id: string;
}

interface DetailsModalState {
  userId: string;
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
}

// Constants
const PAGE_SIZE = 10;

const Users = () => {
  // State
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<EditModalState | null>(null);
  const [deleteModal, setDeleteModal] = useState<EditModalState | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const [detailsModal, setDetailsModal] = useState<DetailsModalState | null>(null);
  const navigate = useNavigate();

  // Queries
  const { data, isLoading, error, isFetching } = useQuery<PaginatedResponse<User>>({
    queryKey: ['users', currentPage],
    queryFn: () => getUsers(currentPage, PAGE_SIZE)
  });

  // Mutations
  const createTeacherMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      invalidateQueries();
      setCreateModal(false);
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      invalidateQueries();
      setCreateModal(false);
    },
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      invalidateQueries();
      setDeleteModal(null);
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      invalidateQueries();
      setDeleteModal(null);
    },
  });

  // Helper Functions
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  };

  const handleCloseModal = () => {
    setCreateModal(false);
    setEditModal(null);
    setDeleteModal(null);
  };

  const handleEdit = (user: any) => {
    if (user.role === 'TEACHER') {
      setEditModal({ type: 'TEACHER', id: user.id });
    } else if (user.role === 'STUDENT') {
      setEditModal({ type: 'STUDENT', id: user.id });
    }
  };

  const handleDelete = (user: any) => {
    if (user.role === 'TEACHER') {
      setDeleteModal({ type: 'TEACHER', id: user.id });
    } else if (user.role === 'STUDENT') {
      setDeleteModal({ type: 'STUDENT', id: user.id });
    }
  };

  const handleSaveTeacher = (data: any) => {
    if (!editModal) return;
    
    setIsUpdating(true);
    handleCloseModal();
    
    const teacherData = {
      ...data,
      id: editModal.id
    };
    
    updateTeacher(teacherData.id, teacherData)
      .then(() => {
        invalidateQueries();
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleSaveStudent = (data: any) => {
    if (!editModal) return;
    
    setIsUpdating(true);
    handleCloseModal();
    
    const studentData = {
      ...data,
      id: editModal.id
    };
    
    updateStudent(studentData.id, studentData)
      .then(() => {
        invalidateQueries();
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleCreateUser = (data: any) => {
    handleCloseModal();
    
    if (data.role === 'TEACHER') {
      createTeacherMutation.mutate({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password
      });
    } else {
      createStudentMutation.mutate({
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        groupId: data.groupId
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    
    handleCloseModal();
    
    if (deleteModal.type === 'TEACHER') {
      deleteTeacherMutation.mutate(deleteModal.id);
    } else if (deleteModal.type === 'STUDENT') {
      deleteStudentMutation.mutate(deleteModal.id);
    }
  };

  const isMutating =
    createTeacherMutation.isPending ||
    createStudentMutation.isPending ||
    deleteTeacherMutation.isPending ||
    deleteStudentMutation.isPending ||
    isUpdating ||
    isFetching;

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

  const handleViewDetails = (user: User) => {
    navigate(`/users/${user.id}?role=${user.role}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 animate-pulse">
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

  // Error State
  if (error) {
    return (
      <Card className="p-6">
        <div className="text-rose-500">Foydalanuvchilarni yuklashda xatolik yuz berdi</div>
      </Card>
    );
  }

  const headerStats = [
    {
      label: 'Jami foydalanuvchilar',
      value: data?.meta.total || 0,
      icon: <RiUserLine size={24} />
    },
    {
      label: 'O\'quvchilar',
      value: data?.data.filter(u => u.role === 'STUDENT').length || 0,
      icon: <RiGraduationCapLine size={24} />
    },
    {
      label: 'O\'qituvchilar',
      value: data?.data.filter(u => u.role === 'TEACHER').length || 0,
      icon: <RiBookLine size={24} />
    }
  ];

  // Render
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Foydalanuvchilar"
        subtitle="Tizim foydalanuvchilarini boshqaring va nazorat qiling"
        gradient="bg-gradient-to-r from-green-500 to-emerald-500"
        stats={headerStats}
        action={
          <ActionButton
            variant="secondary"
            onClick={() => setCreateModal(true)}
            icon={<RiAddLine size={20} />}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Yangi foydalanuvchi
          </ActionButton>
        }
      />

      {/* Users Table */}
      <Card className="overflow-hidden">
        {isMutating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Barcha foydalanuvchilar</h2>
          <p className="text-sm text-gray-600 mt-1">Tizimda ro'yxatdan o'tgan barcha foydalanuvchilar ro'yxati</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    T/R
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Foydalanuvchi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Yaratilgan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data.map((user: User, index: number) => (
                  <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.role === 'TEACHER' 
                            ? 'bg-gradient-to-br from-blue-100 to-violet-100' 
                            : 'bg-gradient-to-br from-green-100 to-emerald-100'
                        }`}>
                          {user.role === 'TEACHER' ? (
                            <RiBookLine className="text-blue-600" size={20} />
                          ) : (
                            <RiGraduationCapLine className="text-green-600" size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RiPhoneLine className="text-gray-400" size={16} />
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 
                          user.role === 'STUDENT' ? 'bg-green-100 text-green-800' : 
                          'bg-purple-100 text-purple-800'}
                      `}>
                        <RiShieldLine className="mr-1" size={12} />
                        {user.role === 'TEACHER' ? 'O\'qituvchi' : 
                         user.role === 'STUDENT' ? 'O\'quvchi' : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RiTimeLine className="text-gray-400" size={16} />
                        <span>{format(new Date(user.createdAt), 'dd.MM.yyyy')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleViewDetails(user)}
                          title="Batafsil"
                        >
                          <RiEyeLine size={16} />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleEdit(user)}
                          title="Tahrirlash"
                        >
                          <RiEditLine size={16} />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(user)}
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
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {data?.data.map((user) => (
            <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    user.role === 'TEACHER' 
                      ? 'bg-gradient-to-br from-blue-100 to-violet-100' 
                      : 'bg-gradient-to-br from-green-100 to-emerald-100'
                  }`}>
                    {user.role === 'TEACHER' ? (
                      <RiBookLine className="text-blue-600" size={24} />
                    ) : (
                      <RiGraduationCapLine className="text-green-600" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RiPhoneLine size={14} />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleViewDetails(user)}
                  >
                    <RiEyeLine size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleEdit(user)}
                  >
                    <RiEditLine size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => handleDelete(user)}
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 
                    user.role === 'STUDENT' ? 'bg-green-100 text-green-800' : 
                    'bg-purple-100 text-purple-800'}
                `}>
                  {user.role === 'TEACHER' ? 'O\'qituvchi' : 
                   user.role === 'STUDENT' ? 'O\'quvchi' : user.role}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <RiTimeLine size={14} />
                  <span>{format(new Date(user.createdAt), 'dd.MM.yyyy')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Jami {data?.meta.total} ta foydalanuvchi
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

      {/* Modals */}
      {createModal && (
        <CreateUserModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleCreateUser}
        />
      )}

      {editModal?.type === 'TEACHER' && (
        <EditTeacherModal
          isOpen={true}
          onClose={handleCloseModal}
          teacherId={editModal.id}
          onSave={handleSaveTeacher}
        />
      )}

      {editModal?.type === 'STUDENT' && (
        <EditStudentModal
          isOpen={true}
          onClose={handleCloseModal}
          studentId={editModal.id}
          onSave={handleSaveStudent}
        />
      )}

      {deleteModal && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title={`${deleteModal.type === 'TEACHER' ? 'O\'qituvchi' : 'O\'quvchi'}ni o'chirish`}
          description={`${deleteModal.id} ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        />
      )}

      {detailsModal && (
        <UserDetailsModal
          isOpen={true}
          onClose={() => setDetailsModal(null)}
          userId={detailsModal.userId}
          userRole={detailsModal.userRole}
        />
      )}
    </div>
  );
};

export default Users;