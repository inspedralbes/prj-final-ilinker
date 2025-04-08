import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile", 
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id_token: account.id_token, // Envía el ID token de Google
              access_token: account.access_token, // Añadir access token por si es necesario
              email: profile.email,
              name: profile.name
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            return false;
          }

          const data = await response.json();

          // Añadir el token a la sesión
          if (data.token) {
            account.access_token = data.token;
            return true;
          }
          
          return false;
          
        } catch (error) {
          console.error("Error de red:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      // Pasar el token personalizado al cliente
      session.accessToken = token.accessToken;
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Activar debug en desarrollo
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };