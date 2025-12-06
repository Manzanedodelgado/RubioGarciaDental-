'use client'

import { useState } from 'react'
import { signDocument } from '@/lib/hooks'
import SignatureCanvas from '@/components/SignatureCanvas'

interface SignedDocumentsListProps {
    documents: any[]
    patientId: string
}

export default function SignedDocumentsList({ documents: initialDocuments, patientId }: SignedDocumentsListProps) {
    const [documents, setDocuments] = useState(initialDocuments)
    const [showSignModal, setShowSignModal] = useState<any | null>(null)

    const handleSign = async (documentId: string, signature: string) => {
        await signDocument(documentId, signature)
        setDocuments(documents.map((d: any) =>
            d.id === documentId ? { ...d, signature, signedAt: new Date().toISOString() } : d
        ))
        setShowSignModal(null)
    }

    const handleDownload = async (doc: any) => {
        try {
            // In a real app, we would fetch the specific document content here
            // For now, we'll generate a generic document using the invoice generator structure
            const response = await fetch('/api/documents/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceData: {
                        invoiceNumber: doc.id.substring(0, 8).toUpperCase(),
                        issueDate: doc.createdAt,
                        patient: {
                            firstName: 'Juan', // Should come from patient prop or context
                            lastName: 'García',
                            email: 'juan@example.com',
                            mobile: '+34 600 000 000'
                        },
                        clinic: {
                            name: 'Rubio García Dental',
                            address: 'Calle Principal 123, Madrid',
                            phone: '+34 912 345 678',
                            email: 'info@rubiogarciadental.com',
                            nif: 'B12345678'
                        },
                        items: [
                            {
                                description: doc.name,
                                quantity: 1,
                                price: 0,
                                total: 0
                            }
                        ],
                        subtotal: 0,
                        tax: 0,
                        total: 0,
                        notes: `Documento: ${doc.type}\nFirmado digitalmente el: ${doc.signedAt ? new Date(doc.signedAt).toLocaleString() : 'Pendiente'}`
                    },
                    signatureDataURL: doc.signature
                })
            })

            if (!response.ok) throw new Error('Failed to generate PDF')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${doc.name}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Error downloading document:', error)
            alert('Error al descargar el documento')
        }
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                Documentos Médicos
            </h3>

            {documents.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#8492a6', margin: 0 }}>
                    No hay documentos registrados
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {documents.map((doc: any) => (
                        <div key={doc.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '20px',
                            background: '#fafbfc',
                            borderRadius: '10px',
                            border: '1px solid #e8ecf1',
                            borderLeft: `4px solid ${doc.signature ? '#00C6CC' : '#CFF214'}`,
                            transition: 'all 0.2s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f5f7fa'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fafbfc'
                            }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{ fontSize: '24px' }}>📄</div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '4px', margin: '0 0 4px 0' }}>
                                            {doc.type}
                                        </h4>
                                        <div style={{ fontSize: '13px', color: '#8492a6' }}>
                                            {doc.name} • {new Date(doc.createdAt).toLocaleDateString('es-ES')}
                                        </div>
                                    </div>
                                </div>
                                {doc.signature && (
                                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ padding: '4px 10px', background: '#d4f4dd', color: '#0a5d1a', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                                            ✓ FIRMADO
                                        </div>
                                        <span style={{ fontSize: '11px', color: '#8492a6' }}>
                                            {new Date(doc.signedAt).toLocaleDateString('es-ES')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                {!doc.signature && (
                                    <button
                                        onClick={() => setShowSignModal(doc)}
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
                                        ✍️ Firmar
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDownload(doc)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#e8ecf1',
                                        color: '#1D1160',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    📥 Descargar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sign Modal */}
            {showSignModal && (
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
                    onClick={() => setShowSignModal(null)}>
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '600px',
                        width: '90%'
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '8px', margin: '0 0 8px 0' }}>
                            Firmar Documento
                        </h4>
                        <p style={{ fontSize: '13px', color: '#8492a6', marginBottom: '20px', margin: '0 0 20px 0' }}>
                            {showSignModal.name}
                        </p>
                        <SignatureCanvas
                            onSave={(signature) => handleSign(showSignModal.id, signature)}
                            onCancel={() => setShowSignModal(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
