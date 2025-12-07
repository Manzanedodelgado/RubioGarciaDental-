import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PATCH /api/medical-history/documents/[id]/sign - Sign document
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { signature } = body

        const document = await prisma.signedDocument.update({
            where: { id },
            data: {
                isSigned: true,
                signedAt: new Date(),
                signature: signature as string // Save the base64 signature
            }
        })

        return NextResponse.json(document)
    } catch (error) {
        console.error('Error signing document:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
