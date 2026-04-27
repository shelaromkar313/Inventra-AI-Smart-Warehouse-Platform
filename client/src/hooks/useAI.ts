import { useMutation } from '@tanstack/react-query';
import { aiService } from '../services/api/ai.service';

export const useAI = () => {
  const queryMutation = useMutation({
    mutationFn: aiService.query,
  });

  const cvMutation = useMutation({
    mutationFn: aiService.analyzeImage,
  });

  return {
    askAI: queryMutation.mutate,
    queryResponse: queryMutation.data,
    isAsking: queryMutation.isPending,
    
    analyzeImage: cvMutation.mutate,
    cvResponse: cvMutation.data,
    isAnalyzing: cvMutation.isPending,
  };
};
