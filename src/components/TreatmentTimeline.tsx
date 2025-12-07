'use client'

import { useState } from 'react'
import { createTreatment, updateTreatment, deleteTreatment } from '@/lib/hooks'

interface TreatmentTimelineProps {
    treatments: any[]
    patientId: string
}

export default function TreatmentTimeline({ treatments: initialTreatments, patientId }: TreatmentTimelineProps) {
    const [treatments, setTreatments] = useState(initialTreatments)
    const [showModal, setShowModal] = useState(false)
    const [filter, setFilter] = useState('all')

    const handleCreateTreatment = async (data: any) => {
        const newTreatment = await createTreatment(patientId, data)
        setTreatments([newTreatment, ...treatments])
        setShowModal(false)
    }

    const filteredTreatments = filter === 'all' ? treatments : treatments.filter((t: any) => t.status === filter)

    const statusColors = {
        PLANNED: { bg: '#fff4cc', text: '#8b6914', label: 'Planificado' },
        IN_PROGRESS: { bg: '#e3f2fd', text: '#1565c0', label: 'En Progreso' },
        COMPLETED: { bg: '#d4f4dd', text: '#0a5d1a', label: 'Completado' },
        CANCELLED: { bg: '#f8d7da', text: '#721c24', label: 'Cancelado' }
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', margin: 0 }}>Timeline de Tratamientos</h3>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    + Nuevo Tratamiento
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {['all', 'PLANNED', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 14px',
                            background: filter === f ? '#f5f7fa' : '#ffffff',
                            border: `1px solid ${filter === f ? '#00C6CC' : '#e8ecf1'}`,
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1D1160',
                            cursor: 'pointer'
                        }}
                    >
                        {f === 'all' ? 'Todos' : statusColors[f as keyof typeof statusColors].label}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredTreatments.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px', color: '#8492a6', margin: 0 }}>
                        No hay tratamientos registrados
                    </p>
                ) : (
                    filteredTreatments.map((treatment: any) => {
                        const status = statusColors[treatment.status as keyof typeof statusColors] || statusColors.PLANNED

                        return (
                            <div key={treatment.id} style={{
                                display: 'flex',
                                gap: '16px',
                                padding: '20px',
                                background: '#fafbfc',
                                borderRadius: '10px',
                                border: '1px solid #e8ecf1',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(90deg, rgba(207, 242, 20, 0.05) 0%, rgba(0, 198, 204, 0.05) 100%)'
                                    e.currentTarget.style.borderLeftColor = '#CFF214'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#fafbfc'
                                    e.currentTarget.style.borderLeftColor = '#e8ecf1'
                                }}>
                                {/* Date Circle */}
                                <div style={{
                                    minWidth: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff'
                                }}>
                                    <div style={{ fontSize: '18px', fontWeight: '700' }}>
                                        {new Date(treatment.date).getDate()}
                                    </div>
                                    <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.8 }}>
                                        {new Date(treatment.date).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '4px', margin: '0 0 4px 0' }}>
                                                {treatment.type}
                                            </h4>
                                            <div style={{ fontSize: '13px', color: '#8492a6' }}>
                                                Diente: {treatment.tooth} • Dr. {treatment.doctorName || 'N/A'}
                                            </div>
                                        </div>
                                        <div style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', background: status.bg, color: status.text }}>
                                            {status.label}
                                        </div>
                                    </div>

                                    {treatment.notes && (
                                        <p style={{ fontSize: '13px', color: '#8492a6', marginBottom: '8px', margin: '0 0 8px 0' }}>
                                            {treatment.notes}
                                        </p>
                                    )}

                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#00C6CC' }}>
                                        {treatment.cost ? `${Number(treatment.cost).toFixed(2)}€` : 'Sin coste asignado'}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Modal New Treatment */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(29, 17, 96, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}
                    onClick={() => setShowModal(false)}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90%',
                        overflowY: 'auto'
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', margin: '0 0 20px 0' }}>
                            Nuevo Tratamiento
                        </h4>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            handleCreateTreatment({
                                type: formData.get('type'),
                                tooth: formData.get('tooth'),
                                date: formData.get('date'),
                                notes: formData.get('notes'),
                                cost: formData.get('cost'),
                                status: 'PLANNED'
                            })
                        }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Tipo de Tratamiento *
                                </label>
                                <input
                                    name="type"
                                    required
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e8ecf1', borderRadius: '8px', fontSize: '14px', background: '#f5f7fa', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Diente *
                                </label>
                                <input
                                    name="tooth"
                                    required
                                    placeholder="Ej: 11, 16, 31"
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e8ecf1', borderRadius: '8px', fontSize: '14px', background: '#f5f7fa', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Fecha *
                                </label>
                                <input
                                    name="date"
                                    type="date"
                                    required
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e8ecf1', borderRadius: '8px', fontSize: '14px', background: '#f5f7fa', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Notas
                                </label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e8ecf1', borderRadius: '8px', fontSize: '14px', background: '#f5f7fa', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Coste (€)
                                </label>
                                <input
                                    name="cost"
                                    type="number"
                                    step="0.01"
                                    style={{ width: '100%', padding: '12px', border: '2px solid #e8ecf1', borderRadius: '8px', fontSize: '14px', background: '#f5f7fa', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '14px',
                                        background: '#e8ecf1',
                                        color: '#1D1160',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
