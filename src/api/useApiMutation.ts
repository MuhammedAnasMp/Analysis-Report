// src/hooks/api/useApiMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Duck-type check for FormData
function isFormData(value: any): value is FormData {
  return value && typeof value.append === 'function' && typeof value.entries === 'function';
}

// Duck-type check for File or Blob (to avoid 'instanceof' errors)
function isFileOrBlob(value: any): value is File | Blob {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.slice === 'function'
  );
}

// Check if FormData contains any File or Blob
function formDataContainsFile(formData: FormData): boolean {
  for (const value of formData.values()) {
    if (isFileOrBlob(value)) {
      return true;
    }
  }
  return false;
}

export const useApiMutation = <T = any, V = any>(
  method: HttpMethod,
  url: string,
  invalidateQueryKey?: string[],
  params?: Record<string, any>
) => {
  const queryClient = useQueryClient();

  return useMutation<T, unknown, V>({
    mutationFn: async (body: V) => {
      if (isFormData(body)) {
        const hasFile = formDataContainsFile(body);

        if (hasFile) {
          // Send as multipart/form-data with file(s)
          const response = await apiClient.request({
            url,
            method,
            data: body,
            params,
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response.data;
        } else {
          // No files: convert FormData to plain object and send JSON
          const plainObj: Record<string, any> = {};
          for (const [key, value] of body.entries()) {
            // Since no files, safe to assign directly (or null if blob)
            plainObj[key] = isFileOrBlob(value) ? null : value;
          }
          const response = await apiClient.request({
            url,
            method,
            data: plainObj,
            params,
            // Axios defaults to application/json header automatically
          });
          return response.data;
        }
      } else {
        // Plain object or other, send normally as JSON
        const response = await apiClient.request({
          url,
          method,
          data: body,
          params,
          headers: undefined,
        });
        return response.data;
      }
    },

    onSuccess: () => {
      if (invalidateQueryKey) {
        queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }
    },
  });
};
