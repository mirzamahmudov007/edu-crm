import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { RiGroupLine, RiUserLine, RiTimeLine, RiArrowLeftLine, RiBookLine } from 'react-icons/ri';
import { format } from 'date-fns';
import { getGroupById } from '../../services/groupService';

const GroupDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroupById(id as string),
    enabled: !!id
  });

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

  if (!group) return null;

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
            <h1 className="text-2xl font-bold text-gray-900">Guruh ma'lumotlari</h1>
            <p className="text-gray-600 mt-1">Batafsil ma'lumotlar</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Group Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
            <RiGroupLine className="text-blue-600" size={40} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
            <p className="text-sm text-gray-500">{group.description}</p>
          </div>
        </div>

        {/* Group Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <RiUserLine className="text-gray-400" size={20} />
            <span>O'quvchilar soni: {group.students?.length || 0}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <RiBookLine className="text-gray-400" size={20} />
            <span>Testlar soni: {group.tests?.length || 0}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <RiTimeLine className="text-gray-400" size={20} />
            <span>Yaratilgan: {group.createdAt ? format(new Date(group.createdAt), 'dd.MM.yyyy HH:mm') : 'Sana mavjud emas'}</span>
          </div>
        </div>

        {/* Students List */}
        {group.students && group.students.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">O'quvchilar ro'yxati</h4>
            <div className="space-y-3">
              {group.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                    <RiUserLine className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                    <p className="text-sm text-gray-500">{student.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests List */}
        {group.tests && group.tests.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Testlar ro'yxati</h4>
            <div className="space-y-3">
              {group.tests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                    <RiBookLine className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{test.title}</p>
                    <p className="text-sm text-gray-500">{test.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails; 