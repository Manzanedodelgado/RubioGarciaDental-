import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/ai/command - Process natural language command
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { command } = body

        // Fetch AI settings
        const settings = await prisma.setting.findMany({
            where: { group: 'ai' }
        })
        const aiConfig = settings.reduce((acc: any, s) => {
            acc[s.key.split('.')[1]] = s.value
            return acc
        }, {})

        // If OpenAI is configured, use it (Mock implementation for now)
        // In a real implementation, we would call OpenAI API here

        console.log('Processing command:', command)

        // Simple rule-based intent classification for demo purposes
        // This ensures it works even without a valid API key immediately
        const lowerCommand = command.toLowerCase()

        let response = {
            action: 'UNKNOWN',
            message: 'No he entendido el comando.',
            data: null as any
        }

        if (lowerCommand.includes('paciente') || lowerCommand.includes('buscar')) {
            response = {
                action: 'NAVIGATE',
                message: 'Yendo a pacientes...',
                data: { url: '/dashboard/pacientes' }
            }
        } else if (lowerCommand.includes('agenda') || lowerCommand.includes('cita')) {
            response = {
                action: 'NAVIGATE',
                message: 'Abriendo la agenda...',
                data: { url: '/dashboard/agenda' }
            }
        } else if (lowerCommand.includes('factura') || lowerCommand.includes('cobrar')) {
            response = {
                action: 'NAVIGATE',
                message: 'Yendo a facturación...',
                data: { url: '/dashboard/gestion' }
            }
        } else if (lowerCommand.includes('configuracion') || lowerCommand.includes('ajustes')) {
            response = {
                action: 'NAVIGATE',
                message: 'Abriendo configuración...',
                data: { url: '/dashboard/config' }
            }
        } else if (lowerCommand.includes('crear cita') || lowerCommand.includes('nueva cita')) {
            response = {
                action: 'OPEN_MODAL',
                message: 'Abriendo formulario de cita...',
                data: { modal: 'appointment' }
            }
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error('Error processing AI command:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
