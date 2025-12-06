import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/medical-history/treatments/[id] - Update treatment
// PATCH /api/medical-history/treatments/[id] - Update treatment
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

        const treatment = await prisma.treatment.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                status: body.status,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
                cost: body.cost
            }
        })

        return NextResponse.json(treatment)
    } catch (error) {
        console.error('Error updating treatment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/medical-history/treatments/[id] - Delete treatment
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

        await prisma.treatment.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Treatment deleted successfully' })
    } catch (error) {
        console.error('Error deleting treatment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
