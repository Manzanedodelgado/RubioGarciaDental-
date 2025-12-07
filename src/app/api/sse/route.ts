import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory store for clients (Note: This resets on server restart/lambda cold start)
// For production, use Redis or a proper Pub/Sub service.
// But for this demo/local dev, this works for showing the concept.
let clients: Set<ReadableStreamDefaultController> = new Set()

export async function GET(request: NextRequest) {
    const stream = new ReadableStream({
        start(controller) {
            clients.add(controller)

            // Send initial connection message
            const data = JSON.stringify({ type: 'CONNECTED', message: 'SSE Connected' })
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))

            // Keep-alive interval
            const interval = setInterval(() => {
                try {
                    controller.enqueue(new TextEncoder().encode(': keep-alive\n\n'))
                } catch (e) {
                    clearInterval(interval)
                    clients.delete(controller)
                }
            }, 15000)

            request.signal.addEventListener('abort', () => {
                clearInterval(interval)
                clients.delete(controller)
            })
        },
        cancel(controller) {
            clients.delete(controller)
        }
    })

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    })
}

// Helper to broadcast messages (to be used by other API routes)
// Note: In Next.js App Router, sharing state between route handlers is tricky in serverless.
// This works in "next dev" usually, but for production, we need an external trigger.
// For this demo, we'll expose a POST endpoint to trigger notifications.
export async function POST(request: NextRequest) {
    const body = await request.json()
    const { type, payload } = body

    const message = JSON.stringify({ type, payload })
    const encoded = new TextEncoder().encode(`data: ${message}\n\n`)

    clients.forEach(client => {
        try {
            client.enqueue(encoded)
        } catch (e) {
            clients.delete(client)
        }
    })

    return NextResponse.json({ success: true, clients: clients.size })
}
