import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '../../api';
import setCookieParser from 'set-cookie-parser';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await api.post('/auth/register', body, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    const data = response.data;
    const nextResponse = NextResponse.json(data);

    const setCookieHeaders = response.headers['set-cookie'];
    
    if (setCookieHeaders) {
      const parsedCookies = setCookieParser(setCookieHeaders);
      
      for (const cookie of parsedCookies) {
        nextResponse.cookies.set(cookie.name, cookie.value, {
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite as any,
          path: cookie.path,
          maxAge: cookie.maxAge,
          expires: cookie.expires,
        });
      }
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.response) {
      return NextResponse.json(
        error.response.data || { message: 'Registration failed' },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
