import { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { getTeachers } from '../../services/userService';
import { getGroupById } from '../../services/groupService';
import type { User } from '../../types/user';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSave: (data: { name: string; teacherId: string }) => void;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen,
  onClose,
  groupId,
  onSave,
}) => {
  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroupById(groupId),
    enabled: !!groupId && isOpen,
  });

  const [formData, setFormData] = useState({
    name: '',
    teacherId: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    teacherId: ''
  });

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => getTeachers()
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        teacherId: group.teacherId
      });
    }
  }, [group]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      teacherId: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Guruh nomi kiritilishi shart';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Guruh nomi kamida 3 ta harfdan iborat bo\'lishi kerak';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'O\'qituvchi tanlanishi shart';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Guruhni tahrirlash</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {isLoading || !group ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500">Ma'lumotlar yuklanmoqda...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Guruh nomi
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (errors.name) {
                      setErrors(prev => ({ ...prev, name: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-rose-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Guruh nomini kiriting"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-rose-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
                  O'qituvchi
                </label>
                <select
                  id="teacherId"
                  value={formData.teacherId}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, teacherId: e.target.value }));
                    if (errors.teacherId) {
                      setErrors(prev => ({ ...prev, teacherId: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border ${errors.teacherId ? 'border-rose-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  <option value="">O'qituvchini tanlang</option>
                  {teachers?.data.map((teacher: User) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <p className="mt-1 text-sm text-rose-500">{errors.teacherId}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300"
              >
                Saqlash
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 