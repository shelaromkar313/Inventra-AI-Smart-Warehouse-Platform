import apiClient from './client';

export interface RAGResponse {
  query: string;
  answer: string;
  sources: string[];
  status: string;
}

export interface CVResponse {
  filename: string;
  detections: Array<{
    label: string;
    confidence: number;
    box: [number, number, number, number];
  }>;
  status: string;
  model: string;
}

export const aiService = {
  query: async (query: string) => {
    const { data } = await apiClient.post<RAGResponse>('/ai/query', { query });
    return data;
  },
  analyzeImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const { data } = await apiClient.post<CVResponse>('/ai/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
