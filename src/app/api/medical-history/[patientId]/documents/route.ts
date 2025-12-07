import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/medical-history/[patientId]/documents - Create signed document
// POST /api/medical-history/[patientId]/documents - Create signed document
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const { patientId } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        let medicalHistory = await prisma.medicalHistory.findFirst({
            where: { patientId }
        })

        if (!medicalHistory) {
            medicalHistory = await prisma.medicalHistory.create({
                data: { patientId }
            })
        }

        const document = await prisma.signedDocument.create({
            data: {
                medicalHistoryId: medicalHistory.id,
                type: body.type,
                name: body.name,
                url: body.url || '',
                isSigned: body.isSigned || false,
                signedAt: body.signedAt ? new Date(body.signedAt) : null
            }
        })

        return NextResponse.json(document, { status: 201 })
    } catch (error) {
        console.error('Error creating document:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
