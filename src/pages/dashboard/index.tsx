import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../../services/dashboardService';
import { getUsers } from '../../services/userService';
import { getGroups } from '../../services/groupService';
<<<<<<< HEAD
import { RiUserLine, RiGroupLine, RiGraduationCapLine, RiBookLine, RiPhoneLine, RiTimeLine, RiTrendingUpLine, RiCalendarLine } from 'react-icons/ri';
=======
import { RiUserLine, RiGroupLine, RiGraduationCapLine, RiBookLine, RiPhoneLine, RiTimeLine, RiArrowUpLine, RiCalendarLine } from 'react-icons/ri';
>>>>>>> 2067b97 (add)
import { format, isValid } from 'date-fns';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';

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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <Card className="p-6">
        <div className="text-rose-500">Dashboard ma'lumotlarini yuklashda xatolik yuz berdi</div>
      </Card>
    );
  }

  const headerStats = [
    {
      label: 'Jami foydalanuvchilar',
      value: stats?.totalUsers || 0,
      icon: <RiUserLine size={24} />
    },
    {
      label: 'Faol guruhlar',
      value: stats?.totalGroups || 0,
      icon: <RiGroupLine size={24} />
    },
    {
      label: 'Bu oyda qo\'shilgan',
      value: '+12',
<<<<<<< HEAD
      icon: <RiTrendingUpLine size={24} />
=======
      icon: <RiArrowUpLine size={24} />
>>>>>>> 2067b97 (add)
    }
  ];

  const statsData = [
    {
      title: 'Jami foydalanuvchilar',
      value: stats?.totalUsers || 0,
      icon: <RiUserLine size={24} className="text-blue-600" />,
      gradient: 'bg-gradient-to-r from-blue-500 to-violet-500',
      iconBg: 'bg-blue-100',
      change: { value: '+8.2%', type: 'increase' as const }
    },
    {
      title: 'O\'quvchilar',
      value: stats?.totalStudents || 0,
      icon: <RiGraduationCapLine size={24} className="text-green-600" />,
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
      iconBg: 'bg-green-100',
      change: { value: '+12.5%', type: 'increase' as const }
    },
    {
      title: 'O\'qituvchilar',
      value: stats?.totalTeachers || 0,
      icon: <RiBookLine size={24} className="text-amber-600" />,
      gradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
      iconBg: 'bg-amber-100',
      change: { value: '+3.1%', type: 'increase' as const }
    },
    {
      title: 'Guruhlar',
      value: stats?.totalGroups || 0,
      icon: <RiGroupLine size={24} className="text-rose-600" />,
      gradient: 'bg-gradient-to-r from-rose-500 to-pink-500',
      iconBg: 'bg-rose-100',
      change: { value: '+5.7%', type: 'increase' as const }
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd.MM.yyyy') : 'Noma\'lum';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="iTech ta'lim tizimi boshqaruv paneli"
        gradient="bg-gradient-to-r from-blue-500 to-violet-500"
        stats={headerStats}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">So'nggi o'quvchilar</h2>
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <RiGraduationCapLine className="text-green-600" size={20} />
            </div>
          </div>
          <div className="space-y-4">
            {recentUsers?.data.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <RiGraduationCapLine className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RiPhoneLine size={14} />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <RiCalendarLine size={14} />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Groups */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">So'nggi guruhlar</h2>
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <RiGroupLine className="text-rose-600" size={20} />
            </div>
          </div>
          <div className="space-y-4">
            {recentGroups?.data.map((group) => (
              <div key={group.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                  <RiGroupLine className="text-rose-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{group.name}</h3>
                  {group.teacher && (
                    <div className="text-sm text-gray-500">
                      {group.teacher.firstName} {group.teacher.lastName}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <RiTimeLine size={14} />
                    <span>{formatDate(group.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tezkor amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-violet-50 rounded-xl border border-blue-100 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <RiUserLine className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Yangi foydalanuvchi</h3>
            <p className="text-sm text-gray-600">O'quvchi yoki o'qituvchi qo'shish</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3">
              <RiGroupLine className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Yangi guruh</h3>
            <p className="text-sm text-gray-600">Yangi o'quv guruhini yaratish</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <RiBookLine className="text-amber-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Yangi test</h3>
            <p className="text-sm text-gray-600">Test yaratish va yuklash</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;