import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '../../api';
import { isAxiosError } from 'axios';

export const dynamic = 'force-dynamic';

function logErrorResponse(error: any, endpoint: string) {
  console.error(`Error at ${endpoint}:`, error);
  if (isAxiosError(error) && error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await api.get('/users/me', {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    logErrorResponse(error, '/users/me GET');

    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: 'Failed to fetch user data' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await api.patch('/users/me', body, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    logErrorResponse(error, '/users/me PATCH');

    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: 'Failed to update user data' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
