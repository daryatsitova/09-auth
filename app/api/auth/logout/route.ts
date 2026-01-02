import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '../../api';
import { isAxiosError } from 'axios';

const API_BASE_URL =
  process.env.EXTERNAL_API_URL || 'https://notehub-api.goit.study';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
      }
    );

    const nextResponse = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Удаляем accessToken и refreshToken cookies
    nextResponse.cookies.delete('accessToken');
    nextResponse.cookies.delete('refreshToken');
    nextResponse.cookies.delete('connect.sid');

    return nextResponse;
  } catch (error: any) {
    console.error('Logout error:', error);

    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: 'Logout failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
