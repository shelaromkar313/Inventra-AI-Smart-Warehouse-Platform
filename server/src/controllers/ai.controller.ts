import { Request, Response } from 'express';
import * as ragService from '../services/rag.service';
import * as cvService from '../services/cv.service';

export const processQuery = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const result = await ragService.queryAI(query);
    res.json(result);
  } catch (error: any) {
    console.error('Error in RAG processQuery:', error);
    res.status(500).json({ error: error.message || 'RAG Service Unavailable' });
  }
};

export const analyzeImage = async (req: Request, res: Response) => {
  // This expects an image buffer. In a real scenario, you'd use middleware like 'multer' 
  // to handle the file upload. For this example, we mock the buffer or assume it's sent.
  
  // Note: For a real implementation, add multer to your index.ts routes.
  res.status(501).json({ message: 'Image analysis route initialized. Needs Multer middleware for file handling.' });
};
