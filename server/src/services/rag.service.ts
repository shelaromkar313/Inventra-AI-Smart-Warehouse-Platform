import axios from 'axios';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8003';

export const queryAI = async (query: string) => {
  try {
    const response = await axios.post(`${RAG_SERVICE_URL}/query`, {
      query: query
    });
    return response.data;
  } catch (error) {
    console.error('Error calling RAG Service:', error);
    throw new Error('AI Assistant Service Unavailable');
  }
};
