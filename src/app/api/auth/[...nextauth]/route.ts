import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // SOLO PERMITIR USUARIOS PRE-REGISTRADOS
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || "" }
      });

      if (!existingUser) {
        return "/acceso-denegado"; // Denegar y redirigir
      }

      // Forzar creación o actualización del Account con los nuevos tokens
      if (account) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId
            }
          },
          update: {
            access_token: account.access_token,
            refresh_token: account.refresh_token ?? undefined,
            expires_at: account.expires_at,
          },
          create: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
          }
        });
      }

      // Registrar el evento de inicio de sesión
      try {
        await prisma.loginLog.create({
          data: {
            userId: existingUser.id,
            userAgent: "Google Auth Login"
          }
        });
      } catch (err) {
        console.error("Error logging login event", err);
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Guardar el nuevo refresh/access token en la BD cuando inician sesión
      if (account) {
        await prisma.account.updateMany({
          where: { provider: "google", providerAccountId: account.providerAccountId },
          data: {
            access_token: account.access_token,
            refresh_token: account.refresh_token ?? undefined, // Si no viene, no lo borra
            expires_at: account.expires_at,
          }
        });
      }

      if (user) {
        // En este punto sabemos que existe en DB porque pasó el signIn o fue pre-registrado
        const dbUser = await prisma.user.findUnique({ where: { email: user.email || "" } });
        token.role = dbUser?.role || "DOCTOR";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/acceso-denegado"
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
