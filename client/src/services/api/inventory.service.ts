import apiClient from './client';

export interface InventoryItem {
  id: number;
  name: string;
  description?: string;
  sku: string;
  quantity: number;
  location?: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ForecastResponse {
  item_name: string;
  current_quantity: number;
  item_id: number;
  forecasted_demand: number;
  confidence_score: number;
  model_used: string;
}

export const inventoryService = {
  getAll: async () => {
    const { data } = await apiClient.get<InventoryItem[]>('/inventory');
    return data;
  },
  create: async (item: Partial<InventoryItem>) => {
    const { data } = await apiClient.post<InventoryItem>('/inventory', item);
    return data;
  },
  getForecast: async (id: number) => {
    const { data } = await apiClient.get<ForecastResponse>(`/inventory/${id}/forecast`);
    return data;
  },
};
