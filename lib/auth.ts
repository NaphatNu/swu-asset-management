import type { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

type AzureProfileLike = {
  name?: string | null;
  email?: string | null;
  preferred_username?: string | null;
  oid?: string | null;
  roles?: string[] | null;
  picture?: string | null;
};

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? '',
      tenantId: process.env.AZURE_AD_TENANT_ID ?? '',
      authorization: {
        params: {
          prompt: 'select_account',
          scope: 'openid profile email',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, profile }) {
      // On first sign-in, map Azure profile fields into the JWT.
      // (profile is only reliably present at sign-in time)
      if (profile) {
        const p = profile as AzureProfileLike;

        token.name = token.name ?? p.name ?? undefined;
        token.email =
          token.email ??
          (p.preferred_username ?? p.email ?? undefined) ??
          undefined;

        token.oid = token.oid ?? p.oid ?? undefined;
        token.roles = token.roles ?? p.roles ?? undefined;
        token.picture = token.picture ?? p.picture ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name ?? null;
        session.user.email = token.email ?? session.user.email ?? null;
        session.user.image =
          token.picture ?? session.user.image ?? token.image ?? null;
      }
      session.oid = token.oid;
      session.roles = token.roles;
      return session;
    },
  },
};

