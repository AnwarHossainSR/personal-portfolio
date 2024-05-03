'use client';

import axios from 'axios';

// const token = localStorage.getItem('token') ?? '';

const apiConfig = {
  baseURL: process.env.SITE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
  },
};

export const api = axios.create(apiConfig);
