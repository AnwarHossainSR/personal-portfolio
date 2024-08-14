/* eslint-disable no-useless-catch */
import axios from 'axios';

import { API_ENDPOINTS } from '@/config/api-endpoints';

export const createPost = async (data: unknown) => {
  try {
    const response = await axios.post(API_ENDPOINTS.POSTS.GET_POSTS, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getPosts = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.POSTS.GET_POSTS);
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogDetails = async (slug: string) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.POSTS.GET_POSTS}/${slug}`
    );
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const submitComment = async (data: unknown) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.COMMENTS.GET_COMMENTS,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.POSTS.GET_POSTS}/${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
