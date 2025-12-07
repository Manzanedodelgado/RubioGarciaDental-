import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

//POST /api/medical-history/[patientId]/treatments - Create treatment
//POST /api/medical-history/[patientId]/treatments - Create treatment
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

        // Get or create medical history
        let medicalHistory = await prisma.medicalHistory.findFirst({
            where: { patientId }
        })

        if (!medicalHistory) {
            medicalHistory = await prisma.medicalHistory.create({
                data: { patientId }
            })
        }

        const treatment = await prisma.treatment.create({
            data: {
                medicalHistoryId: medicalHistory.id,
                name: body.name,
                description: body.description,
                status: body.status || 'PLANNED',
                startDate: body.startDate ? new Date(body.startDate) : null,
                endDate: body.endDate ? new Date(body.endDate) : null,
                cost: body.cost
            }
        })

        return NextResponse.json(treatment, { status: 201 })
    } catch (error) {
        console.error('Error creating treatment:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
