/* eslint-disable no-unused-vars */
import type {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useFetch = (
  key: QueryKey,
  queryFn: () => Promise<any>,
  options?: Omit<UseQueryOptions<any>, 'queryFn'>
) => {
  return useQuery({
    queryKey: key,
    queryFn,
    ...options,
  });
};

export const usePost = (
  createFn: (data: any) => Promise<any>,
  options?: Omit<UseMutationOptions<any>, 'mutationFn'>
) => {
  const mutation = useMutation({
    mutationFn: createFn,
    ...options,
  });
  const post = async (data: any) => {
    await mutation.mutateAsync(data);
  };
  return { ...mutation, post };
};

export const usePut = (
  updateFn: (data: any) => Promise<any>,
  options?: Omit<UseMutationOptions<any>, 'mutationFn'>
) => {
  const mutation = useMutation({
    mutationFn: updateFn,
    ...options,
  });
  const put = async (data: any) => {
    await mutation.mutateAsync(data);
  };
  return { ...mutation, put };
};

export const usePatch = (
  patchFn: (data: any) => Promise<any>,
  options?: Omit<UseMutationOptions<any>, 'mutationFn'>
) => {
  const mutation = useMutation({
    mutationFn: patchFn,
    ...options,
  });
  const patch = async (data: any) => {
    await mutation.mutateAsync(data);
  };
  return { ...mutation, patch };
};

export const useDelete = (
  deleteFn: (data: any) => Promise<any>,
  options?: Omit<UseMutationOptions<any>, 'mutationFn'>
) => {
  const mutation = useMutation({
    mutationFn: deleteFn,
    ...options,
  });
  const remove = async (data: any) => {
    await mutation.mutateAsync(data);
  };
  return { ...mutation, remove };
};
