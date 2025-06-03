import { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { getGroups } from '../../services/groupService';
import { getStudentById, getTeacherById } from '../../services/userService';
import { PhoneInput } from '../PhoneInput';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  role: 'STUDENT' | 'TEACHER';
  onSave: (data: { phone: string; firstName: string; lastName: string; password: string; groupId?: string }) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  role,
  onSave,
}) => {
  const { data: user, isLoading } = useQuery({
    queryKey: [role.toLowerCase(), userId],
    queryFn: () => role === 'STUDENT' ? getStudentById(userId) : getTeacherById(userId),
    enabled: !!userId && isOpen,
  });

  const [formData, setFormData] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    groupId: '',
  });

  const [errors, setErrors] = useState({
    phone: '',
    firstName: '',
    lastName: '',
    password: '',
    groupId: ''
  });

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(1, 100)
  });

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        groupId: user.groupId || '',
        password: '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {
      phone: '',
      firstName: '',
      lastName: '',
      password: '',
      groupId: ''
    };

    if (!formData.phone) {
      newErrors.phone = 'Telefon raqam kiritilishi shart';
    } else if (!formData.phone.startsWith('+998')) {
      newErrors.phone = 'Telefon raqam +998 bilan boshlanishi kerak';
    } else if (formData.phone.length !== 13) {
      newErrors.phone = 'Telefon raqam noto\'g\'ri formatda';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ism kiritilishi shart';
    } else if (/\d/.test(formData.firstName)) {
      newErrors.firstName = 'Ismda raqam bo\'lishi mumkin emas';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Familiya kiritilishi shart';
    } else if (/\d/.test(formData.lastName)) {
      newErrors.lastName = 'Familiyada raqam bo\'lishi mumkin emas';
    }

    if (role === 'STUDENT' && !formData.groupId) {
      newErrors.groupId = 'Guruh tanlanishi shart';
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
          <h2 className="text-xl font-bold text-gray-900">
            {role === 'STUDENT' ? 'O\'quvchini tahrirlash' : 'O\'qituvchini tahrirlash'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {isLoading || !user ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500">Ma'lumotlar yuklanmoqda...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Ism
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[0-9]/g, '');
                    setFormData(prev => ({ ...prev, firstName: value }));
                    if (errors.firstName) {
                      setErrors(prev => ({ ...prev, firstName: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border ${errors.firstName ? 'border-rose-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Ismni kiriting"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-rose-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Familiya
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[0-9]/g, '');
                    setFormData(prev => ({ ...prev, lastName: value }));
                    if (errors.lastName) {
                      setErrors(prev => ({ ...prev, lastName: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border ${errors.lastName ? 'border-rose-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Familiyani kiriting"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-rose-500">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => {
                    const formattedValue = value.startsWith('+') ? value : `+${value}`;
                    setFormData(prev => ({ ...prev, phone: formattedValue }));
                    if (errors.phone) {
                      setErrors(prev => ({ ...prev, phone: '' }));
                    }
                  }}
                  error={errors.phone}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Yangi parol (ixtiyoriy)
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border ${errors.password ? 'border-rose-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Parolni o'zgartirmaslik uchun bo'sh qoldiring"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-rose-500">{errors.password}</p>
                )}
              </div>

              {role === 'STUDENT' && (
                <div>
                  <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
                    Guruh
                  </label>
                  <select
                    id="groupId"
                    value={formData.groupId}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, groupId: e.target.value }));
                      if (errors.groupId) {
                        setErrors(prev => ({ ...prev, groupId: '' }));
                      }
                    }}
                    className={`w-full px-4 py-2 border ${errors.groupId ? 'border-rose-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    required
                  >
                    <option value="">Guruhni tanlang</option>
                    {groups?.data.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {errors.groupId && (
                    <p className="mt-1 text-sm text-rose-500">{errors.groupId}</p>
                  )}
                </div>
              )}
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