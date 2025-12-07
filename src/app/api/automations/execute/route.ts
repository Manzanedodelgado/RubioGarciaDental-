import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/automations/execute - Manual trigger automation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { automationId, context } = body

        const automation = await prisma.automation.findUnique({
            where: { id: automationId },
            include: {
                template: true
            }
        })

        if (!automation) {
            return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
        }

        if (!automation.active) {
            return NextResponse.json({ error: 'Automation is not active' }, { status: 400 })
        }

        // Replace variables in template
        let content = automation.template.content
        Object.entries(context).forEach(([key, value]: [string, any]) => {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
        })

        // Execute based on template type
        let result: any = {}

        if (automation.template.type === 'WHATSAPP') {
            // Create WhatsApp message
            result = await prisma.whatsAppMessage.create({
                data: {
                    from: process.env.WHATSAPP_NUMBER || '',
                    to: context.phone || '',
                    body: content,
                    status: 'PENDING',
                    patientId: context.patientId || null
                }
            })
        } else if (automation.template.type === 'EMAIL') {
            // TODO: Send email via Resend
            result = { type: 'email', sent: true, to: context.email }
        }

        return NextResponse.json({
            success: true,
            automation: automation.name,
            result
        })
    } catch (error) {
        console.error('Error executing automation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
