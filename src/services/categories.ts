/* eslint-disable no-useless-catch */
import axios from 'axios';

import { API_ENDPOINTS } from '@/config/api-endpoints';

export const getCategories = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.CATEGORIES.GET_CATEGORIES);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (data: unknown) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.CATEGORIES.GET_CATEGORIES,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id: string, data: unknown) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.CATEGORIES.GET_CATEGORIES}/${id}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCAtegoryDetails = async (slug: string) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CATEGORIES.GET_CATEGORIES}/${slug}`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.CATEGORIES.GET_CATEGORIES}/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
