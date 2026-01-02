import axios from 'axios';
import type { Note, NotePost } from '../types/note';
import type { User, LoginData, RegisterData } from '../types/user';
import type { AuthResponse } from '../types/auth';

export type NoteId = Note['id'];

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParam {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getSession = async (): Promise<{ user: User | null }> => {
  const response = await api.get<{ user: User | null }>('/auth/session');
  return response.data;
};

// User API functions
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const fetchNotes = async (
  query: string,
  page: number,
  tag?: string
): Promise<NotesHttpResponse> => {
  const params: FetchNotesParam = {
    search: query,
    page: page,
    perPage: 12,
  };

  if (tag && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }

  const response = await api.get<NotesHttpResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: NotePost): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const getTags = (): string[] => {
  return ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
};
