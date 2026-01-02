import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '../../types/note';
import type { User } from '../../types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';
const ALL_TAGS = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

async function getHeadersWithCookies() {
  const cookieStore = await cookies();
  return {
    'Content-Type': 'application/json',
    Cookie: cookieStore.toString(),
  };
}

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

  const headers = await getHeadersWithCookies();
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  const response = await axios.get<NotesHttpResponse>(
    `${baseURL}/notes?${queryString}`,
    { headers }
  );
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getHeadersWithCookies();
  const response = await axios.get<Note>(`${baseURL}/notes/${id}`, { headers });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getHeadersWithCookies();
  const response = await axios.get<User>(`${baseURL}/users/me`, { headers });
  return response.data;
};

export const checkSession = async () => {
  try {
    const headers = await getHeadersWithCookies();
    const response = await axios.get(`${baseURL}/auth/session`, { headers });
    return response;
  } catch (error) {
    throw error;
  }
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
