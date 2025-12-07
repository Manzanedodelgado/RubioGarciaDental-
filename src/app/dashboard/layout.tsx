'use client'

import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import VoiceControl from '@/components/VoiceControl'
import { useSSE } from '@/lib/useSSE'

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Agenda', href: '/dashboard/agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Pacientes', href: '/dashboard/pacientes', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 1 0 0z' },
    { name: 'Mensajería', href: '/dashboard/mensajeria', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
    { name: 'Gestión', href: '/dashboard/gestion', icon: 'M3 3h18v18H3zM3 9h18M9 21V9' },
    { name: 'IA', href: '/dashboard/ia', icon: 'M12 2v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M2 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2' },
    { name: 'Configuración', href: '/dashboard/config', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const { lastMessage } = useSSE()
    const [toast, setToast] = useState<{ message: string, type: string } | null>(null)

    useEffect(() => {
        if (lastMessage && lastMessage.type !== 'CONNECTED') {
            setToast({
                message: lastMessage.payload?.message || 'Nueva notificación',
                type: lastMessage.type
            })
            // Play sound
            const audio = new Audio('/notification.mp3') // Assuming file exists or fails silently
            audio.play().catch(() => { })

            setTimeout(() => setToast(null), 5000)
        }
    }, [lastMessage])

    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', border: '4px solid #00C6CC', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: '#8492a6' }}>Cargando...</p>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return null
    }

    return (
        <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '85px 1fr', gridTemplateRows: 'auto 1fr' }}>
            {/* Sidebar */}
            <aside style={{
                gridRow: '1/3',
                background: 'linear-gradient(180deg, #1D1160 0%, #2a1a7a 100%)',
                padding: '24px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '6px 0 24px rgba(29, 17, 96, 0.2)',
                position: 'relative',
                borderRadius: '0 24px 24px 0'
            }}>
                {/* Logo */}
                <div style={{
                    textAlign: 'center',
                    padding: '0 0 20px 0',
                    marginBottom: '20px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: '#f5f7fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #00C6CC',
                        overflow: 'hidden',
                        padding: '4px'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C9 2 6 4 6 8C6 12 9 14 12 14C15 14 18 12 18 8C18 4 15 2 12 2Z" fill="#3340D3" />
                            <path d="M12 14C8 14 4 16 4 20V22H20V20C20 16 16 14 12 14Z" fill="#00C6CC" />
                        </svg>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', padding: '0 12px', flex: 1 }}>
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '14px',
                                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: isActive ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : 'transparent',
                                    boxShadow: isActive ? '0 4px 16px rgba(51, 64, 211, 0.4)' : 'none',
                                    textDecoration: 'none',
                                    position: 'relative'
                                }}
                                title={item.name}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(0, 198, 204, 0.15)'
                                        e.currentTarget.style.color = '#00C6CC'
                                        e.currentTarget.style.transform = 'translateX(3px)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent'
                                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
                                        e.currentTarget.style.transform = 'translateX(0)'
                                    }
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={item.icon} />
                                </svg>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Card */}
                <div
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    style={{
                        marginTop: 'auto',
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #00C6CC',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.08)'
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 198, 204, 0.4)'
                        e.currentTarget.style.borderColor = '#CFF214'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#00C6CC'
                    }}
                    title="Cerrar sesión"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D1160" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </aside>

            {/* Top Bar */}
            <header style={{
                gridColumn: '2/3',
                background: '#ffffff',
                padding: '12px 36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e8ecf1',
                boxShadow: '0 1px 4px rgba(29, 17, 96, 0.06)',
                minHeight: '60px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: '#8492a6', fontWeight: '500', margin: 0 }}>
                            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Search */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        background: '#f5f7fa',
                        borderRadius: '8px',
                        width: '280px',
                        border: '1px solid #e8ecf1'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8492a6" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                        <input
                            type="search"
                            placeholder="Buscar..."
                            style={{
                                border: 'none',
                                background: 'none',
                                outline: 'none',
                                fontSize: '13px',
                                width: '100%',
                                color: '#1D1160',
                                fontWeight: '500'
                            }}
                        />
                    </div>

                    {/* Notifications */}
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#f5f7fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        border: '1px solid #e8ecf1'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8492a6" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#CFF214',
                            border: '2px solid #ffffff',
                            boxShadow: '0 0 8px rgba(207, 242, 20, 0.6)'
                        }} />
                    </div>

                    {/* Options */}
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#f5f7fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '1px solid #e8ecf1'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8492a6" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                gridColumn: '2/3',
                padding: '32px',
                overflowY: 'auto',
                background: '#f5f7fa'
            }}>
                {children}
            </main>

            <VoiceControl />

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    background: '#ffffff',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    borderLeft: '4px solid #00C6CC',
                    zIndex: 10000,
                    animation: 'slideInRight 0.3s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ fontSize: '20px' }}>🔔</div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160' }}>{toast.type}</div>
                        <div style={{ fontSize: '13px', color: '#8492a6' }}>{toast.message}</div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}
