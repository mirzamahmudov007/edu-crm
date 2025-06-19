import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGroups, deleteGroup, updateGroup, createGroup } from '../../services/groupService';
import { RiEditLine, RiDeleteBinLine, RiGroupLine, RiUserLine, RiAddLine, RiEyeLine, RiBookLine } from 'react-icons/ri';
import { useState } from 'react';
import { CreateGroupModal } from '../../components/Modals/CreateGroupModal';
import { EditGroupModal } from '../../components/Modals/EditGroupModal';
import { DeleteConfirmationModal } from '../../components/Modals/DeleteConfirmationModal';
import type { Group, PaginatedResponse } from '../../types/group';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { ActionButton } from '../../components/ui/ActionButton';

const Groups = () => {
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState<null | { id: string }>(null);
  const [deleteModal, setDeleteModal] = useState<null | { group: any }>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 animate-pulse">
          <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-1/2"></div>
        </div>
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-rose-500">Guruhlarni yuklashda xatolik yuz berdi</div>
      </Card>
    );
  }

<<<<<<< HEAD
  const headerStats = [
    {
      label: 'Jami guruhlar',
      value: data?.meta.total || 0,
=======
  // Ensure data exists before rendering
  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-gray-500">Ma'lumotlar yuklanmoqda...</div>
      </Card>
    );
  }

  const headerStats = [
    {
      label: 'Jami guruhlar',
      value: data.meta?.total || 0,
>>>>>>> 2067b97 (add)
      icon: <RiGroupLine size={24} />
    },
    {
      label: 'Faol guruhlar',
<<<<<<< HEAD
      value: data?.data.length || 0,
=======
      value: data.data?.length || 0,
>>>>>>> 2067b97 (add)
      icon: <RiUserLine size={24} />
    },
    {
      label: 'O\'qituvchilar',
<<<<<<< HEAD
      value: data?.data.filter(g => g.teacher).length || 0,
=======
      value: data.data?.filter((g: Group) => g.teacher).length || 0,
>>>>>>> 2067b97 (add)
      icon: <RiBookLine size={24} />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Guruhlar"
        subtitle="O'quv guruhlarini boshqaring va tashkil qiling"
        gradient="bg-gradient-to-r from-amber-500 to-orange-500"
        stats={headerStats}
        action={
          <ActionButton
            variant="secondary"
            onClick={() => setCreateModal(true)}
            icon={<RiAddLine size={20} />}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Yangi guruh
          </ActionButton>
        }
      />

      {/* Groups Table */}
      <Card className="overflow-hidden">
        {isMutating && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Barcha guruhlar</h2>
          <p className="text-sm text-gray-600 mt-1">Tizimda mavjud bo'lgan barcha o'quv guruhlari ro'yxati</p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    T/R
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Guruh nomi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    O'qituvchi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    O'quvchilar soni
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
<<<<<<< HEAD
                {data?.data.map((group: Group, index: number) => (
=======
                {data.data?.map((group: Group, index: number) => (
>>>>>>> 2067b97 (add)
                  <tr key={group.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                          <RiGroupLine className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{group.name}</div>
                          <div className="text-sm text-gray-500">ID: {group.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {group.teacher ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                            <RiBookLine className="text-blue-600" size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {group.teacher.firstName} {group.teacher.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{group.teacher.phone}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">O'qituvchi tayinlanmagan</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <RiUserLine className="text-green-600" size={16} />
                        </div>
                        <span className="font-medium text-gray-900">
                          {group.students?.length || 0} ta
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleViewDetails(group)}
                          title="Batafsil"
                        >
                          <RiEyeLine size={16} />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => handleEdit(group)}
                          title="Tahrirlash"
                        >
                          <RiEditLine size={16} />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(group)}
                          title="O'chirish"
                        >
                          <RiDeleteBinLine size={16} />
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
<<<<<<< HEAD
          {data?.data.map((group) => (
=======
          {data.data?.map((group) => (
>>>>>>> 2067b97 (add)
            <div key={group.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <RiGroupLine className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <div className="text-sm text-gray-500">
                      {group.students?.length || 0} ta o'quvchi
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleViewDetails(group)}
                  >
                    <RiEyeLine size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => handleEdit(group)}
                  >
                    <RiEditLine size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => handleDelete(group)}
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
              </div>
              {group.teacher && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pl-15">
                  <RiBookLine size={14} />
                  <span>{group.teacher.firstName} {group.teacher.lastName}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
<<<<<<< HEAD
            Jami {data?.meta.total} ta guruh
=======
            Jami {data.meta?.total || 0} ta guruh
>>>>>>> 2067b97 (add)
          </div>
          <div className="flex items-center gap-2">
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Oldingi
            </ActionButton>
            <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
<<<<<<< HEAD
              {currentPage} / {data?.meta.pageCount}
=======
              {currentPage} / {data.meta?.pageCount || 1}
>>>>>>> 2067b97 (add)
            </span>
            <ActionButton
              variant="secondary"
              size="sm"
              onClick={handleNextPage}
<<<<<<< HEAD
              disabled={!data?.meta.pageCount || currentPage >= data.meta.pageCount}
=======
              disabled={!data.meta?.pageCount || currentPage >= data.meta.pageCount}
>>>>>>> 2067b97 (add)
            >
              Keyingi
            </ActionButton>
          </div>
        </div>
      </Card>

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