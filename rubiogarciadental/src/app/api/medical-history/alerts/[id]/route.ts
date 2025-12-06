import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/medical-history/alerts/[id] - Resolve alert
// PATCH /api/medical-history/alerts/[id] - Resolve alert
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

        const alert = await prisma.medicalAlert.update({
            where: { id },
            data: {
                resolved: body.resolved ?? true
            }
        })

        return NextResponse.json(alert)
    } catch (error) {
        console.error('Error updating alert:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/medical-history/alerts/[id] - Delete alert
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

        await prisma.medicalAlert.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Alert deleted successfully' })
    } catch (error) {
        console.error('Error deleting alert:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
