import { RiUserLine, RiPhoneLine, RiShieldLine, RiTimeLine, RiGroupLine } from 'react-icons/ri';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getTeacherById, getStudentById } from '../../services/userService';
import type { User } from '../../types/user';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
}

interface StudentWithGroup extends User {
  group?: {
    id: string;
    name: string;
  };
}

export const UserDetailsModal = ({ isOpen, onClose, userId, userRole }: UserDetailsModalProps) => {
  if (!isOpen) return null;

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userRole === 'TEACHER' ? getTeacherById(userId) : getStudentById(userId),
    enabled: isOpen
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const student = userRole === 'STUDENT' ? user as StudentWithGroup : null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'TEACHER':
        return 'O\'qituvchi';
      case 'STUDENT':
        return 'O\'quvchi';
      case 'ADMIN':
        return 'Admin';
      case 'SUPER_ADMIN':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TEACHER':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'SUPER_ADMIN':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Foydalanuvchi ma'lumotlari</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* User Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
              <RiUserLine className="text-blue-600" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
              <p className="text-sm text-gray-500">{getRoleLabel(userRole)}</p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <RiPhoneLine className="text-gray-400" size={20} />
              <span>{user.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <RiShieldLine className="text-gray-400" size={20} />
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
                {getRoleLabel(userRole)}
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <RiTimeLine className="text-gray-400" size={20} />
              <span>Yaratilgan: {format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm')}</span>
            </div>

            {student?.group && (
              <div className="flex items-center gap-3 text-gray-600">
                <RiGroupLine className="text-gray-400" size={20} />
                <span>Guruh: {student.group.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}; 