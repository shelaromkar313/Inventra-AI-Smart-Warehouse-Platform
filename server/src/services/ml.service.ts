import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

export const getForecast = async (itemId: number, history: number[]) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/forecast`, {
      item_id: itemId,
      history: history
    });
    return response.data;
  } catch (error) {
    console.error('Error calling ML Service:', error);
    throw new Error('ML Service Unavailable');
  }
};
