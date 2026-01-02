import { api } from './api';
import type { Note } from '../../types/note';
import type { User, LoginData, RegisterData } from '../../types/user';

const ALL_TAGS = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParam {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
}

interface NotePost {
  title: string;
  content: string;
  tag?: string;
}

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

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<{ user: User | null }> => {
  const response = await api.get<{ user: User | null }>('/auth/session');
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const getTags = async (): Promise<string[]> => {
  try {
    const { notes } = await fetchNotes('', 1);
    const noteTags = notes.map(note => note.tag).filter(Boolean);
    const uniqueTags = [...new Set(noteTags)];
    return [...ALL_TAGS, ...uniqueTags].filter(
      (tag, index, array) => array.indexOf(tag) === index
    );
  } catch {
    return ALL_TAGS;
  }
};
