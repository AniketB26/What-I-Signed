import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alerts';
import toast from 'react-hot-toast';

export function useAlerts(filters = {}) {
  return useQuery({
    queryKey: ['alerts', filters],
    queryFn: () => alertService.getAlerts(filters),
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => alertService.dismissAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert dismissed');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to dismiss alert');
    },
  });
}

export function useSnoozeAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, days }) => alertService.snoozeAlert(id, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert snoozed');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to snooze alert');
    },
  });
}
