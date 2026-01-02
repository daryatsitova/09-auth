import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('connect.sid');
  const accessToken = request.cookies.get('accessToken')?.value;

  const isAuthenticated = !!(sessionCookie || accessToken);

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Защита приватных маршрутов - перенаправляем неавторизованных на sign-in
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // УБИРАЕМ автоматическое перенаправление с auth страниц
  // Пусть страницы входа сами управляют навигацией
  // if (isAuthenticated && isPublicRoute) {
  //   return NextResponse.redirect(new URL('/profile', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
