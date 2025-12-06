'use client'

import { useState } from 'react'
import { useInvoices } from '@/lib/hooks'

export default function GestionPage() {
    const [activeTab, setActiveTab] = useState<'invoices' | 'documents'>('invoices')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const { invoices, isLoading, isError } = useInvoices({ status: statusFilter === 'all' ? undefined : statusFilter })

    const filteredInvoices = statusFilter === 'all' ? invoices : invoices?.filter((inv: any) => inv.status === statusFilter)

    const totalAmount = invoices?.reduce((sum: number, inv: any) => sum + Number(inv.total), 0) || 0
    const paidAmount = invoices?.filter((inv: any) => inv.status === 'PAID').reduce((sum: number, inv: any) => sum + Number(inv.total), 0) || 0
    const pendingAmount = invoices?.filter((inv: any) => inv.status === 'PENDING').reduce((sum: number, inv: any) => sum + Number(inv.total), 0) || 0
    const overdueAmount = invoices?.filter((inv: any) => inv.status === 'OVERDUE').reduce((sum: number, inv: any) => sum + Number(inv.total), 0) || 0

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#8492a6', marginBottom: 0 }}>Gestión y Facturación</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e8ecf1' }}>
                {[
                    { value: 'invoices', label: 'Facturas' },
                    { value: 'documents', label: 'Documentos' }
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
                        onMouseEnter={(e) => {
                            if (activeTab !== tab.value) e.currentTarget.style.color = '#00C6CC'
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== tab.value) e.currentTarget.style.color = '#8492a6'
                        }}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>

            {activeTab === 'invoices' && (
                <>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        {[
                            { value: 'all', label: 'Todas' },
                            { value: 'PAID', label: 'Pagadas' },
                            { value: 'PENDING', label: 'Pendientes' },
                            { value: 'OVERDUE', label: 'Vencidas' }
                        ].map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setStatusFilter(filter.value)}
                                style={{
                                    padding: '8px 16px',
                                    background: statusFilter === filter.value ? '#f5f7fa' : '#ffffff',
                                    border: `1px solid ${statusFilter === filter.value ? '#00C6CC' : '#e8ecf1'}`,
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: '#1D1160',
                                    cursor: 'pointer'
                                }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#8492a6' }}>Cargando facturas...</div>
                    ) : isError ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#ff6b6b' }}>Error al cargar facturas</div>
                    ) : (
                        <>
                            {/* Invoices Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                {filteredInvoices?.map((invoice: any) => {
                                    const statusMap = {
                                        PAID: { bg: '#d4f4dd', text: '#0a5d1a', label: 'Pagada' },
                                        PENDING: { bg: '#fff4cc', text: '#8b6914', label: 'Pendiente' },
                                        OVERDUE: { bg: '#f8d7da', text: '#721c24', label: 'Vencida' }
                                    }
                                    const status = statusMap[invoice.status as keyof typeof statusMap] || statusMap.PENDING

                                    return (
                                        <div key={invoice.id} style={{
                                            background: '#ffffff',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            border: '1px solid #e8ecf1',
                                            transition: 'all 0.2s',
                                            cursor: 'pointer',
                                            position: 'relative'
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
                                            }}>
                                            {/* Esquina decorativa */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: '60px',
                                                height: '60px',
                                                background: 'linear-gradient(135deg, transparent 50%, #CFF214 50%)',
                                                opacity: 0.1,
                                                borderRadius: '0 0 12px 0'
                                            }} />

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160' }}>
                                                    {invoice.invoiceNumber}
                                                </div>
                                                <div style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', background: status.bg, color: status.text }}>
                                                    {status.label}
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '13px', color: '#8492a6', marginBottom: '16px' }}>
                                                {invoice.patient.firstName} {invoice.patient.lastName}
                                            </div>

                                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#00C6CC', textAlign: 'right', marginBottom: '16px' }}>
                                                {Number(invoice.total).toFixed(2)}€
                                            </div>

                                            <div style={{ fontSize: '12px', color: '#8492a6', paddingTop: '16px', borderTop: '1px solid #f0f2f5' }}>
                                                Fecha: {new Date(invoice.issueDate).toLocaleDateString('es-ES')}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Resumen Financiero */}
                            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                                    Resumen Financiero
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                    {[
                                        { label: 'Total Facturado', amount: totalAmount, bg: '#e3f2fd' },
                                        { label: 'Pagado', amount: paidAmount, bg: '#d4f4dd' },
                                        { label: 'Pendiente', amount: pendingAmount, bg: '#fff4cc' },
                                        { label: 'Vencido', amount: overdueAmount, bg: '#f8d7da' }
                                    ].map((item, idx) => (
                                        <div key={idx} style={{ background: item.bg, padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#1D1160', marginBottom: '4px' }}>{item.amount.toFixed(2)}€</div>
                                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#8492a6', textTransform: 'uppercase' }}>{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {activeTab === 'documents' && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#8492a6' }}>
                    Sección de documentos en desarrollo
                </div>
            )}
        </div>
    )
}
