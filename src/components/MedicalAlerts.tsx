'use client'

import { useState } from 'react'
import { resolveAlert, createAlert } from '@/lib/hooks'

interface MedicalAlertsProps {
    alerts: any[]
    patientId: string
}

export default function MedicalAlerts({ alerts: initialAlerts, patientId }: MedicalAlertsProps) {
    const [alerts, setAlerts] = useState(initialAlerts)

    const handleResolve = async (alertId: string) => {
        await resolveAlert(alertId)
        setAlerts(alerts.filter((a: any) => a.id !== alertId))
    }

    const severityColors = {
        HIGH: { bg: '#fee', border: '#c33', text: '#c33', icon: '🚨' },
        MEDIUM: { bg: '#fff4cc', border: '#8b6914', text: '#8b6914', icon: '⚠️' },
        LOW: { bg: '#e3f2fd', border: '#1565c0', text: '#1565c0', icon: 'ℹ️' }
    }

    const activeAlerts = alerts.filter((a: any) => a.active)

    if (activeAlerts.length === 0) return null

    return (
        <div style={{ marginBottom: '24px' }}>
            {/* Banner para alertas HIGH */}
            {activeAlerts.some((a: any) => a.severity === 'HIGH') && (
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(204, 51, 51, 0.1) 100%)',
                    border: '2px solid #c33',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ fontSize: '32px' }}>🚨</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#c33', marginBottom: '4px' }}>
                            ALERTA MÉDICA IMPORTANTE
                        </div>
                        <div style={{ fontSize: '13px', color: '#721c24' }}>
                            Este paciente tiene alertas médicas de alta severidad. Revisa la lista completa antes de proceder.
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de Alertas */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '16px', margin: '0 0 16px 0' }}>
                    Alertas Médicas Activas ({activeAlerts.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeAlerts.map((alert: any) => {
                        const severity = severityColors[alert.severity as keyof typeof severityColors] || severityColors.LOW

                        return (
                            <div
                                key={alert.id}
                                style={{
                                    padding: '16px',
                                    background: severity.bg,
                                    border: `2px solid ${severity.border}`,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ fontSize: '24px' }}>{severity.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: severity.text, marginBottom: '4px' }}>
                                        {alert.type}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#1D1160' }}>
                                        {alert.description}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#8492a6', marginTop: '4px' }}>
                                        Fecha: {new Date(alert.createdAt).toLocaleDateString('es-ES')}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleResolve(alert.id)}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#ffffff',
                                        color: severity.text,
                                        border: `1px solid ${severity.border}`,
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = severity.border
                                        e.currentTarget.style.color = '#ffffff'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#ffffff'
                                        e.currentTarget.style.color = severity.text
                                    }}
                                >
                                    Resolver
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
