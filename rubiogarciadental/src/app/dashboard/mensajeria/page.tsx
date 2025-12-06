'use client'

import { useState } from 'react'
import { useWhatsAppMessages, sendWhatsAppMessage } from '@/lib/hooks'

export default function MensajeriaPage() {
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
    const [message, setMessage] = useState('')

    const { messages, isLoading, mutate } = useWhatsAppMessages(selectedConversation || undefined)

    const conversations = messages?.reduce((acc: any[], msg: any) => {
        const existing = acc.find((c: any) => c.patientId === msg.patientId)
        if (existing) {
            existing.messages.push(msg)
            if (new Date(msg.sentAt) > new Date(existing.lastMessage.sentAt)) existing.lastMessage = msg
        } else if (msg.patient) {
            acc.push({ patientId: msg.patientId, patient: msg.patient, messages: [msg], lastMessage: msg })
        }
        return acc
    }, [])?.sort((a: any, b: any) => new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime()) || []

    const handleSend = async () => {
        if (!message.trim() || !selectedConversation) return
        try {
            await sendWhatsAppMessage({ to: selectedConversation, body: message })
            setMessage('')
            mutate()
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#8492a6', marginBottom: 0 }}>Mensajería WhatsApp</h1>
            </div>

            {/* Messaging Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', height: 'calc(100vh - 200px)' }}>
                {/* Conversations Panel */}
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e8ecf1', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e8ecf1' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', margin: 0 }}>Conversaciones</h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                        {isLoading ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#8492a6' }}>Cargando...</div>
                        ) : conversations.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#8492a6' }}>No hay conversaciones</div>
                        ) : (
                            conversations.map((conv: any) => {
                                const initials = `${conv.patient.firstName[0]}${conv.patient.lastName[0]}`
                                const isActive = selectedConversation === conv.patientId
                                const unreadCount = conv.messages.filter((m: any) => !m.readAt && !m.from.includes(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '')).length

                                return (
                                    <div
                                        key={conv.patientId}
                                        onClick={() => setSelectedConversation(conv.patientId)}
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            padding: '12px 20px',
                                            cursor: 'pointer',
                                            background: isActive ? 'linear-gradient(135deg, rgba(207, 242, 20, 0.08) 0%, rgba(0, 198, 204, 0.08) 100%)' : '#ffffff',
                                            borderLeft: isActive ? '4px solid #CFF214' : '4px solid transparent',
                                            boxShadow: isActive ? '0 2px 8px rgba(207, 242, 20, 0.15)' : 'none',
                                            transition: 'all 0.2s',
                                            marginBottom: '0'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) e.currentTarget.style.background = '#f5f7fa'
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) e.currentTarget.style.background = '#ffffff'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
                                            {initials}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160' }}>{conv.patient.firstName} {conv.patient.lastName}</span>
                                                {unreadCount > 0 && (
                                                    <span style={{ padding: '2px 8px', background: 'linear-gradient(135deg, #CFF214 0%, #00C6CC 100%)', borderRadius: '10px', fontSize: '10px', fontWeight: '700', color: '#1D1160' }}>{unreadCount}</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#8492a6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {conv.lastMessage.body.substring(0, 40)}...
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Chat Panel */}
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e8ecf1', display: 'flex', flexDirection: 'column' }}>
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8ecf1' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', margin: 0 }}>
                                    {conversations.find((c: any) => c.patientId === selectedConversation)?.patient.firstName} {conversations.find((c: any) => c.patientId === selectedConversation)?.patient.lastName}
                                </h3>
                            </div>

                            {/* Chat Messages */}
                            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {messages?.filter((m: any) => m.patientId === selectedConversation).map((msg: any) => {
                                    const isSent = msg.from.includes(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '')

                                    return (
                                        <div key={msg.id} style={{ maxWidth: '70%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.5, background: isSent ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : '#f5f7fa', color: isSent ? '#ffffff' : '#1D1160', alignSelf: isSent ? 'flex-end' : 'flex-start' }}>
                                            <div>{msg.body}</div>
                                            <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>{new Date(msg.sentAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Chat Input Area */}
                            <div style={{ padding: '20px 24px', borderTop: '1px solid #e8ecf1', display: 'flex', gap: '12px' }}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribe un mensaje..."
                                    style={{ flex: 1, padding: '12px 16px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f5f7fa', outline: 'none', fontFamily: 'inherit' }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#00C6CC'
                                        e.currentTarget.style.background = '#ffffff'
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e8ecf1'
                                        e.currentTarget.style.background = '#f5f7fa'
                                    }}
                                />
                                <button onClick={handleSend} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}>
                                    Enviar
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8492a6' }}>
                            Selecciona una conversación
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
