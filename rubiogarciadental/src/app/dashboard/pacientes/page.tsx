'use client'

import { useState } from 'react'
import { usePatients } from '@/lib/hooks'
import PatientForm from '@/components/PatientForm'

export default function PacientesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)

    const { patients, isLoading, isError, mutate } = usePatients(searchTerm)

    // Calculate totals
    const totalAppointments = patients?.reduce((sum: number, p: any) => sum + (p._count?.appointments || 0), 0) || 0
    const totalDebt = patients?.reduce((sum: number, p: any) => {
        const debt = p.invoices?.filter((inv: any) => inv.status !== 'PAID').reduce((s: number, inv: any) => s + Number(inv.total), 0) || 0
        return sum + debt
    }, 0) || 0

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#8492a6', marginBottom: 0 }}>
                    Gestión de Pacientes
                </h1>
            </div>

            {/* Search & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    background: '#f5f7fa',
                    borderRadius: '10px',
                    width: '400px',
                    border: '2px solid #e8ecf1',
                    transition: 'all 0.3s'
                }}
                    onFocus={(e) => {
                        const parent = e.currentTarget as HTMLDivElement
                        parent.style.borderColor = '#00C6CC'
                        parent.style.background = '#ffffff'
                    }}
                    onBlur={(e) => {
                        const parent = e.currentTarget as HTMLDivElement
                        parent.style.borderColor = '#e8ecf1'
                        parent.style.background = '#f5f7fa'
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8492a6" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar by nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                            flex: 1,
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1D1160'
                        }}
                    />
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(51,64,211,0.4)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                    }}>
                    + Nuevo Paciente
                </button>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Pacientes', value: patients?.length || 0, color: '#00C6CC' },
                    { label: 'Citas Totales', value: totalAppointments, color: '#3340D3' },
                    { label: 'Deuda Total', value: `${totalDebt.toFixed(2)}€`, color: '#CFF214' }
                ].map((stat, idx) => (
                    <div key={idx} style={{
                        background: '#ffffff',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #e8ecf1',
                        textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(29, 17, 96, 0.06)'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: stat.color, marginBottom: '8px' }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8492a6', fontWeight: '600', textTransform: 'uppercase' }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Patients Grid */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#8492a6' }}>Cargando pacientes...</div>
            ) : isError ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#ff6b6b' }}>
                    Error al cargar pacientes. <button onClick={() => mutate()} style={{ marginLeft: '8px', color: '#00C6CC', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>Reintentar</button>
                </div>
            ) : patients && patients.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {patients.map((patient: any) => {
                        const initials = `${patient.firstName[0]}${patient.lastName[0]}`
                        const appointmentsCount = patient._count?.appointments || 0
                        const debt = patient.invoices?.filter((inv: any) => inv.status !== 'PAID').reduce((sum: number, inv: any) => sum + Number(inv.total), 0) || 0
                        const lastVisit = patient.appointments?.[0]?.startTime ? new Date(patient.appointments[0].startTime).toLocaleDateString('es-ES') : 'N/A'

                        return (
                            <div
                                key={patient.id}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    border: '1px solid #e8ecf1',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(207, 242, 20, 0.3)'
                                    e.currentTarget.style.borderColor = '#CFF214'
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none'
                                    e.currentTarget.style.borderColor = '#e8ecf1'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                }}>
                                {/* Gradient Line Left */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    background: 'linear-gradient(180deg, #CFF214 0%, #00C6CC 100%)',
                                    borderRadius: '12px 0 0 12px'
                                }} />

                                {/* Header with Avatar */}
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        flexShrink: 0
                                    }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '4px', margin: '0 0 4px 0' }}>
                                            {patient.firstName} {patient.lastName}
                                        </h3>
                                        <p style={{ fontSize: '12px', color: '#8492a6', fontWeight: '500', margin: 0 }}>
                                            {patient.email}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#8492a6', fontWeight: '500', margin: 0 }}>
                                            {patient.mobile}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '12px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #f0f2f5'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#00C6CC', marginBottom: '2px' }}>
                                            {appointmentsCount}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#8492a6', fontWeight: '600', textTransform: 'uppercase' }}>
                                            Citas
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#00C6CC', marginBottom: '2px' }}>
                                            {debt.toFixed(0)}€
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#8492a6', fontWeight: '600', textTransform: 'uppercase' }}>
                                            Deuda
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#00C6CC', marginBottom: '2px' }}>
                                            {lastVisit}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#8492a6', fontWeight: '600', textTransform: 'uppercase' }}>
                                            Última
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#8492a6' }}>
                    No se encontraron pacientes
                </div>
            )}

            {/* Create Patient Modal */}
            {showCreateModal && (
                <PatientForm
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => { mutate(); setShowCreateModal(false) }}
                />
            )}
        </div>
    )
}
