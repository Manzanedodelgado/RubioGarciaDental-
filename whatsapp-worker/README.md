# WhatsApp Worker for Rubio García Dental

Worker Node.js independiente para gestión WhatsApp con Baileys.

## Características

- ✅ Integración Baileys (WhatsApp Web Multi-Device)
- ✅ Detección de urgencias con OpenAI
- ✅ Auto-respuesta inteligente
- ✅ Webhooks a aplicación principal
- ✅ QR Code para setup sesión

## Setup

```bash
cd whatsapp-worker
npm install
cp .env.example .env
# Editar .env con tus valores
npm run dev
```

## Endpoints

- `GET /health` - Health check
- `GET /qr` - Ver QR para conectar WhatsApp
- `POST /send` - Enviar mensaje (desde main app)

## Deploy to Render

1. Crear nuevo Worker en Render
2. Conectar repositorio
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Agregar variables de entorno

## Flujo

1. Worker recibe mensajes WhatsApp
2. Analiza urgencia con OpenAI
3. Envía webhook a `/api/whatsapp/messages`
4. Auto-responde si es necesario
5. Main app puede enviar mensajes via `POST /send`
