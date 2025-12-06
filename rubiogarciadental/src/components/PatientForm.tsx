'use client'

import { useState } from 'react'
import { createPatient } from '@/lib/hooks'

interface PatientFormProps {
    onClose: () => void
    onSuccess: () => void
}

export default function PatientForm({ onClose, onSuccess }: PatientFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        birthDate: '',
        phone: '',
        mobile: '',
        email: '',
        address: '',
        allergies: '',
        diseases: '',
        medications: '',
        communicationPreference: 'WHATSAPP',
        lopdSigned: false,
        lopdDate: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createPatient(formData)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating patient:', error)
            alert('Error al crear paciente')
        } finally {
            setLoading(false)
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
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1160', margin: 0 }}>
                        Nuevo Paciente
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
                    {/* Datos Personales */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '16px' }}>
                            Datos Personales
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Nombre *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                                    Apellidos *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                                    DNI
                                </label>
                                <input
                                    type="text"
                                    value={formData.dni}
                                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
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
                                    Fecha de Nacimiento
                                </label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                    </div>

                    {/* Contacto */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '16px' }}>
                            Contacto
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                                    Móvil *
                                </label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
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
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    Preferencia Comunicación
                                </label>
                                <select
                                    value={formData.communicationPreference}
                                    onChange={(e) => setFormData({ ...formData, communicationPreference: e.target.value })}
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
                                    <option value="WHATSAPP">WhatsApp</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="SMS">SMS</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                Dirección
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={2}
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

                    {/* Información Médica */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '16px' }}>
                            Información Médica
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Alergias
                                </label>
                                <textarea
                                    value={formData.allergies}
                                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                    rows={2}
                                    placeholder="Ninguna"
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
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Enfermedades
                                </label>
                                <textarea
                                    value={formData.diseases}
                                    onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
                                    rows={2}
                                    placeholder="Ninguna"
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
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>
                                    Medicamentos
                                </label>
                                <textarea
                                    value={formData.medications}
                                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                                    rows={2}
                                    placeholder="Ninguno"
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
                    </div>

                    {/* LOPD */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.lopdSigned}
                                onChange={(e) => setFormData({ ...formData, lopdSigned: e.target.checked, lopdDate: e.target.checked ? new Date().toISOString().split('T')[0] : '' })}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#1D1160' }}>
                                LOPD Firmado
                            </span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
                            {loading ? 'Guardando...' : 'Guardar Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
