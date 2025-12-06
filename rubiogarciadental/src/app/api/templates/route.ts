import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/templates - Get all templates
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')

        const where: any = {}
        if (type) {
            where.type = type
        }

        const templates = await prisma.template.findMany({
            where,
            include: {
                automations: {
                    select: {
                        id: true,
                        name: true,
                        active: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(templates)
    } catch (error) {
        console.error('Error fetching templates:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/templates - Create template
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const template = await prisma.template.create({
            data: {
                name: body.name,
                type: body.type,
                content: body.content,
                isActive: body.isActive ?? true
            }
        })

        return NextResponse.json(template, { status: 201 })
    } catch (error) {
        console.error('Error creating template:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
