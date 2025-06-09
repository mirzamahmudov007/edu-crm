import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeachers } from '../services/teacherService';

interface TeacherSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TeacherSelect: React.FC<TeacherSelectProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => getTeachers(1, 100)
  });

  const selectedTeacher = teachers?.data.find(t => t.id.toString() === value);

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

  const filteredTeachers = teachers?.data.filter(teacher => 
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="O'qituvchini qidirish..."
        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
      />
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="p-2 text-sm text-gray-500">Yuklanmoqda...</div>
          ) : filteredTeachers?.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">O'qituvchi topilmadi</div>
          ) : (
            filteredTeachers?.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => {
                  onChange(teacher.id.toString());
                  setSearch('');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  value === teacher.id.toString() ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {teacher.firstName} {teacher.lastName}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherSelect; 