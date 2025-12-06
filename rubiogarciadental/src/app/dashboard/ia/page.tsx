'use client'

import { useState } from 'react'

interface AICard {
    id: number
    title: string
    description: string
    active: boolean
    stats: {
        label: string
        value: string | number
    }[]
    gradient: string
}

const aiCardsData: AICard[] = [
    {
        id: 1,
        title: 'Asistente Virtual',
        description: 'Atención automatizada 24/7 para consultas frecuentes',
        active: true,
        stats: [
            { label: 'Consultas', value: 234 },
            { label: 'Tasa resp.', value: '98%' },
            { label: 'Satisfacción', value: '4.8/5' }
        ],
        gradient: 'linear-gradient(135deg, #1D1160 0%, #3340D3 100%)'
    },
    {
        id: 2,
        title: 'Auto-respondedor',
        description: 'Respuestas automáticas a mensajes de WhatsApp',
        active: true,
        stats: [
            { label: 'Mensajes', value: 512 },
            { label: 'Respuesta', value: '< 30s' },
            { label: 'Efectividad', value: '94%' }
        ],
        gradient: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)'
    },
    {
        id: 3,
        title: 'Análisis de Sentimiento',
        description: 'Detecta emociones en mensajes de pacientes',
        active: true,
        stats: [
            { label: 'Analizados', value: 186 },
            { label: 'Positivos', value: '76%' },
            { label: 'Precisión', value: '91%' }
        ],
        gradient: 'linear-gradient(135deg, #00C6CC 0%, #00E5CC 100%)'
    },
    {
        id: 4,
        title: 'Recomendaciones IA',
        description: 'Sugerencias de tratamientos basadas en datos',
        active: false,
        stats: [
            { label: 'Generadas', value: 42 },
            { label: 'Aceptadas', value: '68%' },
            { label: 'Ahorro', value: '2h/día' }
        ],
        gradient: 'linear-gradient(135deg, #3340D3 0%, #CFF214 100%)'
    }
]

export default function IAPage() {
    const [aiCards, setAiCards] = useState(aiCardsData)

    const toggleActive = (cardId: number) => {
        setAiCards(prev => prev.map(card =>
            card.id === cardId ? { ...card, active: !card.active } : card
        ))
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
                    Inteligencia Artificial
                </h1>
            </div>

            {/* Info Banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(207, 242, 20, 0.08) 0%, rgba(0, 198, 204, 0.08) 100%)',
                border: '1px solid #CFF214',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00C6CC" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1D1160', fontWeight: '600' }}>
                        Los módulos de IA mejoran la eficiencia y la experiencia del paciente de forma automática
                    </p>
                </div>
            </div>

            {/* AI Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                marginBottom: '28px'
            }}>
                {aiCards.map((card) => (
                    <div
                        key={card.id}
                        style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            padding: '24px',
                            border: '1px solid #e8ecf1',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
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
                        }}
                    >
                        {/* Decorative gradient circle */}
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '150px',
                            height: '150px',
                            background: 'radial-gradient(circle, rgba(207, 242, 20, 0.08) 0%, transparent 70%)',
                            borderRadius: '50%',
                            pointerEvents: 'none'
                        }} />

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: card.gradient,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                                            <path d="M12 2v6m0 6v6M5.6 5.6l4.2 4.2m4.4 4.4l4.2 4.2M2 12h6m6 0h6M5.6 18.4l4.2-4.2m4.4-4.4l4.2-4.2" />
                                        </svg>
                                    </div>
                                    {card.active && (
                                        <div style={{
                                            padding: '4px 12px',
                                            background: '#CFF214',
                                            color: '#1D1160',
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            borderRadius: '6px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Activo
                                        </div>
                                    )}
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '6px', margin: '0 0 6px 0' }}>
                                    {card.title}
                                </h3>
                                <p style={{ fontSize: '13px', color: '#8492a6', margin: 0, lineHeight: 1.5 }}>
                                    {card.description}
                                </p>
                            </div>

                            {/* Toggle */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleActive(card.id)
                                }}
                                style={{
                                    width: '48px',
                                    height: '28px',
                                    background: card.active ? '#CFF214' : '#e8ecf1',
                                    borderRadius: '14px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    border: `2px solid ${card.active ? '#CFF214' : '#d1d5db'}`,
                                    flexShrink: 0,
                                    marginLeft: '12px'
                                }}
                            >
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: card.active ? '#1D1160' : '#ffffff',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: card.active ? '24px' : '2px',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                                }} />
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                            paddingTop: '16px',
                            borderTop: '1px solid #f0f2f5',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {card.stats.map((stat, idx) => (
                                <div key={idx} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#00C6CC', marginBottom: '2px' }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#8492a6', fontWeight: '600', textTransform: 'uppercase' }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Configuration Section */}
            <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e8ecf1'
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '16px', margin: '0 0 16px 0' }}>
                    Configuración del Agente
                </h3>

                <div style={{ display: 'grid', gap: '16px' }}>
                    {/* Setting Item */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f5f7fa',
                        borderRadius: '10px'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160', marginBottom: '4px', margin: '0 0 4px 0' }}>
                                Idioma del Agente
                            </h4>
                            <p style={{ fontSize: '12px', color: '#8492a6', margin: 0 }}>
                                Español (España)
                            </p>
                        </div>
                        <button style={{
                            padding: '8px 16px',
                            background: '#ffffff',
                            border: '1px solid #e8ecf1',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1D1160',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            Cambiar
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f5f7fa',
                        borderRadius: '10px'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160', marginBottom: '4px', margin: '0 0 4px 0' }}>
                                Tiempo de Respuesta
                            </h4>
                            <p style={{ fontSize: '12px', color: '#8492a6', margin: 0 }}>
                                Instantáneo (menos de 30 segundos)
                            </p>
                        </div>
                        <button style={{
                            padding: '8px 16px',
                            background: '#ffffff',
                            border: '1px solid #e8ecf1',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1D1160',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            Configurar
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f5f7fa',
                        borderRadius: '10px'
                    }}>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160', marginBottom: '4px', margin: '0 0 4px 0' }}>
                                Modelo de IA
                            </h4>
                            <p style={{ fontSize: '12px', color: '#8492a6', margin: 0 }}>
                                GPT-4 Turbo (más preciso)
                            </p>
                        </div>
                        <button style={{
                            padding: '8px 16px',
                            background: '#ffffff',
                            border: '1px solid #e8ecf1',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#1D1160',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}>
                            Cambiar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
