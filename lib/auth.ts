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
          scope: 'openid profile email offline_access api://' + process.env.AZURE_AD_CLIENT_ID + '/access_as_user',
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
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const p = profile as AzureProfileLike;
        token.accessToken = account.access_token; // เก็บไว้ส่งให้ API Header
        token.refreshToken = account.refresh_token; // เก็บไว้ใช้ตอน Refresh
        token.oid = p.oid ?? undefined;
        token.roles = p.roles ?? [];
        token.picture = p.picture ?? undefined;
        token.expiresAt = account.expires_at; 
      }

      if (Date.now() < (token.expiresAt as number) * 1000 - 30000) {
        console.log("Access token is still valid");
        return token;
      }
      console.log("Access token has expired, refreshing...");

      try {
        const response = await fetch("https://login.microsoftonline.com/" + process.env.AZURE_AD_TENANT_ID + "/oauth2/v2.0/token", {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.AZURE_AD_CLIENT_ID!,
            client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string,
            scope: 'openid profile email offline_access api://' + process.env.AZURE_AD_CLIENT_ID + '/access_as_user',
          }),
          method: "POST",
        });

        const refreshedTokens = await response.json();

        if (!response.ok) throw refreshedTokens;

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
          // Azure AD อาจจะไม่ส่ง refresh_token ใหม่กลับมา ให้ใช้อันเดิมถ้าไม่มีใหม่
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        // ส่ง Error กลับไปเพื่อให้ Middleware หรือ Client รู้ว่า Refresh ไม่ผ่าน
        return { ...token, error: "RefreshAccessTokenError" };
      }
  },
  async session({ session, token }) {
    // ข้อมูลสำหรับใช้ใน Frontend
    session.user = {
      ...session.user,
      name: token.name,
      email: token.email,
      image: token.picture as string, // แสดงผลใน FE
    };
    session.oid = token.oid;
    session.accessToken = token.accessToken; // สำหรับ Axios Interceptor
    session.error = token.error;
    return session;
  },
},
};

