import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { RiUserLine, RiPhoneLine, RiShieldLine, RiTimeLine, RiGroupLine, RiArrowLeftLine } from 'react-icons/ri';
import { format } from 'date-fns';
import { getTeacherById, getStudentById } from '../../services/userService';
import type { User } from '../../types/user';

interface StudentWithGroup extends User {
  group?: {
    id: string;
    name: string;
  };
}

const UserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => role === 'TEACHER' ? getTeacherById(id as string) : getStudentById(id as string),
    enabled: !!id && !!role
  });

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

  if (!user) return null;

  const student = role === 'STUDENT' ? user as StudentWithGroup : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RiArrowLeftLine size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Foydalanuvchi ma'lumotlari</h1>
            <p className="text-gray-600 mt-1">Batafsil ma'lumotlar</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* User Avatar and Name */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
            <RiUserLine className="text-blue-600" size={40} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-500">{getRoleLabel(role as string)}</p>
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
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(role as string)}`}>
              {getRoleLabel(role as string)}
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
    </div>
  );
};

export default UserDetails; 