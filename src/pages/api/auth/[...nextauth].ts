import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const admins = [
  {
    id: "1",
    name: "Admin User",
    email: "process.env.ADMIN_EMAIL!",
    password: "process.env.ADMIN_PASSWORD!", // In prod, hash & env vars recommended
  },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = admins.find(
          (admin) =>
            admin.email === credentials?.email && admin.password === credentials?.password
        );
        if (user) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add role or admin flag to session
      session.user.role = "admin";
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
