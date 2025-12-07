import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/treatment-prices - Get all treatment prices
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const prices = await prisma.treatmentPrice.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(prices)
    } catch (error) {
        console.error('Error fetching treatment prices:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
