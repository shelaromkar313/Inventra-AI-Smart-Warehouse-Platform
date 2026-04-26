import axios from 'axios';
import FormData from 'form-data';

const CV_SERVICE_URL = process.env.CV_SERVICE_URL || 'http://localhost:8002';

export const analyzeImage = async (imageBuffer: Buffer, filename: string) => {
  try {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename });

    const response = await axios.post(`${CV_SERVICE_URL}/analyze`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error calling CV Service:', error);
    throw new Error('CV Service Unavailable');
  }
};
