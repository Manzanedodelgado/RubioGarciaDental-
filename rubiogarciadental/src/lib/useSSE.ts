import { useEffect, useState } from 'react'

export interface SSEMessage {
    type: string
    payload: any
    timestamp: number
}

export function useSSE() {
    const [isConnected, setIsConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState<SSEMessage | null>(null)

    useEffect(() => {
        let eventSource: EventSource | null = null

        const connect = () => {
            eventSource = new EventSource('/api/sse')

            eventSource.onopen = () => {
                console.log('SSE Connected')
                setIsConnected(true)
            }

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    setLastMessage({
                        type: data.type,
                        payload: data.payload,
                        timestamp: Date.now()
                    })
                } catch (e) {
                    console.error('Error parsing SSE message:', e)
                }
            }

            eventSource.onerror = (e) => {
                console.error('SSE Error:', e)
                setIsConnected(false)
                eventSource?.close()
                // Retry connection after 5 seconds
                setTimeout(connect, 5000)
            }
        }

        connect()

        return () => {
            eventSource?.close()
        }
    }, [])

    return { isConnected, lastMessage }
}
