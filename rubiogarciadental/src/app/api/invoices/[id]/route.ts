import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/invoices/[id] - Get a single invoice by ID
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

        const invoice = await prisma.invoice.findUnique({
            where: { id: id },
            include: {
                patient: true,
                items: true,
            },
        })

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
        }

        return NextResponse.json(invoice)
    } catch (error) {
        console.error('Error fetching invoice:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/invoices/[id] - Update invoice status (mark as paid, etc)
// PATCH /api/invoices/[id] - Update invoice status (mark as paid, etc)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const invoice = await prisma.invoice.update({
            where: { id },
            data: {
                status: body.status,
                paidAt: body.status === 'PAID' ? new Date() : null,
                paymentMethod: body.paymentMethod
            },
            include: {
                patient: true,
                items: true
            }
        })

        return NextResponse.json(invoice)
    } catch (error) {
        console.error('Error updating invoice:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/invoices/[id] - Delete invoice
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

        await prisma.invoice.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Invoice deleted successfully' })
    } catch (error) {
        console.error('Error deleting invoice:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
