import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/automations - Get all automations
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const automations = await prisma.automation.findMany({
            include: {
                template: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(automations)
    } catch (error) {
        console.error('Error fetching automations:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/automations - Create automation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const automation = await prisma.automation.create({
            data: {
                name: body.name,
                trigger: body.trigger,
                templateId: body.templateId,
                active: body.active ?? true,
                conditions: body.conditions || null
            },
            include: {
                template: true
            }
        })

        return NextResponse.json(automation, { status: 201 })
    } catch (error) {
        console.error('Error creating automation:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
