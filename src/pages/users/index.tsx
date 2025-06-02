import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteTeacher, deleteStudent, updateTeacher, updateStudent, createTeacher, createStudent } from '../../services/userService';
import { format } from 'date-fns';
import { RiEditLine, RiDeleteBinLine, RiUserLine, RiPhoneLine, RiShieldLine, RiTimeLine, RiAddLine } from 'react-icons/ri';
import { EditTeacherModal } from '../../components/Modals/EditTeacherModal';
import { EditStudentModal } from '../../components/Modals/EditStudentModal';
import { CreateUserModal } from '../../components/Modals/CreateUserModal';
import { useState } from 'react';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';

// Types
interface EditModalState {
  type: 'TEACHER' | 'STUDENT';
  user: any;
}

// Constants
const PAGE_SIZE = 10;

const Users = () => {
  // State
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<EditModalState | null>(null);
  const [deleteModal, setDeleteModal] = useState<EditModalState | null>(null);
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', 1],
    queryFn: () => getUsers(1, PAGE_SIZE)
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
      setEditModal({ type: 'TEACHER', user });
    } else if (user.role === 'STUDENT') {
      setEditModal({ type: 'STUDENT', user });
    }
  };

  const handleDelete = (user: any) => {
    if (user.role === 'TEACHER') {
      setDeleteModal({ type: 'TEACHER', user });
    } else if (user.role === 'STUDENT') {
      setDeleteModal({ type: 'STUDENT', user });
    }
  };

  const handleSaveTeacher = (data: any) => {
    if (!editModal) return;
    
    const teacherData = {
      ...data,
      id: editModal.user.id
    };
    
    updateTeacher(teacherData.id, teacherData).then(() => {
      invalidateQueries();
      handleCloseModal();
    });
  };

  const handleSaveStudent = (data: any) => {
    if (!editModal) return;
    
    const studentData = {
      ...data,
      id: editModal.user.id
    };
    
    updateStudent(studentData.id, studentData).then(() => {
      invalidateQueries();
      handleCloseModal();
    });
  };

  const handleCreateUser = (data: any) => {
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

    if (deleteModal.type === 'TEACHER') {
      deleteTeacherMutation.mutate(deleteModal.user.id);
    } else if (deleteModal.type === 'STUDENT') {
      deleteStudentMutation.mutate(deleteModal.user.id);
    }
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
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
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

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Ism</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Familiya</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Telefon</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Yaratilgan</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                        <RiUserLine className="text-blue-600" size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.firstName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{user.lastName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <RiPhoneLine className="text-gray-400" size={16} />
                      <span>{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
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
                      <span>{format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(user)}
                      >
                        <RiEditLine size={18} />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(user)}
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
      <div className="md:hidden divide-y divide-gray-100">
        {data?.data.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                  <RiUserLine className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RiPhoneLine className="text-gray-400" size={14} />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleEdit(user)}
                >
                  <RiEditLine size={18} />
                </button>
                <button 
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => handleDelete(user)}
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
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Oldingi
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
            {data?.meta.page} / {data?.meta.pageCount}
          </span>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
          teacher={editModal.user}
          onSave={handleSaveTeacher}
        />
      )}

      {editModal?.type === 'STUDENT' && (
        <EditStudentModal
          isOpen={true}
          onClose={handleCloseModal}
          student={editModal.user}
          onSave={handleSaveStudent}
        />
      )}

      {deleteModal && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title={`${deleteModal.type === 'TEACHER' ? 'O\'qituvchi' : 'O\'quvchi'}ni o'chirish`}
          description={`${deleteModal.user.firstName} ${deleteModal.user.lastName}ni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        />
      )}
    </div>
  );
};

export default Users; 