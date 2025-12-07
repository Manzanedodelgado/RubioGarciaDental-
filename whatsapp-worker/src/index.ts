import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectToWhatsApp, sendMessage, qrCodeData } from './whatsapp'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get QR code for session setup
app.get('/qr', (req: Request, res: Response) => {
    if (qrCodeData) {
        res.send(`
      <html>
        <body style="display:flex; justify-content:center; align-items:center; height:100vh; flex-direction:column;">
          <h1>Scanea este QR con WhatsApp</h1>
          <img src="${qrCodeData}" alt="QR Code" />
        </body>
      </html>
    `)
    } else {
        res.json({ message: 'WhatsApp already connected or waiting for QR' })
    }
})

// Send message endpoint (called from main app)
app.post('/send', async (req: Request, res: Response) => {
    try {
        const { to, message } = req.body

        if (!to || !message) {
            return res.status(400).json({ error: 'Missing to or message' })
        }

        await sendMessage(to, message)
        res.json({ success: true })
    } catch (error: any) {
        console.error('Error in /send:', error)
        res.status(500).json({ error: error.message })
    }
})

// Start server and connect to WhatsApp
async function start() {
    try {
        console.log('🚀 Starting WhatsApp Worker...')

        // Connect to WhatsApp
        await connectToWhatsApp()

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🟢 Server running on port ${PORT}`)
            console.log(`📱 WhatsApp Worker ready`)
            console.log(`🔗 QR Code available at http://localhost:${PORT}/qr`)
        })
    } catch (error) {
        console.error('Failed to start:', error)
        process.exit(1)
    }
}

start()
