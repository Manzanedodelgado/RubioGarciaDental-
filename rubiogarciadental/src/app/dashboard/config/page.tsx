'use client'

import { useState } from 'react'
import { useUsers, useSettings, useTreatmentPrices, updateSettings } from '@/lib/hooks'
import { useEffect } from 'react'

export default function ConfigPage() {
    const [activeTab, setActiveTab] = useState<'users' | 'clinic' | 'integrations' | 'prices' | 'ai'>('users')

    const { users, isLoading: usersLoading } = useUsers()
    const { settings, isLoading: settingsLoading } = useSettings()
    const { prices, isLoading: pricesLoading } = useTreatmentPrices()

    const [aiConfig, setAiConfig] = useState({
        provider: 'openai',
        apiKey: '',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        voiceEnabled: false
    })

    useEffect(() => {
        if (settings?.ai) {
            setAiConfig({
                provider: settings.ai.provider || 'openai',
                apiKey: settings.ai.apiKey || '',
                model: settings.ai.model || 'gpt-4-turbo',
                temperature: parseFloat(settings.ai.temperature) || 0.7,
                voiceEnabled: settings.ai.voiceEnabled === 'true'
            })
        }
    }, [settings])

    const handleSaveAI = async () => {
        try {
            await updateSettings({
                ai: {
                    ...aiConfig,
                    voiceEnabled: String(aiConfig.voiceEnabled)
                }
            })
            alert('Configuración guardada correctamente')
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('Error al guardar la configuración')
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#8492a6', marginBottom: 0 }}>Configuración</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e8ecf1' }}>
                {[
                    { value: 'users', label: 'Usuarios' },
                    { value: 'clinic', label: 'Clínica' },
                    { value: 'integrations', label: 'Integraciones' },
                    { value: 'prices', label: 'Precios' },
                    { value: 'ai', label: 'Inteligencia Artificial' }
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
                            marginBottom: '-2px'
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>Usuarios del Sistema</h3>
                    {usersLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8492a6' }}>Cargando usuarios...</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '700', color: '#8492a6', textTransform: 'uppercase', borderBottom: '2px solid #e8ecf1' }}>Nombre</th>
                                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '700', color: '#8492a6', textTransform: 'uppercase', borderBottom: '2px solid #e8ecf1' }}>Email</th>
                                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '700', color: '#8492a6', textTransform: 'uppercase', borderBottom: '2px solid #e8ecf1' }}>Rol</th>
                                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '700', color: '#8492a6', textTransform: 'uppercase', borderBottom: '2px solid #e8ecf1' }}>Estado</th>
                                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', fontWeight: '700', color: '#8492a6', textTransform: 'uppercase', borderBottom: '2px solid #e8ecf1' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((user: any) => (
                                    <tr
                                        key={user.id}
                                        style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(90deg, rgba(207, 242, 20, 0.05) 0%, rgba(0, 198, 204, 0.05) 100%)'
                                            e.currentTarget.style.boxShadow = 'inset 3px 0 0 #CFF214'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    >
                                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1D1160', borderBottom: '1px solid #f0f2f5', fontWeight: '600' }}>{user.name}</td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1D1160', borderBottom: '1px solid #f0f2f5' }}>{user.email}</td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1D1160', borderBottom: '1px solid #f0f2f5' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)', color: '#ffffff' }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1D1160', borderBottom: '1px solid #f0f2f5' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: user.active ? '#00C6CC' : '#e8ecf1', boxShadow: user.active ? '0 0 8px rgba(0, 198, 204, 0.6)' : 'none' }} />
                                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#8492a6' }}>{user.active ? 'Activo' : 'Inactivo'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 12px', fontSize: '14px', color: '#1D1160', borderBottom: '1px solid #f0f2f5' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f7fa', border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#e8ecf1'
                                                        e.currentTarget.style.borderColor = '#00C6CC'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#f5f7fa'
                                                        e.currentTarget.style.borderColor = '#e8ecf1'
                                                    }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </div>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f7fa', border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#fee'
                                                        e.currentTarget.style.borderColor = '#c33'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = '#f5f7fa'
                                                        e.currentTarget.style.borderColor = '#e8ecf1'
                                                    }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Clinic Tab */}
            {activeTab === 'clinic' && (
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>Información de la Clínica</h3>
                    {settingsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8492a6' }}>Cargando configuración...</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {settings?.clinic && Object.entries(settings.clinic).map(([key, value]: [string, any]) => (
                                <div key={key}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px', textTransform: 'capitalize' }}>
                                        {key.replace(/_/g, ' ')}
                                    </label>
                                    <input
                                        type="text"
                                        value={value.value}
                                        readOnly
                                        style={{ width: '100%', padding: '14px 16px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', fontWeight: '500', color: '#1D1160', background: '#f5f7fa', fontFamily: 'inherit' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>Integraciones</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {['WhatsApp', 'Email', 'AEAT', 'OpenAI'].map((integration) => (
                            <div key={integration} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fafbfc', borderRadius: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160' }}>{integration}</div>
                                    <div style={{ fontSize: '12px', color: '#8492a6' }}>Integración con {integration}</div>
                                </div>
                                <div style={{ width: '48px', height: '26px', background: '#e8ecf1', borderRadius: '13px', position: 'relative' }}>
                                    <div style={{ width: '20px', height: '20px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Prices Tab */}
            {activeTab === 'prices' && (
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>Precios de Tratamientos</h3>
                    {pricesLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#8492a6' }}>Cargando precios...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {prices?.map((price: any) => (
                                <div key={price.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px',
                                    background: '#fafbfc',
                                    borderRadius: '10px',
                                    borderLeft: '3px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(90deg, rgba(207, 242, 20, 0.05) 0%, rgba(0, 198, 204, 0.05) 100%)'
                                        e.currentTarget.style.borderLeftColor = '#CFF214'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = '#fafbfc'
                                        e.currentTarget.style.borderLeftColor = 'transparent'
                                    }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160', marginBottom: '4px' }}>{price.name}</div>
                                        {price.description && <div style={{ fontSize: '12px', color: '#8492a6' }}>{price.description}</div>}
                                    </div>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#00C6CC', minWidth: '120px', textAlign: 'right' }}>
                                        {Number(price.price).toFixed(2)}€
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            {/* AI Tab */}
            {activeTab === 'ai' && (
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>Configuración de IA y Voz</h3>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>Proveedor de Modelo</label>
                            <select
                                value={aiConfig.provider}
                                onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value })}
                                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f5f7fa', color: '#1D1160' }}
                            >
                                <option value="openai">OpenAI (GPT-4)</option>
                                <option value="anthropic">Anthropic (Claude)</option>
                                <option value="local">Local (Ollama/Llama)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>API Key</label>
                            <input
                                type="password"
                                value={aiConfig.apiKey}
                                onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                                placeholder="sk-..."
                                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f5f7fa', color: '#1D1160' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>Modelo</label>
                            <input
                                type="text"
                                value={aiConfig.model}
                                onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                                placeholder="gpt-4-turbo"
                                style={{ width: '100%', padding: '14px 16px', border: '2px solid #e8ecf1', borderRadius: '10px', fontSize: '14px', background: '#f5f7fa', color: '#1D1160' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1D1160', marginBottom: '8px' }}>Temperatura (Creatividad): {aiConfig.temperature}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={aiConfig.temperature}
                                onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                                style={{ width: '100%', accentColor: '#00C6CC' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8492a6', marginTop: '4px' }}>
                                <span>Preciso (0.0)</span>
                                <span>Creativo (1.0)</span>
                            </div>
                        </div>

                        <div style={{ height: '1px', background: '#e8ecf1', margin: '10px 0' }} />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1D1160' }}>Control por Voz</div>
                                <div style={{ fontSize: '12px', color: '#8492a6' }}>Permitir comandos de voz en el dashboard</div>
                            </div>
                            <div
                                onClick={() => setAiConfig({ ...aiConfig, voiceEnabled: !aiConfig.voiceEnabled })}
                                style={{ width: '48px', height: '26px', background: aiConfig.voiceEnabled ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : '#e8ecf1', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}
                            >
                                <div style={{ width: '20px', height: '20px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '3px', left: aiConfig.voiceEnabled ? '25px' : '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', transition: 'all 0.3s' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e8ecf1', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleSaveAI}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}>
                            Guardar Configuración
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
