# Guía de Despliegue - Sistema Rubio García Dental

El sistema está listo para ser desplegado. Aquí tienes dos opciones principales:

## Opción 1: Vercel (Recomendada)

Vercel es la plataforma nativa para Next.js y ofrece la mejor experiencia.

1.  **Crear cuenta:** Ve a [vercel.com](https://vercel.com) y crea una cuenta.
2.  **Instalar CLI (Opcional):** `npm i -g vercel`
3.  **Desplegar:**
    *   Ejecuta `vercel` en la terminal dentro de la carpeta del proyecto.
    *   Sigue las instrucciones en pantalla.
4.  **Variables de Entorno:**
    *   En el dashboard de Vercel, ve a **Settings > Environment Variables**.
    *   Copia todas las variables de tu archivo `.env`:
        *   `DATABASE_URL`
        *   `DIRECT_URL`
        *   `NEXTAUTH_SECRET`
        *   `NEXTAUTH_URL` (En producción será tu dominio .vercel.app)
        *   `OPENAI_API_KEY` (Si usas IA)

## Opción 2: Docker (Self-Hosted)

Hemos incluido un `Dockerfile` optimizado para producción.

1.  **Construir imagen:**
    ```bash
    docker build -t rubiogarciadental .
    ```
2.  **Ejecutar contenedor:**
    ```bash
    docker run -p 3000:3000 \
      -e DATABASE_URL="tu_database_url" \
      -e DIRECT_URL="tu_direct_url" \
      -e NEXTAUTH_SECRET="tu_secret" \
      rubiogarciadental
    ```

## Notas Importantes

*   **Base de Datos:** Asegúrate de que tu base de datos (Supabase) acepte conexiones desde la IP de producción (o 0.0.0.0/0 si usas servicios cloud).
*   **WhatsApp Worker:** El servicio de WhatsApp (`whatsapp-worker/`) debe desplegarse por separado (ej. en Render o Railway) ya que es un proceso persistente de Node.js, no una función serverless.
