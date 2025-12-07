'use client'

import { useState } from 'react'
import { createAppointment } from '@/lib/hooks'

interface AppointmentFormProps {
    onClose: () => void
    onSuccess: () => void
    patients: any[]
    doctors: any[]
}

export default function AppointmentForm({ onClose, onSuccess, patients, doctors }: AppointmentFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        startTime: '',
        endTime: '',
        treatment: '',
        status: 'SCHEDULED',
        notes: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createAppointment(formData)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating appointment:', error)
            alert('Error al crear cita')
        } finally {
            setLoading(false)
        }
    }

    // Auto-calculate end time (1 hour after start)
    const handleStartTimeChange = (value: string) => {
        setFormData({ ...formData, startTime: value })

        if (value) {
            const start = new Date(value)
            const end = new Date(start.getTime() + 60 * 60 * 1000) // +1 hour
            setFormData(prev => ({
                ...prev,
                startTime: value,
                endTime: end.toISOString().slice(0, 16)
            }))
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1160', margin: 0 }}>
                        Nueva Cita
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        color: '#8492a6',
                        cursor: 'pointer'
                    }}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                Paciente *
                            </label>
                            <select
                                required
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e8ecf1',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    background: '#f5f7fa',
                                    outline: 'none'
                                }}
                            >
                                <option value="">Seleccionar paciente</option>
                                {patients.map((patient: any) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.firstName} {patient.lastName} - {patient.mobile}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                Doctor *
                            </label>
                            <select
                                required
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e8ecf1',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    background: '#f5f7fa',
                                    outline: 'none'
                                }}
                            >
                                <option value="">Seleccionar doctor</option>
                                {doctors.map((doctor: any) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Fecha y Hora Inicio *
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) => handleStartTimeChange(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e8ecf1',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        background: '#f5f7fa',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Hora Fin *
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e8ecf1',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        background: '#f5f7fa',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                Tratamiento *
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.treatment}
                                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                placeholder="Ej: Limpieza dental, Implante, Ortodoncia..."
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e8ecf1',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    background: '#f5f7fa',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                Estado
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e8ecf1',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    background: '#f5f7fa',
                                    outline: 'none'
                                }}
                            >
                                <option value="SCHEDULED">Programada</option>
                                <option value="CONFIRMED">Confirmada</option>
                                <option value="COMPLETED">Completada</option>
                                <option value="CANCELLED">Cancelada</option>
                                <option value="NO_SHOW">No asistió</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                Notas
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                placeholder="Notas adicionales sobre la cita..."
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '2px solid #e8ecf1',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    background: '#f5f7fa',
                                    outline: 'none',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                background: '#f5f7fa',
                                border: '1px solid #e8ecf1',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#1D1160',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: '#ffffff',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cita'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
