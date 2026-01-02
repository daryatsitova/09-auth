import axios from 'axios';

export interface ApiError {
  message: string;
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };
}

export class ApiErrorClass extends Error implements ApiError {
  response?: {
    data?: {
      error?: string;
    };
    status?: number;
  };

  constructor(message: string, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}

const api = axios.create({
  baseURL: process.env.EXTERNAL_API_URL || 'https://notehub-api.goit.study',
  withCredentials: true,
});

export default api;
