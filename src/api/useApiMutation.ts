// src/hooks/api/useApiMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

type HttpMethod = 'POST' | 'PUT' | 'DELETE';

export const useApiMutation = <T = any, V = any>(
  method: HttpMethod,
  url: string,
  invalidateQueryKey?: string[],
  params?: Record<string, any> 
) => {
  const queryClient = useQueryClient();

  return useMutation<T, unknown, V>({
    mutationFn: async (body: V) => {
      const response = await apiClient.request({
        url,
        method,
        data: body,
        params, // query string
      });
      return response.data;
    },
    onSuccess: () => {
      if (invalidateQueryKey) {
        queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }
    },
    
  });
};