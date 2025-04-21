import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login", // Ruta personalizada de login
  },
  callbacks: {
    async jwt({ token, user }) {
      // Guardamos el ID del usuario en el token (si inicia por primera vez)
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      // Transferimos el ID al objeto de sesión (para el frontend)
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    
  },
  secret: process.env.NEXTAUTH_SECRET,
};
