import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '../../api';
import { isAxiosError } from 'axios';

function logErrorResponse(error: any, endpoint: string) {
  console.error(`Error at ${endpoint}:`, error);
  if (isAxiosError(error) && error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const { id } = await params;

    const response = await api.get(`/notes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    logErrorResponse(error, `/notes/${(await params).id} GET`);

    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: 'Failed to fetch note' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const { id } = await params;

    const response = await api.delete(`/notes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const { id } = await params;
    logErrorResponse(error, `/notes/${id} DELETE`);

    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: 'Failed to delete note' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const { id } = await params;

    const response = await api.patch(`/notes/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    const { id } = await params;
    logErrorResponse(error, `/notes/${id} PATCH`);

    if (isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: 'Failed to update note' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
