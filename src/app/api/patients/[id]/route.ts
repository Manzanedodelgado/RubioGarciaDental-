import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/patients/[id] - Get single patient
// GET /api/patients/[id] - Get single patient
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const patient = await prisma.patient.findUnique({
            where: { id },
            include: {
                appointments: {
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    },
                    orderBy: {
                        startTime: 'desc'
                    }
                },
                invoices: {
                    orderBy: {
                        issueDate: 'desc'
                    }
                },
                medicalHistory: {
                    include: {
                        treatments: true,
                        photos: true,
                        alerts: true,
                        documents: true
                    }
                }
            }
        })

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
        }

        return NextResponse.json(patient)
    } catch (error) {
        console.error('Error fetching patient:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/patients/[id] - Update patient
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const patient = await prisma.patient.update({
            where: { id },
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                dni: body.dni,
                birthDate: body.birthDate ? new Date(body.birthDate) : null,
                phone: body.phone,
                mobile: body.mobile,
                email: body.email,
                address: body.address,
                allergies: body.allergies,
                diseases: body.diseases,
                medications: body.medications,
                communicationPreference: body.communicationPreference,
            }
        })

        return NextResponse.json(patient)
    } catch (error) {
        console.error('Error updating patient:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/patients/[id] - Delete patient
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.patient.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Patient deleted successfully' })
    } catch (error) {
        console.error('Error deleting patient:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
