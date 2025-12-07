import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/whatsapp/messages - Get WhatsApp messages
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const patientId = searchParams.get('patientId')

        const where: any = {}

        if (patientId) {
            where.patientId = patientId
        }

        const messages = await prisma.whatsAppMessage.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        mobile: true
                    }
                }
            },
            orderBy: {
                sentAt: 'desc'
            },
            take: 100
        })

        return NextResponse.json(messages)
    } catch (error) {
        console.error('Error fetching WhatsApp messages:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/whatsapp/messages - Send WhatsApp message
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const message = await prisma.whatsAppMessage.create({
            data: {
                patientId: body.patientId,
                from: body.from,
                to: body.to,
                body: body.body,
                isUrgent: body.isUrgent || false,
                urgencyReason: body.urgencyReason,
                status: 'SENT'
            },
            include: {
                patient: true
            }
        })

        // TODO: Integrate with actual WhatsApp Business API (Baileys/Twilio)

        return NextResponse.json(message, { status: 201 })
    } catch (error) {
        console.error('Error sending WhatsApp message:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
