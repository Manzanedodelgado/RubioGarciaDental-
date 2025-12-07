'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function VoiceControl() {
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [feedback, setFeedback] = useState<string | null>(null)
    const recognitionRef = useRef<any>(null)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = false
                recognition.lang = 'es-ES'
                recognition.interimResults = false

                recognition.onstart = () => setIsListening(true)
                recognition.onend = () => setIsListening(false)

                recognition.onresult = async (event: any) => {
                    const text = event.results[0][0].transcript
                    setTranscript(text)
                    handleCommand(text)
                }

                recognitionRef.current = recognition
            }
        }
    }, [])

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Tu navegador no soporta control por voz.')
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.start()
            setFeedback(null)
            setTranscript('')
        }
    }

    const handleCommand = async (text: string) => {
        setIsProcessing(true)
        try {
            const res = await fetch('/api/ai/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: text })
            })

            const data = await res.json()

            if (data.action === 'NAVIGATE') {
                setFeedback(`Navegando: ${data.message}`)
                router.push(data.data.url)
            } else if (data.action === 'OPEN_MODAL') {
                setFeedback(`Acción: ${data.message}`)
                // Implement global modal logic here if needed
                // For now just feedback
            } else {
                setFeedback(data.message || 'No entendido')
            }
        } catch (error) {
            console.error('Error processing command:', error)
            setFeedback('Error al procesar comando')
        } finally {
            setIsProcessing(false)
            // Clear feedback after 3 seconds
            setTimeout(() => setFeedback(null), 3000)
        }
    }

    if (!recognitionRef.current) return null

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={toggleListening}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isListening
                        ? '#ff4d4f'
                        : 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s',
                    transform: isListening ? 'scale(1.1)' : 'scale(1)'
                }}
            >
                <span style={{ fontSize: '24px' }}>
                    {isListening ? '⏹️' : '🎙️'}
                </span>

                {/* Pulse effect when listening */}
                {isListening && (
                    <span style={{
                        position: 'absolute',
                        top: -5, left: -5, right: -5, bottom: -5,
                        borderRadius: '50%',
                        border: '2px solid #ff4d4f',
                        animation: 'pulse 1.5s infinite',
                        opacity: 0.5
                    }} />
                )}
            </button>

            {/* Feedback Overlay */}
            {(transcript || feedback || isProcessing) && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '30px',
                    background: '#ffffff',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    zIndex: 9999,
                    maxWidth: '300px',
                    borderLeft: '4px solid #00C6CC',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {isProcessing && <div style={{ fontSize: '12px', color: '#8492a6', marginBottom: '4px' }}>Procesando...</div>}
                    {transcript && !feedback && <div style={{ fontSize: '14px', color: '#1D1160', fontStyle: 'italic' }}>"{transcript}"</div>}
                    {feedback && <div style={{ fontSize: '14px', fontWeight: '600', color: '#00C6CC' }}>{feedback}</div>}
                </div>
            )}

            <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </>
    )
}
