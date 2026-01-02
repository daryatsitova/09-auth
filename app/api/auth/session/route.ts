import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '../../api';
import setCookieParser from 'set-cookie-parser';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Проверяем наличие токенов в cookies
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const response = await api.get('/auth/session', {
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });

    const data = response.data;
    const nextResponse = NextResponse.json(data);

    // Если в ответе есть новые токены, устанавливаем их
    const setCookieHeaders = response.headers['set-cookie'];
    if (setCookieHeaders) {
      const parsedCookies = setCookieParser(setCookieHeaders);

      for (const cookie of parsedCookies) {
        if (cookie.name === 'accessToken' || cookie.name === 'refreshToken') {
          console.log(`Updating ${cookie.name} token`);
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
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Session check error:', error);

    if (error.response?.status === 401) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function POST() {
  return NextResponse.json({ message: 'Session endpoint' });
}
