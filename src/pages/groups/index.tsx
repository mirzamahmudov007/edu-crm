import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroups, deleteGroup, updateGroup, createGroup } from '../../services/groupService';
import { RiEditLine, RiDeleteBinLine, RiGroupLine, RiUserLine, RiAddLine } from 'react-icons/ri';
import { useState } from 'react';
import { CreateGroupModal } from '../../components/Modals/CreateGroupModal';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';

const Groups = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<null | { group: any }>(null);
  const [deleteModal, setDeleteModal] = useState<null | { group: any }>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['groups', 1],
    queryFn: () => getGroups(1, 10)
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
    setEditModal({ group });
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
    if (editModal) {
      updateGroupMutation.mutate({ id: editModal.group.id, data });
    } else {
      createGroupMutation.mutate(data);
    }
    handleCloseModal();
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    deleteGroupMutation.mutate(deleteModal.group.id);
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
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
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

      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Guruh nomi</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">O'qituvchi</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 bg-gray-50/50">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((group) => (
                <tr key={group.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                        <RiGroupLine className="text-blue-600" size={20} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{group.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {group.teacher ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <RiUserLine className="text-green-600" size={16} />
                        </div>
                        <span className="text-sm text-gray-900">
                          {group.teacher.firstName} {group.teacher.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">O'qituvchi tayinlanmagan</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <div className="md:hidden divide-y divide-gray-100">
        {data?.data.map((group) => (
          <div key={group.id} className="p-4 hover:bg-gray-50/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                  <RiGroupLine className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  {group.teacher ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <RiUserLine className="text-gray-400" size={14} />
                      <span>{group.teacher.firstName} {group.teacher.lastName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">O'qituvchi tayinlanmagan</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
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
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Oldingi
          </button>
          <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
            {data?.meta.page} / {data?.meta.pageCount}
          </span>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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
        <CreateGroupModal
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleSaveGroup}
          group={editModal.group}
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