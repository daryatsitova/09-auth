import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid');
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isAuthenticated = !!(sessionCookie || accessToken);

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Если пользователь не авторизован и пытается получить доступ к приватному маршруту
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Если пользователь авторизован и пытается получить доступ к auth маршрутам
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Попытка продлить сессию если есть refresh token но нет access token
  if (refreshToken && !accessToken && isPrivateRoute) {
    try {
      const { checkSession } = await import('./lib/api/serverApi');
      const sessionData = await checkSession();

      if (!sessionData.user) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
