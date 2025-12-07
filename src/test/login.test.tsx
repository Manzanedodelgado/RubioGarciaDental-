import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Login from '../app/login/page'

// Mock useRouter
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn()
    }),
    useSearchParams: () => ({
        get: vi.fn()
    })
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
    signIn: vi.fn(),
    useSession: () => ({
        data: null,
        status: 'unauthenticated'
    })
}))

describe('Login Page', () => {
    it('renders login form', () => {
        render(<Login />)
        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Introduce tu usuario o email')).toBeInTheDocument()
    })
})
