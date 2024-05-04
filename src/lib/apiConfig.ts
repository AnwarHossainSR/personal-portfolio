'use client';

import axios from 'axios';

const apiConfig = {
  baseURL: process.env.SITE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const api = axios.create(apiConfig);
