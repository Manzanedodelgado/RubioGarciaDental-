import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/medical-history/[patientId]/alerts - Create alert
// POST /api/medical-history/[patientId]/alerts - Create alert
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

        const alert = await prisma.medicalAlert.create({
            data: {
                medicalHistoryId: medicalHistory.id,
                type: body.type,
                message: body.message,
                severity: body.severity || 'MEDIUM',
                resolved: false
            }
        })

        return NextResponse.json(alert, { status: 201 })
    } catch (error) {
        console.error('Error creating alert:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
