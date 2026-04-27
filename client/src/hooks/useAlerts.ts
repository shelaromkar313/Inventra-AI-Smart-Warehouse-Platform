import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '../services/api/alerts.service';

export const useAlerts = () => {
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsService.getAlerts,
    refetchInterval: 30000, // Refresh alerts every 30 seconds
  });

  const readMutation = useMutation({
    mutationFn: alertsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    alerts: alertsQuery.data ?? [],
    isLoading: alertsQuery.isLoading,
    error: alertsQuery.error,
    markAsRead: readMutation.mutate,
    isMarking: readMutation.isPending,
  };
};
