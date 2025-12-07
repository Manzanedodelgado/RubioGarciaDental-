import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/settings - Get all settings
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const settings = await prisma.setting.findMany({
            orderBy: {
                group: 'asc'
            }
        })

        // Group by category
        const grouped = settings.reduce((acc: any, setting) => {
            if (!acc[setting.group]) {
                acc[setting.group] = {}
            }
            acc[setting.group][setting.key] = setting.value
            return acc
        }, {})

        return NextResponse.json(grouped)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Update or create settings
        const updates = []
        for (const [group, values] of Object.entries(body)) {
            for (const [key, value] of Object.entries(values as any)) {
                updates.push(
                    prisma.setting.upsert({
                        where: { key: `${group}.${key}` },
                        update: { value: value as string },
                        create: {
                            key: `${group}.${key}`,
                            group,
                            value: value as string
                        }
                    })
                )
            }
        }

        await Promise.all(updates)

        return NextResponse.json({ message: 'Settings updated successfully' })
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
