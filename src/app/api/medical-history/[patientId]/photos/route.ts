import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/medical-history/[patientId]/photos - Upload photo
// POST /api/medical-history/[patientId]/photos - Upload photo
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

        const photo = await prisma.historyPhoto.create({
            data: {
                medicalHistoryId: medicalHistory.id,
                url: body.url,
                description: body.description
            }
        })

        return NextResponse.json(photo, { status: 201 })
    } catch (error) {
        console.error('Error uploading photo:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
