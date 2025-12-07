'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { usePatients, getMedicalHistory, createTreatment, uploadPhoto, createAlert } from '@/lib/hooks'
import Odontogram from '@/components/Odontogram'
import TreatmentTimeline from '@/components/TreatmentTimeline'
import PhotoGallery from '@/components/PhotoGallery'
import MedicalAlerts from '@/components/MedicalAlerts'
import SignedDocumentsList from '@/components/SignedDocumentsList'

export default function HistoriaClinicaPage() {
    const params = useParams()
    const patientId = params.id as string

    const { patients } = usePatients('')
    const patient = patients?.find((p: any) => p.id === patientId)

    const [medicalHistory, setMedicalHistory] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'odontogram' | 'treatments' | 'photos' | 'documents'>('odontogram')

    // Load medical history
    useState(() => {
        if (patientId) {
            getMedicalHistory(patientId).then(data => {
                setMedicalHistory(data)
                setLoading(false)
            })
        }
    })

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#8492a6' }}>Cargando historia clínica...</div>
    }

    if (!patient) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>Paciente no encontrado</div>
    }

    return (
        <div>
            {/* Patient Header */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e8ecf1' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '32px',
                        fontWeight: '700'
                    }}>
                        {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1160', marginBottom: '8px', margin: '0 0 8px 0' }}>
                            {patient.firstName} {patient.lastName}
                        </h1>
                        <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#8492a6' }}>
                            <div>📧 {patient.email}</div>
                            <div>📞 {patient.mobile}</div>
                            <div>🆔 {patient.patientNumber}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Alerts */}
            {medicalHistory?.alerts && medicalHistory.alerts.length > 0 && (
                <MedicalAlerts alerts={medicalHistory.alerts} patientId={patientId} />
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e8ecf1' }}>
                {[
                    { value: 'odontogram', label: 'Odontograma', icon: '🦷' },
                    { value: 'treatments', label: 'Tratamientos', icon: '📋' },
                    { value: 'photos', label: 'Galería', icon: '📸' },
                    { value: 'documents', label: 'Documentos', icon: '📄' }
                ].map((tab) => (
                    <div
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value as any)}
                        style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: activeTab === tab.value ? '#00C6CC' : '#8492a6',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderBottom: activeTab === tab.value ? '3px solid #00C6CC' : '3px solid transparent',
                            marginBottom: '-2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'odontogram' && (
                <Odontogram
                    odontogramData={medicalHistory?.odontogram || {}}
                    patientId={patientId}
                />
            )}

            {activeTab === 'treatments' && (
                <TreatmentTimeline
                    treatments={medicalHistory?.treatments || []}
                    patientId={patientId}
                />
            )}

            {activeTab === 'photos' && (
                <PhotoGallery
                    photos={medicalHistory?.photos || []}
                    patientId={patientId}
                />
            )}

            {activeTab === 'documents' && (
                <SignedDocumentsList
                    documents={medicalHistory?.signedDocuments || []}
                    patientId={patientId}
                />
            )}
        </div>
    )
}
