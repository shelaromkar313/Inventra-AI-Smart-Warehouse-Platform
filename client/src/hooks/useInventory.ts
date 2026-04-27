import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../services/api/inventory.service';

export const useInventory = () => {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  return {
    items: inventoryQuery.data ?? [],
    isLoading: inventoryQuery.isLoading,
    error: inventoryQuery.error,
    createItem: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};

export const useItemForecast = (id?: number) => {
  return useQuery({
    queryKey: ['forecast', id],
    queryFn: () => inventoryService.getForecast(id!),
    enabled: !!id,
  });
};
