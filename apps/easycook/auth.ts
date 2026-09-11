import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, token }) {
      session.user.id = token.sub!
      return session
    },
  },
})
