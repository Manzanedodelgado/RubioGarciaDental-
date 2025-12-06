import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/medical-history/[id] - Get medical history by patient ID
// GET /api/medical-history/[id] - Get medical history by patient ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const { patientId } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let medicalHistory = await prisma.medicalHistory.findFirst({
            where: { patientId },
            include: {
                treatments: {
                    orderBy: { createdAt: 'desc' }
                },
                photos: {
                    orderBy: { uploadedAt: 'desc' }
                },
                alerts: {
                    where: { resolved: false },
                    orderBy: { createdAt: 'desc' }
                },
                documents: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        // Create if doesn't exist
        if (!medicalHistory) {
            medicalHistory = await prisma.medicalHistory.create({
                data: {
                    patientId
                },
                include: {
                    treatments: true,
                    photos: true,
                    alerts: true,
                    documents: true
                }
            })
        }

        return NextResponse.json(medicalHistory)
    } catch (error) {
        console.error('Error fetching medical history:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/medical-history/[id] - Update odontogram
export async function PATCH(
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

        const medicalHistory = await prisma.medicalHistory.updateMany({
            where: { patientId },
            data: {
                odontogram: body.odontogram
            }
        })

        return NextResponse.json(medicalHistory)
    } catch (error) {
        console.error('Error updating medical history:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
