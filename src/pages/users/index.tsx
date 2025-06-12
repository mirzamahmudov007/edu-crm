import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteTeacher, deleteStudent, updateTeacher, updateStudent, createTeacher, createStudent } from '../../services/userService';
import { format } from 'date-fns';
import { RiEditLine, RiDeleteBinLine, RiUserLine, RiPhoneLine, RiShieldLine, RiTimeLine, RiAddLine, RiEyeLine, RiSearchLine, RiFilterLine } from 'react-icons/ri';
import { EditTeacherModal } from '../../components/Modals/EditTeacherModal';
import { EditStudentModal } from '../../components/Modals/EditStudentModal';
import { CreateUserModal } from '../../components/Modals/CreateUserModal';
import { UserDetailsModal } from '../../components/Modals/UserDetailsModal';
import { useState } from 'react';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';
import type { User, PaginatedResponse } from '../../types/user';

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
const PAGE_SIZE = 5;

const Users = () => {
  // State
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<EditModalState | null>(null);
  const [deleteModal, setDeleteModal] = useState<EditModalState | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const [detailsModal, setDetailsModal] = useState<DetailsModalState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Queries
  const { data, isLoading, error, isFetching } = useQuery<PaginatedResponse<User>>({
    queryKey: ['users', currentPage],
    queryFn: () => getUsers(currentPage, PAGE_SIZE)
  });

  console.log(queryClient);
  
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
    setDetailsModal({ userId: user.id, userRole: user.role });
  };

  // Loading State
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

  // Error State
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-rose-500">Error loading users</div>
      </div>
    );
  }

  // Render
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
            <p className="text-gray-600 mt-1">Barcha foydalanuvchilar ro'yxati</p>
          </div>
          <button 
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 shadow-sm"
          >
            <RiAddLine size={20} />
            <span>Yangi foydalanuvchi</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="F.I.O yoki telefon bo'yicha qidirish..."
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
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="">Barcha rollar</option>
                  <option value="TEACHER">O'qituvchi</option>
                  <option value="STUDENT">O'quvchi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guruh</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="">Barcha guruhlar</option>
                  <option value="1">Guruh 1</option>
                  <option value="2">Guruh 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tartib</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="name_asc">F.I.O (A-Z)</option>
                  <option value="name_desc">F.I.O (Z-A)</option>
                  <option value="date_asc">Sana (Eskidan yangi)</option>
                  <option value="date_desc">Sana (Yangi dan eski)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block relative">
        {isMutating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  T/R
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  F.I.O
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yaratilgan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((user: User, index: number) => (
                <tr key={user.id} className="group hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                        <RiUserLine className="text-blue-600" size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 transition-all duration-300">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiPhoneLine className="text-gray-400" size={16} />
                      <span className="transition-all duration-300">{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300
                      ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 
                        user.role === 'STUDENT' ? 'bg-green-100 text-green-800' : 
                        'bg-purple-100 text-purple-800'}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiTimeLine className="text-gray-400" size={16} />
                      <span className="transition-all duration-300">{format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => handleViewDetails(user)}
                        title="Batafsil"
                      >
                        <RiEyeLine size={18} />
                      </button>
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(user)}
                        title="Tahrirlash"
                      >
                        <RiEditLine size={18} />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(user)}
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
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100 relative">
        {isMutating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {data?.data.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                  <RiUserLine className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 transition-all duration-300">{user.firstName} {user.lastName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RiPhoneLine className="text-gray-400" size={14} />
                    <span className="transition-all duration-300">{user.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => handleViewDetails(user)}
                  title="Batafsil"
                >
                  <RiEyeLine size={18} />
                </button>
                <button 
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleEdit(user)}
                  title="Tahrirlash"
                >
                  <RiEditLine size={18} />
                </button>
                <button 
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => handleDelete(user)}
                  title="O'chirish"
                >
                  <RiDeleteBinLine size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 pl-15">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RiShieldLine className="text-gray-400" size={16} />
                <span className={`
                  inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                  ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 
                    user.role === 'STUDENT' ? 'bg-green-100 text-green-800' : 
                    'bg-purple-100 text-purple-800'}
                `}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RiTimeLine className="text-gray-400" size={16} />
                <span>{format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm')}</span>
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