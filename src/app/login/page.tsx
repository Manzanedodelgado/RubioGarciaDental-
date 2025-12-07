'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Usuario o contraseña incorrectos')
            } else {
                router.push('/dashboard')
            }
        } catch (err) {
            setError('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1D1160 0%, #3340D3 50%, #00C6CC 100%)',
            position: 'relative',
            padding: '20px',
            boxSizing: 'border-box'
        }}>

            {/* Decorative circles */}
            <div style={{
                content: '""',
                position: 'absolute',
                width: '500px',
                height: '500px',
                background: 'rgba(207, 242, 20, 0.1)',
                borderRadius: '50%',
                top: '-250px',
                right: '-250px'
            }} />

            <div style={{
                content: '""',
                position: 'absolute',
                width: '400px',
                height: '400px',
                background: 'rgba(0, 198, 204, 0.1)',
                borderRadius: '50%',
                bottom: '-200px',
                left: '-200px'
            }} />

            {/* Login Box */}
            <div style={{
                background: '#ffffff',
                padding: '48px 40px',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                width: '90%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1
            }}>

                {/* Logo */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginBottom: '32px'
                }}>
                    <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px'
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C9 2 6 4 6 8C6 12 9 14 12 14C15 14 18 12 18 8C18 4 15 2 12 2Z" fill="#3340D3" />
                                <path d="M12 14C8 14 4 16 4 20V22H20V20C20 16 16 14 12 14Z" fill="#00C6CC" />
                            </svg>
                        </div>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            margin: 0,
                            lineHeight: 1.2
                        }}>
                            <span style={{ color: '#3340D3' }}>RUBIO GARCÍA</span>
                            <span style={{ color: '#CFF214' }}>DENTAL</span>
                        </h1>
                        <p style={{
                            fontSize: '13px',
                            color: '#8492a6',
                            fontWeight: '500',
                            margin: '6px 0 0 0'
                        }}>
                            Implantología y estética de vanguardia
                        </p>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#8492a6',
                        fontWeight: '500',
                        margin: 0
                    }}>
                        Sistema de Gestión Integral
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: '#fee',
                        color: '#c33',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        borderLeft: '4px solid #c33'
                    }}>
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="email" style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1D1160',
                            marginBottom: '8px'
                        }}>
                            Usuario o Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Introduce tu usuario o email"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: '2px solid #e8ecf1',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#1D1160',
                                background: '#f5f7fa',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#00C6CC'
                                e.target.style.background = '#ffffff'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e8ecf1'
                                e.target.style.background = '#f5f7fa'
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="password" style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1D1160',
                            marginBottom: '8px'
                        }}>
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                            required
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: '2px solid #e8ecf1',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#1D1160',
                                background: '#f5f7fa',
                                transition: 'all 0.3s',
                                fontFamily: 'inherit',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#00C6CC'
                                e.target.style.background = '#ffffff'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e8ecf1'
                                e.target.style.background = '#f5f7fa'
                            }}
                        />
                    </div>

                    {/* Remember & Forgot Password */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ display: 'none' }}
                                id="remember-checkbox"
                            />
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #e8ecf1',
                                borderRadius: '6px',
                                background: rememberMe ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : '#f5f7fa',
                                borderColor: rememberMe ? '#00C6CC' : '#e8ecf1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                position: 'relative'
                            }}>
                                {rememberMe && (
                                    <div style={{
                                        width: '5px',
                                        height: '10px',
                                        border: 'solid #ffffff',
                                        borderWidth: '0 2px 2px 0',
                                        transform: 'rotate(45deg)',
                                        marginBottom: '2px'
                                    }} />
                                )}
                            </div>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#1D1160'
                            }}>
                                Recordar usuario
                            </span>
                        </label>
                        <a href="#" onClick={(e) => e.preventDefault()} style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#00C6CC',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                        }}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '15px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginTop: '8px',
                            opacity: loading ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(51,64,211,0.4)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#8492a6'
                }}>
                    <p style={{ margin: 0 }}>
                        Usuarios de prueba: contraseña <span style={{ fontFamily: 'monospace', color: '#00C6CC', fontWeight: '600' }}>190582</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
