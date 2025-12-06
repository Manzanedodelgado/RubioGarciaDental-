'use client'

import { useState } from 'react'
import { useAppointments, useDoctors, usePatients } from '@/lib/hooks'
import AppointmentForm from '@/components/AppointmentForm'

export default function AgendaPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showCreateModal, setShowCreateModal] = useState(false)

    const { appointments, isLoading, mutate } = useAppointments({})
    const { doctors } = useDoctors()
    const { patients } = usePatients('')

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    const formatDateISO = (date: Date) => date.toISOString().split('T')[0]
    const isSameDay = (date1: Date, date2: Date) => formatDateISO(date1) === formatDateISO(date2)

    const generateCalendar = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const today = new Date()
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
        const days = []

        const prevMonthDays = new Date(year, month, 0).getDate()
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            days.push(
                <div key={`prev-${prevMonthDays - i}`} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#b4bcc8', background: 'transparent' }}>
                    {prevMonthDays - i}
                </div>
            )
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayDate = new Date(year, month, day)
            const dateStr = formatDateISO(currentDayDate)
            const isToday = isSameDay(currentDayDate, today)
            const isSelected = isSameDay(currentDayDate, selectedDate)
            const hasAppointments = appointments?.some((apt: any) => formatDateISO(new Date(apt.startTime)) === dateStr)

            days.push(
                <div
                    key={day}
                    onClick={() => setSelectedDate(currentDayDate)}
                    style={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isToday || isSelected ? '#ffffff' : '#1D1160',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isToday ? 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)' : '#f5f7fa',
                        boxShadow: isToday ? '0 4px 12px rgba(51, 64, 211, 0.3)' : 'none',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        if (!isToday) {
                            e.currentTarget.style.background = '#e8ecf1'
                            e.currentTarget.style.transform = 'scale(1.05)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isToday) {
                            e.currentTarget.style.background = '#f5f7fa'
                            e.currentTarget.style.transform = 'scale(1)'
                        }
                    }}
                >
                    {day}
                    {hasAppointments && (
                        <div style={{
                            position: 'absolute',
                            bottom: '6px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: isToday ? '#ffffff' : '#CFF214'
                        }} />
                    )}
                </div>
            )
        }

        const remainingCells = 42 - days.length
        for (let day = 1; day <= remainingCells; day++) {
            days.push(<div key={`next-${day}`} style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#b4bcc8', background: 'transparent' }}>{day}</div>)
        }

        return days
    }

    const selectedDateStr = formatDateISO(selectedDate)
    const dayAppointments = appointments?.filter((apt: any) => formatDateISO(new Date(apt.startTime)) === selectedDateStr).sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) || []

    return (
        <div>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '16px', fontWeight: '600', color: '#8492a6', marginBottom: 0 }}>Agenda de Citas</h1>
            </div>

            {/* Agenda Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f7fa'
                            e.currentTarget.style.borderColor = '#00C6CC'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff'
                            e.currentTarget.style.borderColor = '#e8ecf1'
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1D1160', minWidth: '200px', textAlign: 'center', margin: 0 }}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ffffff', border: '1px solid #e8ecf1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f5f7fa'
                            e.currentTarget.style.borderColor = '#00C6CC'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff'
                            e.currentTarget.style.borderColor = '#e8ecf1'
                        }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>

                <button onClick={() => setShowCreateModal(true)} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3340D3 0%, #00C6CC 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Nueva Cita
                </button>
            </div>

            {/* Calendar */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid #e8ecf1' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {dayNames.map(day => <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: '700', color: '#8492a6', padding: '12px 0', textTransform: 'uppercase' }}>{day}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {generateCalendar()}
                </div>
            </div>

            {/* Appointments List */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e8ecf1' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1D1160', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e8ecf1' }}>
                    Citas del {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#8492a6' }}>Cargando citas...</div>
                ) : dayAppointments.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#8492a6', padding: '40px', margin: 0 }}>No hay citas programadas para este día</p>
                ) : (
                    dayAppointments.map((apt: any) => (
                        <div key={apt.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '16px',
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '2px solid #e8ecf1',
                            marginBottom: '12px',
                            transition: 'all 0.3s'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#00C6CC'
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 198, 204, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e8ecf1'
                                e.currentTarget.style.boxShadow = 'none'
                            }}>
                            {/* Time Block */}
                            <div style={{
                                minWidth: '80px',
                                textAlign: 'center',
                                padding: '12px',
                                background: 'linear-gradient(135deg, #1D1160 0%, #3340D3 100%)',
                                borderRadius: '10px',
                                color: '#ffffff'
                            }}>
                                <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>
                                    {new Date(apt.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.8, fontWeight: '600' }}>
                                    45 min
                                </div>
                            </div>
                            {/* Details */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1D1160', marginBottom: '4px' }}>
                                    {apt.patient.firstName} {apt.patient.lastName}
                                </div>
                                <div style={{ fontSize: '13px', color: '#8492a6', fontWeight: '500', marginBottom: '6px' }}>
                                    {apt.treatment}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#8492a6' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        {apt.doctor.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                        {apt.patient.mobile}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreateModal && (
                <AppointmentForm
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => { mutate(); setShowCreateModal(false) }}
                    patients={patients || []}
                    doctors={doctors || []}
                />
            )}
        </div>
    )
}
