import axios from 'axios';

// Для соответствия требованиям ментора используем process.env.NEXT_PUBLIC_API_URL с добавлением /api
const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
