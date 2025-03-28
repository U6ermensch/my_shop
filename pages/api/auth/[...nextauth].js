import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (
          credentials.username === ADMIN_CREDENTIALS.username &&
          credentials.password === ADMIN_CREDENTIALS.password
        ) {
          return {
            id: 1,
            name: 'Admin',
            role: 'admin'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
};

export default NextAuth(authOptions); 