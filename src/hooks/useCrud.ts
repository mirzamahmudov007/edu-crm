import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchList,
  fetchOne,
  createItem,
  updateItem,
  deleteItem,
} from "../services/crudService";

type Entity = "users" | "teacher" | "student" | "quiz";

// GET LIST
export const useEntityList = (
  entity: Entity,
  params?: Record<string, any>,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [entity, params],
    queryFn: () => fetchList(entity, params),
    enabled,
  });
};

// GET ONE
export const useEntityDetail = (
  entity: Entity,
  id: number | string,
  enabled = true
) => {
  return useQuery({
    queryKey: [entity, id],
    queryFn: () => fetchOne(entity, id),
    enabled: !!id && enabled,
  });
};

// CREATE
export const useCreateEntity = (entity: Entity) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createItem(entity, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entity] });
    },
  });
};

// UPDATE
export const useUpdateEntity = (entity: Entity, id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateItem(entity, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entity] });
      queryClient.invalidateQueries({ queryKey: [entity, id] });
    },
  });
};

// DELETE
export const useDeleteEntity = (entity: Entity, id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteItem(entity, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entity] });
    },
  });
};
