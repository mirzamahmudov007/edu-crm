import React, { useState } from 'react';
import { RiCloseLine, RiUploadCloudLine, RiArrowRightLine } from 'react-icons/ri';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile, createQuiz } from '../../services/quizService';
import TeacherSelect from '../TeacherSelect';
import GroupSelect from '../GroupSelect';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    questionCount: 10,
    file: '',
    startDate: '',
    duration: 120,
    teacherId: '',
    groupId: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    title: '',
    questionCount: '',
    file: '',
    startDate: '',
    duration: '',
    teacherId: '',
    groupId: '',
  });
  const [activeTab, setActiveTab] = useState<'file' | 'details'>('file');
  const queryClient = useQueryClient();

 
  const uploadMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, file: data.fileUrl }));
      setUploadError('');
      setFormErrors(prev => ({ ...prev, file: '' }));
      setActiveTab('details');
    },
    onError: () => {
      setUploadError('Fayl yuklashda xatolik yuz berdi');
      setFormErrors(prev => ({ ...prev, file: 'Fayl yuklashda xatolik yuz berdi' }));
    }
  });

  const createQuizMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      onSave();
      onClose();
    },
    onError: () => {
      setFormErrors(prev => ({
        ...prev,
        title: 'Test yaratishda xatolik yuz berdi'
      }));
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setUploadError('Faqat .docx formatidagi fayllar qabul qilinadi');
        setFormErrors(prev => ({ ...prev, file: 'Faqat .docx formatidagi fayllar qabul qilinadi' }));
        return;
      }
      setSelectedFile(file);
      uploadMutation.mutate(file);
    }
  };

  const validateForm = () => {
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
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createQuizMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Yangi test</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'file'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              1. Test fayli
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              2. Test ma'lumotlari
            </button>
          </div>

          {activeTab === 'file' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test fayli
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl">
                  <div className="space-y-1 text-center">
                    <RiUploadCloudLine className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Fayl yuklash</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".docx"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">yoki tortib tashlang</p>
                    </div>
                    <p className="text-xs text-gray-500">DOCX formatidagi fayllar</p>
                  </div>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-500">
                    Tanlangan fayl: {selectedFile.name}
                  </p>
                )}
                {(uploadError || formErrors.file) && (
                  <p className="mt-2 text-sm text-rose-500">{uploadError || formErrors.file}</p>
                )}
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
                  type="button"
                  onClick={() => setActiveTab('details')}
                  disabled={!formData.file}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Keyingi
                  <RiArrowRightLine size={18} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onClick={() => setActiveTab('file')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Orqaga
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending || createQuizMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadMutation.isPending || createQuizMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 