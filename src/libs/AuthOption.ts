import Credentials from "next-auth/providers/credentials";
import prismadb from '@/libs/prismadb';
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing Credentials");
                }

                const user = await prismadb.user.findFirst({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        profilePhotoUrl: true,
                        hashedPassword: true
                    }
                });

                if (!user || !user?.id || !user?.hashedPassword) {
                    throw new Error("User not registered");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);
                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    profilePhotoUrl: user.profilePhotoUrl || undefined
                };
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.role = user.role;
                token.profilePhotoUrl = user.profilePhotoUrl;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    role: token.role as string,
                    profilePhotoUrl: token.profilePhotoUrl as string | undefined
                };
            }
            return session;
        }
    },
    debug: process.env.NODE_ENV === 'development'
}
