import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = 'https://notehub-api.goit.study';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    const setCookieHeaders = response.headers.getSetCookie();
    
    const nextResponse = NextResponse.json(data);

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      const cookieStore = await cookies();
      
      setCookieHeaders.forEach(cookieString => {
        const [nameValue, ...attributes] = cookieString.split(';');
        const [name, value] = nameValue.split('=');
        
        cookieStore.set(name.trim(), value?.trim() || '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      });
    }

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
