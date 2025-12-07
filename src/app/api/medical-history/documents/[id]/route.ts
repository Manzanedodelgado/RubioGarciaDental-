import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// DELETE /api/medical-history/documents/[id] - Delete document
// DELETE /api/medical-history/documents/[id] - Delete document
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

        await prisma.signedDocument.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Document deleted successfully' })
    } catch (error) {
        console.error('Error deleting document:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
