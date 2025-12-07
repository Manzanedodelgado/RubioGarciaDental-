import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/automations/[id] - Update automation
// PATCH /api/automations/[id] - Update automation
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

        const automation = await prisma.automation.update({
            where: { id },
            data: {
                name: body.name,
                trigger: body.trigger,
                templateId: body.templateId,
                active: body.active,
                conditions: body.conditions
            },
            include: {
                template: true
            }
        })

        return NextResponse.json(automation)
    } catch (error) {
        console.error('Error updating automation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/automations/[id] - Delete automation
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.automation.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Automation deleted successfully' })
    } catch (error) {
        console.error('Error deleting automation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
