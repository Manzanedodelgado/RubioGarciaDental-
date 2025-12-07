import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    makeInMemoryStore,
    WAMessage,
    WASocket
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import axios from 'axios'
import QRCode from 'qrcode'
import OpenAI from 'openai'

const APP_URL = process.env.APP_URL || 'http://localhost:3000'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

let sock: WASocket | null = null
let qrCodeData: string | null = null

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['Rubio García Dental', 'Chrome', '1.0.0']
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            qrCodeData = await QRCode.toDataURL(qr)
            console.log('QR Code generated, accessible at /qr endpoint')
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Connection closed, reconnecting:', shouldReconnect)

            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 5000)
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp connected successfully!')
            qrCodeData = null
        }
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0]

        if (!message.key.fromMe && message.message) {
            await handleIncomingMessage(message)
        }
    })
}

async function handleIncomingMessage(message: WAMessage) {
    try {
        const from = message.key.remoteJid || ''
        const text = message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            ''

        if (!text) return

        console.log(`📩 Message from ${from}: ${text}`)

        // Analyze for urgency using OpenAI
        const urgencyAnalysis = await analyzeUrgency(text)

        // Send to main app
        await axios.post(`${APP_URL}/api/whatsapp/messages`, {
            from: process.env.WHATSAPP_NUMBER,
            to: from,
            body: text,
            isUrgent: urgencyAnalysis.isUrgent,
            urgencyReason: urgencyAnalysis.reason,
            status: 'DELIVERED'
        })

        // Auto-respond if needed
        if (urgencyAnalysis.shouldAutoRespond) {
            await sendMessage(from, urgencyAnalysis.response)
        }

    } catch (error) {
        console.error('Error handling message:', error)
    }
}

async function analyzeUrgency(text: string): Promise<{
    isUrgent: boolean
    reason: string | null
    shouldAutoRespond: boolean
    response: string
}> {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `Eres un asistente de clínica dental. Analiza el mensaje del paciente y determina:
1. Si es urgente (dolor intenso, sangrado, emergencia)
2. Razón de urgencia
3. Si debes responder automáticamente
4. Qué responder

Responde SOLO en formato JSON:
{
  "isUrgent": boolean,
  "reason": string | null,
  "shouldAutoRespond": boolean,
  "response": string
}`
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            temperature: 0.3
        })

        const result = JSON.parse(completion.choices[0].message.content || '{}')
        return result
    } catch (error) {
        console.error('Error analyzing urgency:', error)
        return {
            isUrgent: false,
            reason: null,
            shouldAutoRespond: false,
            response: ''
        }
    }
}

async function sendMessage(to: string, text: string) {
    if (!sock) {
        throw new Error('WhatsApp not connected')
    }

    try {
        await sock.sendMessage(to, { text })
        console.log(`✅ Message sent to ${to}`)

        // Save to main app
        await axios.post(`${APP_URL}/api/whatsapp/messages`, {
            from: process.env.WHATSAPP_NUMBER,
            to,
            body: text,
            status: 'SENT'
        })
    } catch (error) {
        console.error('Error sending message:', error)
        throw error
    }
}

export {
    connectToWhatsApp,
    sendMessage,
    qrCodeData
}
