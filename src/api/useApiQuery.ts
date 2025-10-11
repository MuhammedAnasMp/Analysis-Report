// src/hooks/api/useApiQuery.ts
import { useQuery, type QueryKey } from '@tanstack/react-query';
import apiClient from './apiClient';

type Params = Record<string, any>;

export const useApiQuery = <T = any>(
  queryKey: QueryKey,
  url: string,
  params?: Params,
  enabled: boolean = true
) => {
  return useQuery<T>({
    queryKey: [...queryKey, params], // include params in cache key
    queryFn: async () => {
      const { data } = await apiClient.get(url, { params });
      return data;
    },
    enabled,
  });
};
