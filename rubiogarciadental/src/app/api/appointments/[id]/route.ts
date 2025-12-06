import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/appointments/[id] - Update appointment
// PATCH /api/appointments/[id] - Update appointment
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                startTime: body.startTime ? new Date(body.startTime) : undefined,
                endTime: body.endTime ? new Date(body.endTime) : undefined,
                treatment: body.treatment,
                status: body.status,
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

        return NextResponse.json(appointment)
    } catch (error) {
        console.error('Error updating appointment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/appointments/[id] - Delete appointment
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.appointment.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Appointment deleted successfully' })
    } catch (error) {
        console.error('Error deleting appointment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
