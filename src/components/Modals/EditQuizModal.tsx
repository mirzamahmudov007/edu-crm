import React, { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';
import { getQuizById } from '../../services/quizService';
import TeacherSelect from '../TeacherSelect';
import GroupSelect from '../GroupSelect';
import type { Quiz } from '../../types/quiz';

interface EditQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  onSave: (data: {
    title: string;
    questionCount: number;
    file: string;
    startDate: string;
    duration: number;
    teacherId: string;
    groupId: string;
  }) => void;
}

export const EditQuizModal: React.FC<EditQuizModalProps> = ({
  isOpen,
  onClose,
  quizId,
  onSave,
}) => {
  const { data: quiz, isLoading } = useQuery<Quiz>({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById(quizId),
    enabled: isOpen && quizId !== '',
    staleTime: 0,
    gcTime: 0,
  });

  const [formData, setFormData] = useState({
    title: '',
    questionCount: 10,
    file: '',
    startDate: '',
    duration: 120,
    teacherId: '',
    groupId: '',
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    questionCount: '',
    file: '',
    startDate: '',
    duration: '',
    teacherId: '',
    groupId: '',
  });

  useEffect(() => {
    if (quiz) {
      // Format the date to YYYY-MM-DDTHH:mm format for datetime-local input
      const startDate = new Date(quiz.startDate);
      const formattedDate = startDate.toISOString().slice(0, 16);

      setFormData({
        title: quiz.title,
        questionCount: quiz.questionCount,
        file: quiz.file,
        startDate: formattedDate,
        duration: quiz.duration,
        teacherId: quiz.teacherId,
        groupId: quiz.groupId,
      });
    }
  }, [quiz]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      title: '',
      questionCount: '',
      file: '',
      startDate: '',
      duration: '',
      teacherId: '',
      groupId: '',
    };

    if (!formData.title.trim()) {
      errors.title = 'Test nomi kiritilishi shart';
    }

    if (!formData.file) {
      errors.file = 'Test fayli yuklanishi shart';
    }

    if (!formData.startDate) {
      errors.startDate = 'Boshlash vaqti tanlanishi shart';
    }

    if (!formData.duration || formData.duration < 1) {
      errors.duration = 'Davomiyligi noto\'g\'ri';
    }

    if (!formData.teacherId) {
      errors.teacherId = 'O\'qituvchi tanlanishi shart';
    }

    if (!formData.groupId) {
      errors.groupId = 'Guruh tanlanishi shart';
    }

    setFormErrors(errors);

    if (!Object.values(errors).some(error => error !== '')) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Testni tahrirlash</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>
        {isLoading || !quiz ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500">Ma'lumotlar yuklanmoqda...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test nomi
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  if (formErrors.title) {
                    setFormErrors(prev => ({ ...prev, title: '' }));
                  }
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  formErrors.title ? 'border-rose-500' : 'border-gray-200'
                } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
                required
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-rose-500">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Savollar soni
              </label>
              <input
                type="number"
                value={formData.questionCount}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }));
                  if (formErrors.questionCount) {
                    setFormErrors(prev => ({ ...prev, questionCount: '' }));
                  }
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  formErrors.questionCount ? 'border-rose-500' : 'border-gray-200'
                } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
                required
                min="1"
              />
              {formErrors.questionCount && (
                <p className="mt-1 text-sm text-rose-500">{formErrors.questionCount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Boshlash vaqti
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, startDate: e.target.value }));
                  if (formErrors.startDate) {
                    setFormErrors(prev => ({ ...prev, startDate: '' }));
                  }
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  formErrors.startDate ? 'border-rose-500' : 'border-gray-200'
                } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
                required
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-rose-500">{formErrors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Davomiyligi (daqiqa)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }));
                  if (formErrors.duration) {
                    setFormErrors(prev => ({ ...prev, duration: '' }));
                  }
                }}
                className={`w-full px-4 py-2 rounded-xl border ${
                  formErrors.duration ? 'border-rose-500' : 'border-gray-200'
                } focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
                required
                min="1"
              />
              {formErrors.duration && (
                <p className="mt-1 text-sm text-rose-500">{formErrors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guruh
              </label>
              <GroupSelect
                value={formData.groupId}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, groupId: value }));
                  if (formErrors.groupId) {
                    setFormErrors(prev => ({ ...prev, groupId: '' }));
                  }
                }}
                error={formErrors.groupId}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                O'qituvchi
              </label>
              <TeacherSelect
                value={formData.teacherId}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, teacherId: value }));
                  if (formErrors.teacherId) {
                    setFormErrors(prev => ({ ...prev, teacherId: '' }));
                  }
                }}
                error={formErrors.teacherId}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Saqlash
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}; 