import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../services/userService';
import { format } from 'date-fns';
import { RiEditLine, RiDeleteBinLine, RiUserLine, RiPhoneLine, RiShieldLine, RiTimeLine, RiAddLine } from 'react-icons/ri';
import { EditTeacherModal } from '../../components/Modals/EditTeacherModal';
import { EditStudentModal } from '../../components/Modals/EditStudentModal';
import { useState } from 'react';

const Users = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', 1],
    queryFn: () => getUsers(1, 10)
  });

  const [editModal, setEditModal] = useState<null | { type: 'TEACHER' | 'STUDENT'; user: any }>(null);

  const handleEdit = (user: any) => {
    if (user.role === 'TEACHER') {
      setEditModal({ type: 'TEACHER', user });
    } else if (user.role === 'STUDENT') {
      setEditModal({ type: 'STUDENT', user });
    }
  };

  const handleCloseModal = () => setEditModal(null);

  const handleSaveTeacher = (data: any) => {
    console.log(data);
    
    // TODO: Save teacher changes (API call)
    handleCloseModal();
  };
  const handleSaveStudent = (data: any) => {
    // TODO: Save student changes (API call)
    console.log(data);
    
    handleCloseModal();
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
        <div className="text-rose-500">Error loading users</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchilar</h1>
          <p className="text-gray-600 mt-1">Barcha foydalanuvchilar ro'yxati</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 shadow-sm">
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
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => handleEdit(user)}>
                        <RiEditLine size={18} />
                      </button>
                      <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => handleEdit(user)}>
                  <RiEditLine size={18} />
                </button>
                <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
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
    </div>
  );
};

export default Users; 