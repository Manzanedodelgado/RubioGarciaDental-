import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/templates/[id] - Update template
// PATCH /api/templates/[id] - Update template
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

        const template = await prisma.template.update({
            where: { id },
            data: {
                name: body.name,
                type: body.type,
                content: body.content,
                isActive: body.isActive
            }
        })

        return NextResponse.json(template)
    } catch (error) {
        console.error('Error updating template:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/templates/[id] - Delete template
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

        await prisma.template.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Template deleted successfully' })
    } catch (error) {
        console.error('Error deleting template:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
