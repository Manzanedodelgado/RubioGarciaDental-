'use client'

import { useState } from 'react'
import { uploadPhoto } from '@/lib/hooks'

interface PhotoGalleryProps {
    photos: any[]
    patientId: string
}

export default function PhotoGallery({ photos: initialPhotos, patientId }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState(initialPhotos)
    const [lightboxPhoto, setLightboxPhoto] = useState<any | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        // In production, upload to cloud storage (S3, Cloudinary, etc)
        const base64 = await convertToBase64(file)

        const photoData = {
            url: base64, // In production, this would be the cloud URL
            description: '',
            takenAt: new Date().toISOString()
        }

        const newPhoto = await uploadPhoto(patientId, photoData)
        setPhotos([newPhoto, ...photos])
        setUploading(false)
    }

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', margin: 0 }}>Galería de Fotos</h3>
                <label style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: uploading ? 'wait' : 'pointer',
                    opacity: uploading ? 0.6 : 1
                }}>
                    {uploading ? 'Subiendo...' : '+ Subir Foto'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            {/* Photo Grid */}
            {photos.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '60px', color: '#8492a6', margin: 0 }}>
                    No hay fotos en la galería
                </p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {photos.map((photo: any) => (
                        <div
                            key={photo.id}
                            onClick={() => setLightboxPhoto(photo)}
                            style={{
                                aspectRatio: '1',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.2s',
                                border: '2px solid #e8ecf1'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 198, 204, 0.3)'
                                e.currentTarget.style.borderColor = '#00C6CC'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = 'none'
                                e.currentTarget.style.borderColor = '#e8ecf1'
                            }}
                        >
                            <img
                                src={photo.url}
                                alt={photo.description || 'Foto clínica'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(29, 17, 96, 0.8) 0%, transparent 100%)',
                                padding: '12px',
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '600'
                            }}>
                                {new Date(photo.takenAt).toLocaleDateString('es-ES')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxPhoto && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3000,
                    padding: '40px'
                }}
                    onClick={() => setLightboxPhoto(null)}>
                    <div style={{
                        maxWidth: '90%',
                        maxHeight: '90%',
                        position: 'relative'
                    }}
                        onClick={(e) => e.stopPropagation()}>
                        <img
                            src={lightboxPhoto.url}
                            alt={lightboxPhoto.description || 'Foto clínica'}
                            style={{
                                maxWidth: '100%',
                                maxHeight: 'calc(100vh - 80px)',
                                borderRadius: '12px',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                            }}
                        />
                        {lightboxPhoto.description && (
                            <div style={{
                                marginTop: '16px',
                                background: '#ffffff',
                                padding: '16px',
                                borderRadius: '8px',
                                color: '#1D1160',
                                fontSize: '14px',
                                fontWeight: '600',
                                textAlign: 'center'
                            }}>
                                {lightboxPhoto.description}
                            </div>
                        )}
                        <button
                            onClick={() => setLightboxPhoto(null)}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '0',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#1D1160',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
