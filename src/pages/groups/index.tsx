import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroups, deleteGroup, updateGroup, createGroup } from '../../services/groupService';
import { RiEditLine, RiDeleteBinLine, RiGroupLine, RiUserLine, RiAddLine, RiEyeLine } from 'react-icons/ri';
import { useState } from 'react';
import { CreateGroupModal } from '../../components/Modals/CreateGroupModal';
import { EditGroupModal } from '../../components/Modals/EditGroupModal';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';
import type { Group, PaginatedResponse } from '../../types/group';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<null | { id: string }>(null);
  const [deleteModal, setDeleteModal] = useState<null | { group: any }>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFilters, _] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, error, isFetching } = useQuery<PaginatedResponse<Group>>({
    queryKey: ['groups', currentPage],
    queryFn: () => getGroups(currentPage, 10)
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setDeleteModal(null);
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setCreateModal(false);
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; teacherId: string } }) => 
      updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setEditModal(null);
    },
  });

  const handleEdit = (group: any) => {
    setEditModal({ id: group.id });
  };

  const handleDelete = (group: any) => {
    setDeleteModal({ group });
  };

  const handleCloseModal = () => {
    setCreateModal(false);
    setEditModal(null);
    setDeleteModal(null);
  };

  const handleSaveGroup = (data: { name: string; teacherId: string }) => {
    setIsUpdating(true);
    handleCloseModal();
    if (editModal) {
      updateGroupMutation.mutate({ id: editModal.id, data }, {
        onSettled: () => setIsUpdating(false)
      });
    } else {
      createGroupMutation.mutate(data, {
        onSettled: () => setIsUpdating(false)
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    handleCloseModal();
    setIsUpdating(true);
    deleteGroupMutation.mutate(deleteModal.group.id, {
      onSettled: () => setIsUpdating(false)
    });
  };

  const isMutating =
    createGroupMutation.isPending ||
    updateGroupMutation.isPending ||
    deleteGroupMutation.isPending ||
    isUpdating ||
    isFetching;

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.meta.pageCount && currentPage < data.meta.pageCount) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleViewDetails = (group: Group) => {
    navigate(`/groups/${group.id}`);
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

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-rose-500">Error loading groups</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guruhlar</h1>
            <p className="text-gray-600 mt-1">Barcha guruhlar ro'yxati</p>
          </div>
          <button 
            onClick={() => setCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-xl hover:from-blue-600 hover:to-violet-600 transition-all duration-300 shadow-sm"
          >
            <RiAddLine size={20} />
            <span>Yangi guruh</span>
          </button>
        </div>

        {/* Search and Filter */}
        {/* <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Guruh nomi bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 flex items-center gap-2 whitespace-nowrap shadow-sm ${
              showFilters 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <RiFilterLine size={18} />
            <span>Filter</span>
          </button>
        </div> */}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">O'qituvchi</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="">Barcha o'qituvchilar</option>
                  <option value="1">O'qituvchi 1</option>
                  <option value="2">O'qituvchi 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holati</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="">Barcha holatlar</option>
                  <option value="active">Faol</option>
                  <option value="inactive">Nofaol</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tartib</label>
                <select className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm appearance-none">
                  <option value="name_asc">Nomi (A-Z)</option>
                  <option value="name_desc">Nomi (Z-A)</option>
                  <option value="date_asc">Sana (Eskidan yangi)</option>
                  <option value="date_desc">Sana (Yangi dan eski)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block relative">
        {isMutating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  T/R
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guruh nomi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'qituvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((group: Group, index: number) => (
                <tr key={group.id} className="group hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                        <RiGroupLine className="text-blue-600" size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 transition-all duration-300">{group.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {group.teacher ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <RiUserLine className="text-green-600" size={16} />
                        </div>
                        <span className="text-sm text-gray-900 transition-all duration-300">
                          {group.teacher.firstName} {group.teacher.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 transition-all duration-300">O'qituvchi tayinlanmagan</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleViewDetails(group)}
                      >
                        <RiEyeLine size={18} />
                      </button>
                      <button 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEdit(group)}
                      >
                        <RiEditLine size={18} />
                      </button>
                      <button 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        onClick={() => handleDelete(group)}
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-100 relative">
        {isMutating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {data?.data.map((group) => (
          <div key={group.id} className="p-4 hover:bg-gray-50/50 transition-all duration-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                  <RiGroupLine className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 transition-all duration-300">{group.name}</h3>
                  {group.teacher ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RiUserLine className="text-gray-400" size={14} />
                      <span className="transition-all duration-300">{group.teacher.firstName} {group.teacher.lastName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 transition-all duration-300">O'qituvchi tayinlanmagan</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleViewDetails(group)}
                >
                  <RiEyeLine size={18} />
                </button>
                <button 
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleEdit(group)}
                >
                  <RiEditLine size={18} />
                </button>
                <button 
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  onClick={() => handleDelete(group)}
                >
                  <RiDeleteBinLine size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Jami {data?.meta.total} ta guruh
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors ${
              currentPage === 1 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            Oldingi
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
            {currentPage} / {data?.meta.pageCount}
          </span>
          <button 
            onClick={handleNextPage}
            disabled={!data?.meta.pageCount || currentPage >= data.meta.pageCount}
            className={`px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors ${
              !data?.meta.pageCount || currentPage >= data.meta.pageCount
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            Keyingi
          </button>
        </div>
      </div>

      {createModal && (
        <CreateGroupModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleSaveGroup}
        />
      )}

      {editModal && (
        <EditGroupModal
          isOpen={true}
          onClose={handleCloseModal}
          groupId={editModal.id}
          onSave={handleSaveGroup}
        />
      )}

      {deleteModal && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          title="Guruhni o'chirish"
          description={`${deleteModal.group.name} guruhini o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        />
      )}
    </div>
  );
};

export default Groups; 