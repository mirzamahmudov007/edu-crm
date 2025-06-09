import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGroups } from '../services/groupService';

interface GroupSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const GroupSelect: React.FC<GroupSelectProps> = ({ value, onChange, error }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(1, 100)
  });

  const selectedGroup = groups?.data.find(g => g.id.toString() === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when value changes
  useEffect(() => {
    if (value) {
      setSearch('');
    }
  }, [value]);

  const filteredGroups = groups?.data.filter(group => 
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={selectedGroup ? selectedGroup.name : search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
          if (value) {
            onChange(''); // Clear selection when searching
          }
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Guruhni qidirish..."
        className={`w-full px-4 py-2 rounded-xl border ${
          error ? 'border-rose-500' : 'border-gray-200'
        } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
      />
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Yuklanmoqda...</div>
          ) : filteredGroups?.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">Guruh topilmadi</div>
          ) : (
            filteredGroups?.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => {
                  onChange(group.id.toString());
                  setSearch('');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  value === group.id.toString() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {group.name}
              </button>
            ))
          )}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default GroupSelect; 