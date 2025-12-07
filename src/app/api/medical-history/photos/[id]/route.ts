import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

//DELETE /api/medical-history/photos/[id] - Delete photo
//DELETE /api/medical-history/photos/[id] - Delete photo
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

        await prisma.historyPhoto.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Photo deleted successfully' })
    } catch (error) {
        console.error('Error deleting photo:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
