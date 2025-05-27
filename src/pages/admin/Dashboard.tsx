import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statsConfig = [
  { key: 'users', label: 'Foydalanuvchilar', color: 'from-blue-500 to-blue-400', icon: '👤' },
  { key: 'teachers', label: 'O‘qituvchilar', color: 'from-green-500 to-green-400', icon: '🧑‍🏫' },
  { key: 'students', label: 'O‘quvchilar', color: 'from-purple-500 to-purple-400', icon: '🎓' },
  { key: 'groups', label: 'Guruhlar', color: 'from-yellow-500 to-yellow-400', icon: '👥' },
  { key: 'tests', label: 'Testlar', color: 'from-pink-500 to-pink-400', icon: '📝' },
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('https://api.lms.itechacademy.uz/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => setError('Statistikani yuklab bo‘lmadi'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center text-red-600 font-semibold py-8">
        {error || 'Statistikani yuklab bo‘lmadi'}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statsConfig.map((item) => (
          <div
            key={item.key}
            className={`rounded-xl shadow-lg bg-gradient-to-br ${item.color} text-white flex flex-col items-center justify-center p-6 transition-transform hover:scale-105`}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="text-lg font-semibold">{item.label}</div>
            <div className="text-3xl font-bold mt-1">{stats[item.key]}</div>
          </div>
        ))}
      </div>

 
    </div>
  );
};

export default Dashboard;