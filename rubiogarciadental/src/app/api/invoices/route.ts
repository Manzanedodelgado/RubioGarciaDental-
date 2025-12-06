import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateInvoiceHash } from '@/lib/verifactu'

// GET /api/invoices - Get invoices
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const patientId = searchParams.get('patientId')

        const where: any = {}

        if (status) {
            where.status = status
        }

        if (patientId) {
            where.patientId = patientId
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                items: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                issueDate: 'desc'
            }
        })

        return NextResponse.json(invoices)
    } catch (error) {
        console.error('Error fetching invoices:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/invoices - Create invoice
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Generate invoice number
        const currentYear = new Date().getFullYear()
        const lastInvoice = await prisma.invoice.findFirst({
            where: {
                invoiceNumber: {
                    startsWith: `${currentYear}-`
                }
            },
            orderBy: {
                invoiceNumber: 'desc'
            }
        })

        let nextNumber = 1
        if (lastInvoice) {
            const lastNumber = parseInt(lastInvoice.invoiceNumber.split('-')[1])
            nextNumber = lastNumber + 1
        }

        const invoiceNumber = `${currentYear}-${nextNumber.toString().padStart(4, '0')}`

        // Calculate Verifactu Hash
        const previousHash = lastInvoice?.hash || ''
        // In a real app, fetch NIF from settings. Using default for now.
        const issuerNif = 'B12345678'

        const hash = generateInvoiceHash({
            issuerNif,
            invoiceNumber,
            issueDate: (body.issueDate ? new Date(body.issueDate) : new Date()).toISOString().split('T')[0],
            amount: Number(body.total).toFixed(2),
            previousHash
        })

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                series: body.series || 'A',
                patientId: body.patientId,
                issueDate: body.issueDate ? new Date(body.issueDate) : new Date(),
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                subtotal: body.subtotal,
                vat: body.vat,
                total: body.total,
                status: body.status || 'DRAFT',
                paymentMethod: body.paymentMethod,
                createdById: session.user.id,
                hash, // Verifactu Hash
                items: {
                    create: body.items?.map((item: any) => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        vat: item.vat,
                        total: item.total
                    })) || []
                }
            },
            include: {
                items: true,
                patient: true
            }
        })

        return NextResponse.json(invoice, { status: 201 })
    } catch (error) {
        console.error('Error creating invoice:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
