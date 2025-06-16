import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: adminEmail,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      session.user.role = "admin";
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
