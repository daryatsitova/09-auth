import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let response = NextResponse.next();

  // Логика поновления сесії - выполняется ДО проверки аутентификации
  // Если есть refreshToken но нет accessToken, пытаемся обновить сесію
  if (refreshToken && !accessToken) {
    try {
      const sessionResponse = await fetch(
        new URL('/api/auth/session', request.url),
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        }
      );

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        // Если получили новые токены, обновляем их в response
        if (sessionData.accessToken) {
          accessToken = sessionData.accessToken;
          response.cookies.set('accessToken', sessionData.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
        if (sessionData.refreshToken) {
          response.cookies.set('refreshToken', sessionData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
      }
    } catch (error) {
      // В случае ошибки продолжаем без токенов
      console.error('Session refresh error:', error);
    }
  }

  // Проверяем аутентификацию только по accessToken и refreshToken
  const isAuthenticated = !!(accessToken || refreshToken);

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Если пользователь не аутентифицирован и пытается попасть на приватный маршрут
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Если пользователь аутентифицирован и пытается попасть на маршрут аутентификации
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/notes', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
