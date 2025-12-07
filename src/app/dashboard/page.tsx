'use client'

import { useState } from 'react'
import { useStats } from '@/lib/hooks'

export default function DashboardPage() {
    const [widgetsEnabled, setWidgetsEnabled] = useState({
        agenda: true,
        whatsapp: true,
        automations: false,
        ai: true
    })

    const { stats, isLoading, isError } = useStats()

    const toggleWidget = (widget: keyof typeof widgetsEnabled) => {
        setWidgetsEnabled(prev => ({ ...prev, [widget]: !prev[widget] }))
    }

    if (isError) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#ff6b6b', marginBottom: '16px' }}>Error al cargar datos del dashboard</h2>
            </div>
        )
    }

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ marginBottom: '12px' }}>
                    <svg width="76" height="76" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C9 2 6 4 6 8C6 12 9 14 12 14C15 14 18 12 18 8C18 4 15 2 12 2Z" fill="#3340D3" />
                        <path d="M12 14C8 14 4 16 4 20V22H20V20C20 16 16 14 12 14Z" fill="#00C6CC" />
                    </svg>
                </div>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#8492a6', marginBottom: 0 }}>
                    Panel de Control
                </h1>
            </div>

            {/* Stats Horizontal - Widgets Toggleables */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '28px'
            }}>
                {[
                    { key: 'agenda', label: 'Agenda', desc: 'Sincronización automática de citas' },
                    { key: 'whatsapp', label: 'WhatsApp', desc: 'Mensajería automática' },
                    { key: 'automations', label: 'Automatizaciones', desc: 'Flujos de trabajo automáticos' },
                    { key: 'ai', label: 'Agente AI', desc: 'Respuestas inteligentes 24/7' }
                ].map((widget) => {
                    const key = widget.key as keyof typeof widgetsEnabled
                    const isActive = widgetsEnabled[key]

                    return (
                        <div
                            key={widget.key}
                            onClick={() => toggleWidget(key)}
                            style={{
                                background: '#ffffff',
                                padding: '18px 20px',
                                borderRadius: '12px',
                                border: '1px solid #e8ecf1',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(29, 17, 96, 0.06)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 198, 204, 0.15)'
                                e.currentTarget.style.borderColor = '#00C6CC'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(29, 17, 96, 0.06)'
                                e.currentTarget.style.borderColor = '#e8ecf1'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isActive ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : 'linear-gradient(135deg, #1D1160 0%, #3340D3 100%)',
                                        flexShrink: 0,
                                        transition: 'all 0.3s',
                                        boxShadow: isActive ? '0 4px 12px rgba(51, 64, 211, 0.4)' : 'none'
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"></svg>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#1D1160', fontWeight: '700', lineHeight: 1 }}>
                                        {widget.label}
                                    </div>
                                </div>
                                <div style={{
                                    width: '48px',
                                    height: '26px',
                                    background: isActive ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : '#e8ecf1',
                                    borderRadius: '13px',
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    flexShrink: 0
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: '#ffffff',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '3px',
                                        left: isActive ? '25px' : '3px',
                                        transition: 'all 0.3s',
                                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                                    }} />
                                </div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#8492a6', lineHeight: 1.4, marginTop: '4px' }}>
                                {widget.desc}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Dashboard Grid: Agenda de Hoy + Mensajes Urgentes */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Agenda de Hoy - Panel */}
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1', boxShadow: '0 1px 3px rgba(29, 17, 96, 0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', margin: 0 }}>
                            Agenda de Hoy
                        </h3>
                        <span style={{ fontSize: '12px', color: '#00C6CC', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#3340D3'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#00C6CC'}>
                            Ver Todo
                        </span>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#8492a6' }}>
                            Cargando citas...
                        </div>
                    ) : stats?.todayAppointments && stats.todayAppointments.length > 0 ? (
                        <>
                            {stats.todayAppointments.map((apt: any) => (
                                <div key={apt.id} style={{
                                    display: 'grid',
                                    gridTemplateColumns: '80px 1fr',
                                    gap: '18px',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f0f2f5'
                                }}>
                                    {/* Timeline Time */}
                                    <div style={{ textAlign: 'right', paddingRight: '18px', borderRight: '2px solid #00C6CC' }}>
                                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#1D1160', marginBottom: '3px' }}>
                                            {new Date(apt.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#8492a6', fontWeight: '600' }}>
                                            45 min
                                        </div>
                                    </div>
                                    {/* Timeline Content */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160', marginBottom: '5px', margin: 0 }}>
                                                {apt.patient.firstName} {apt.patient.lastName}
                                            </h4>
                                            <p style={{ fontSize: '12px', color: '#8492a6', fontWeight: '500', margin: 0 }}>
                                                {apt.doctor.name} • {apt.treatment}
                                            </p>
                                        </div>
                                        <div style={{
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '10px',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            background: apt.status === 'CONFIRMED' ? 'linear-gradient(135deg, #00C6CC 0%, #00E5CC 100%)' : '#CFF214',
                                            color: apt.status === 'CONFIRMED' ? '#ffffff' : '#1D1160'
                                        }}>
                                            {apt.status === 'CONFIRMED' ? 'Confirmada' : 'Pendiente'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#8492a6', fontSize: '14px', margin: 0 }}>
                            No hay citas programadas para hoy
                        </p>
                    )}
                </div>

                {/* Mensajes Urgentes - Panel */}
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1', boxShadow: '0 1px 3px rgba(29, 17, 96, 0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', margin: 0 }}>
                            Mensajes Urgentes
                        </h3>
                        <span style={{ fontSize: '12px', color: '#00C6CC', fontWeight: '600', cursor: 'pointer' }}>
                            Ver Todo
                        </span>
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#8492a6' }}>
                            Cargando mensajes...
                        </div>
                    ) : stats?.urgentMessages && stats.urgentMessages.length > 0 ? (
                        <>
                            {stats.urgentMessages.map((msg: any) => {
                                const patientName = msg.patient ? `${msg.patient.firstName} ${msg.patient.lastName}` : 'Desconocido'
                                const initials = msg.patient ? `${msg.patient.firstName[0]}${msg.patient.lastName[0]}` : '?'
                                const timeAgo = new Date(msg.sentAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

                                return (
                                    <div key={msg.id} style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '14px',
                                        borderBottom: '1px solid #f0f2f5',
                                        background: '#ffffff',
                                        borderRadius: '8px',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        borderLeft: '3px solid transparent'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#f9fafb'
                                            e.currentTarget.style.borderLeftColor = '#00C6CC'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#ffffff'
                                            e.currentTarget.style.borderLeftColor = 'transparent'
                                        }}>
                                        {/* Message Avatar */}
                                        <div style={{
                                            width: '44px',
                                            height: ' 44px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #1D1160 0%, #3340D3 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: '700',
                                            fontSize: '14px',
                                            flexShrink: 0
                                        }}>
                                            {initials}
                                        </div>
                                        {/* Message Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                                <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#1D1160', margin: 0 }}>
                                                    {patientName}
                                                </h5>
                                                <span style={{ fontSize: '10px', color: '#8492a6', fontWeight: '600' }}>
                                                    {timeAgo}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '12px', color: '#8492a6', marginBottom: '5px', lineHeight: 1.4, margin: '0 0 5px 0' }}>
                                                {msg.urgencyReason || msg.body.substring(0, 50)}...
                                            </p>
                                            {!msg.readAt && (
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '3px 8px',
                                                    background: '#CFF214',
                                                    color: '#1D1160',
                                                    fontSize: '9px',
                                                    fontWeight: '700',
                                                    borderRadius: '10px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Sin leer
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#8492a6', fontSize: '14px', margin: 0 }}>
                            No hay mensajes urgentes
                        </p>
                    )}
                </div>
            </div>

            {/* Quick Actions - Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {[
                    { label: 'Nueva Cita', subtitle: 'Agendar cita', gradient: 'linear-gradient(135deg, #1D1160 0%, #3340D3 100%)' },
                    { label: 'Nuevo Paciente', subtitle: 'Crear contacto', gradient: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' },
                    { label: 'Nuevo Documento', subtitle: 'Generar documento', gradient: 'linear-gradient(135deg, #00C6CC 0%, #00E5CC 100%)' },
                    { label: 'Nueva Plantilla', subtitle: 'Crear plantilla', gradient: 'linear-gradient(135deg, #3340D3 0%, #CFF214 100%)' }
                ].map((action, idx) => (
                    <div
                        key={idx}
                        style={{
                            background: '#ffffff',
                            padding: '24px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            border: '1px solid #e8ecf1',
                            boxShadow: '0 1px 3px rgba(29, 17, 96, 0.06)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 198, 204, 0.15)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.borderColor = '#00C6CC'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(29, 17, 96, 0.06)'
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.borderColor = '#e8ecf1'
                        }}
                    >
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '12px',
                            margin: '0 auto 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: action.gradient
                        }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"></svg>
                        </div>
                        <div style={{ fontSize: '13px', color: '#1D1160', fontWeight: '600' }}>
                            {action.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8492a6', marginTop: '3px', fontWeight: '500' }}>
                            {action.subtitle}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
