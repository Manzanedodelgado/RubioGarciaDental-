import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/patients - Get all patients
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''

        const patients = await prisma.patient.findMany({
            where: search ? {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search } },
                    { mobile: { contains: search } },
                ]
            } : {},
            include: {
                appointments: {
                    select: {
                        id: true,
                        startTime: true,
                        status: true
                    }
                },
                invoices: {
                    select: {
                        id: true,
                        total: true,
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(patients)
    } catch (error) {
        console.error('Error fetching patients:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/patients - Create new patient
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Generate patient number
        const lastPatient = await prisma.patient.findFirst({
            orderBy: { patientNumber: 'desc' }
        })

        let nextNumber = 1
        if (lastPatient) {
            const lastNumber = parseInt(lastPatient.patientNumber.split('-')[1])
            nextNumber = lastNumber + 1
        }

        const patientNumber = `P-${nextNumber.toString().padStart(4, '0')}`

        const patient = await prisma.patient.create({
            data: {
                patientNumber,
                firstName: body.firstName,
                lastName: body.lastName,
                dni: body.dni,
                birthDate: body.birthDate ? new Date(body.birthDate) : null,
                phone: body.phone,
                mobile: body.mobile,
                email: body.email,
                address: body.address,
                allergies: body.allergies || '',
                diseases: body.diseases || '',
                medications: body.medications || '',
                communicationPreference: body.communicationPreference || 'WHATSAPP',
                lopdSigned: body.lopdSigned || false,
                lopdDate: body.lopdDate ? new Date(body.lopdDate) : null,
            }
        })

        return NextResponse.json(patient, { status: 201 })
    } catch (error) {
        console.error('Error creating patient:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
