import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/stats - Dashboard stats
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        // Today's appointments
        const todayAppointments = await prisma.appointment.findMany({
            where: {
                startTime: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        mobile: true
                    }
                },
                doctor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            },
            take: 10
        })

        // Urgent messages (last 5)
        const urgentMessages = await prisma.whatsAppMessage.findMany({
            where: {
                isUrgent: true,
                readAt: null
            },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                sentAt: 'desc'
            },
            take: 5
        })

        //Total counts
        const [totalPatients, totalAppointmentsThisMonth, totalUnreadMessages] = await Promise.all([
            prisma.patient.count(),
            prisma.appointment.count({
                where: {
                    startTime: {
                        gte: new Date(today.getFullYear(), today.getMonth(), 1)
                    }
                }
            }),
            prisma.whatsAppMessage.count({
                where: {
                    readAt: null
                }
            })
        ])

        return NextResponse.json({
            todayAppointments,
            urgentMessages,
            stats: {
                totalPatients,
                totalAppointmentsThisMonth,
                totalUnreadMessages
            }
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
