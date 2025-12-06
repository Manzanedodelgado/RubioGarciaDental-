import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import prisma from './prisma'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email y contraseña requeridos')
                }

                // HARDCODED USER PARA TESTING - JMD/190582
                if ((credentials.email === 'JMD' || credentials.email === 'jmd') && credentials.password === '190582') {
                    return {
                        id: 'temp-jmd-id',
                        email: 'jmd@rubiogarciadental.com',
                        name: 'JMD',
                        role: 'ADMIN',
                    }
                }

                // Buscar por email o username en BD
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.email },
                            { name: credentials.email },
                        ]
                    },
                })

                if (!user) {
                    throw new Error('Usuario no encontrado')
                }

                if (!user.active) {
                    throw new Error('Usuario inactivo')
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error('Contraseña incorrecta')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id as string
                session.user.role = token.role as any
            }
            return session
        },
    },
}
