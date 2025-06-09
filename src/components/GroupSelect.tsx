import React, { useState, useEffect } from 'react';
import { getGroups } from '../services/groupService';

interface Group {
  id: number;
  name: string;
}

interface GroupSelectProps {
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
}

const GroupSelect: React.FC<GroupSelectProps> = ({ value, onChange, error }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response :any = await getGroups();
        setGroups(response);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <label htmlFor="group" className="block text-sm font-medium text-gray-700">
        Guruh
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Guruhni qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none mb-2"
        />
        <select
          id="group"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full px-4 py-2 rounded-xl border ${
            error ? 'border-rose-500' : 'border-gray-200'
          } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
        >
          <option value="">Guruhni tanlang</option>
          {loading ? (
            <option disabled>Yuklanmoqda...</option>
          ) : (
            filteredGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))
          )}
        </select>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default GroupSelect; 