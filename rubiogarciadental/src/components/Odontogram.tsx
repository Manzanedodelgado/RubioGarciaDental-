'use client'

import { useState } from 'react'
import { updateOdontogram } from '@/lib/hooks'

interface OdontogramProps {
    odontogramData: any
    patientId: string
}

export default function Odontogram({ odontogramData, patientId }: OdontogramProps) {
    const [data, setData] = useState(odontogramData || {})
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null)

    const toothStates = {
        healthy: { color: '#00C6CC', label: 'Sano' },
        cavity: { color: '#ff6b6b', label: 'Caries' },
        endodontics: { color: '#3340D3', label: 'Endodoncia' },
        implant: { color: '#CFF214', label: 'Implante' },
        missing: { color: '#b4bcc8', label: 'Ausente' }
    }

    const getToothState = (toothNum: number) => {
        return data[`tooth_${toothNum}`] || 'healthy'
    }

    const handleToothClick = (toothNum: number) => {
        setSelectedTooth(toothNum)
    }

    const updateToothState = async (toothNum: number, state: string) => {
        const newData = { ...data, [`tooth_${toothNum}`]: state }
        setData(newData)
        await updateOdontogram(patientId, newData)
        setSelectedTooth(null)
    }

    // Teeth positions (simplified grid layout)
    const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
    const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

    const renderTooth = (toothNum: number) => {
        const state = getToothState(toothNum)
        const stateInfo = toothStates[state as keyof typeof toothStates]

        return (
            <div
                key={toothNum}
                onClick={() => handleToothClick(toothNum)}
                style={{
                    width: '50px',
                    height: '70px',
                    background: stateInfo.color,
                    borderRadius: '8px 8px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedTooth === toothNum ? '3px solid #1D1160' : '2px solid #e8ecf1',
                    position: 'relative'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
            >
                <div style={{ fontSize: '16px', fontWeight: '700', color: state === 'implant' ? '#1D1160' : '#ffffff' }}>
                    {toothNum}
                </div>
                <div style={{ fontSize: '9px', fontWeight: '600', color: state === 'implant' ? '#1D1160' : 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                    {stateInfo.label}
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e8ecf1' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                Odontograma Dental
            </h3>

            {/* Upper Teeth */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#8492a6', marginBottom: '12px', textAlign: 'center' }}>
                    ARCADA SUPERIOR
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {upperTeeth.map(renderTooth)}
                </div>
            </div>

            {/* Lower Teeth */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#8492a6', marginBottom: '12px', textAlign: 'center' }}>
                    ARCADA INFERIOR
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {lowerTeeth.map(renderTooth)}
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingTop: '24px', borderTop: '1px solid #e8ecf1' }}>
                {Object.entries(toothStates).map(([key, value]) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: value.color }} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1D1160' }}>{value.label}</span>
                    </div>
                ))}
            </div>

            {/* State Selector Modal */}
            {selectedTooth && (
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
                    onClick={() => setSelectedTooth(null)}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '400px',
                        width: '90%'
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', margin: '0 0 20px 0' }}>
                            Diente #{selectedTooth}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#8492a6', marginBottom: '20px', margin: '0 0 20px 0' }}>
                            Selecciona el estado del diente:
                        </p>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {Object.entries(toothStates).map(([key, value]) => (
                                <button
                                    key={key}
                                    onClick={() => updateToothState(selectedTooth, key)}
                                    style={{
                                        padding: '16px',
                                        background: value.color,
                                        color: key === 'implant' ? '#1D1160' : '#ffffff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.02)'
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    {value.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setSelectedTooth(null)}
                            style={{
                                marginTop: '20px',
                                width: '100%',
                                padding: '12px',
                                background: '#e8ecf1',
                                color: '#1D1160',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
