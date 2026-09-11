import { auth } from '@/auth'

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const pathname = req.nextUrl.pathname

  if (!isAuthenticated && pathname !== '/login') {
    return Response.redirect(new URL('/login', req.url))
  }

  if (isAuthenticated && pathname === '/login') {
    return Response.redirect(new URL('/', req.url))
  }
})

// Run on all pages; API routes protect themselves via auth()
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
