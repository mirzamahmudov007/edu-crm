import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../services/dashboardService';
import { getUsers } from '../../services/userService';
import { getGroups } from '../../services/groupService';
import { RiUserLine, RiGroupLine, RiGraduationCapLine, RiBookLine, RiPhoneLine, RiTimeLine } from 'react-icons/ri';
import { format, isValid } from 'date-fns';

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats
  });

  const { data: recentUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['recent-users'],
    queryFn: () => getUsers(1, 5)
  });

  const { data: recentGroups, isLoading: groupsLoading } = useQuery({
    queryKey: ['recent-groups'],
    queryFn: () => getGroups(1, 5)
  });

  if (statsLoading || usersLoading || groupsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-rose-500">Error loading dashboard statistics</div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Jami foydalanuvchilar',
      value: stats?.totalUsers || 0,
      icon: RiUserLine,
      color: 'from-blue-500 to-violet-500',
      bgColor: 'from-blue-100 to-violet-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'O\'quvchilar',
      value: stats?.totalStudents || 0,
      icon: RiGraduationCapLine,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-100 to-emerald-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'O\'qituvchilar',
      value: stats?.totalTeachers || 0,
      icon: RiBookLine,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-100 to-orange-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Guruhlar',
      value: stats?.totalGroups || 0,
      icon: RiGroupLine,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'from-rose-100 to-pink-100',
      iconColor: 'text-rose-600'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd.MM.yyyy') : 'Noma\'lum';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`${stat.iconColor}`} size={24} />
              </div>
            </div>
            <div className={`h-1 w-full bg-gradient-to-r ${stat.color} rounded-full mt-4`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900">So'nggi o'quvchilar</h2>
          <div className="mt-4 space-y-4">
            {recentUsers?.data.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <RiGraduationCapLine className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RiPhoneLine className="text-gray-400" size={14} />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <RiTimeLine className="text-gray-400" size={14} />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900">So'nggi guruhlar</h2>
          <div className="mt-4 space-y-4">
            {recentGroups?.data.map((group) => (
              <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                    <RiGroupLine className="text-rose-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    {group.teacher && (
                      <div className="text-sm text-gray-500">
                        {group.teacher.firstName} {group.teacher.lastName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <RiTimeLine className="text-gray-400" size={14} />
                    <span>{formatDate(group.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;