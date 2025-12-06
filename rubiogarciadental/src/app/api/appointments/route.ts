import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/appointments - Get appointments
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const date = searchParams.get('date')
        const doctorId = searchParams.get('doctorId')
        const status = searchParams.get('status')

        const where: any = {}

        if (date) {
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)

            where.startTime = {
                gte: startOfDay,
                lte: endOfDay
            }
        }

        if (doctorId) {
            where.doctorId = doctorId
        }

        if (status) {
            where.status = status
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        })

        return NextResponse.json(appointments)
    } catch (error) {
        console.error('Error fetching appointments:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/appointments - Create appointment
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const appointment = await prisma.appointment.create({
            data: {
                patientId: body.patientId,
                doctorId: body.doctorId,
                startTime: new Date(body.startTime),
                endTime: new Date(body.endTime),
                treatment: body.treatment,
                status: body.status || 'SCHEDULED',
                notes: body.notes
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return NextResponse.json(appointment, { status: 201 })
    } catch (error) {
        console.error('Error creating appointment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
