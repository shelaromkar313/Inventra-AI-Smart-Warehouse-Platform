import apiClient from './client';

export interface Alert {
  id: number;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  item_id?: number;
  is_read: boolean;
  created_at: string;
}

export const alertsService = {
  getAlerts: async () => {
    const { data } = await apiClient.get<Alert[]>('/alerts');
    return data;
  },
  markAsRead: async (id: number) => {
    const { data } = await apiClient.put(`/alerts/${id}/read`);
    return data;
  },
};
