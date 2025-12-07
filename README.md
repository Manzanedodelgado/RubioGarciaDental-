# Sistema de Gestión Integral - Rubio García Dental

Sistema completo de gestión dental desarrollado con Next.js 14, TypeScript, y Prisma.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: PostgreSQL 16+ con Prisma ORM
- **Auth**: NextAuth.js con JWT
- **State**: Zustand + React Query
- **Forms**: React Hook Form + Zod

## 📋 Requisitos

- Node.js 20 LTS o superior
- PostgreSQL 16+ (local o en la nube)
- npm o yarn

## 🛠️ Setup Inicial

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Copiar `.env.local` y configurar las variables necesarias.

Importante: Configurar `DATABASE_URL` con tu base de datos PostgreSQL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/rubiogarciadental?schema=public"
```

3. **Generar cliente Prisma:**
```bash
npm run prisma:generate
```

4. **Crear base de datos y ejecutar migraciones:**
```bash
npm run prisma:migrate
```

5. **Poblar base de datos con datos iniciales (seed):**
```bash
npm run prisma:seed
```

Este comando crea:
- 5 usuarios (Admin + 4 doctores del equipo médico)
- Horarios de cada doctor
- Métodos de pago (Efectivo, Tarjeta, Transferencia, Bizum, Financiación)
- Precios de tratamientos (Limpieza, Blanqueamiento, Empaste, etc.)
- Configuración de clínica

6. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 👥 Usuarios de Prueba

Todos los usuarios tienen la misma contraseña: `190582`

- **Admin**: info@rubiogarciadental.com
- **Dr. Mario Rubio García** (Implantología): mario.rubio@rubiogarciadental.com
- **Dra. Virginia Tresgallo** (Ortodoncia): virginia.tresgallo@rubiogarciadental.com
- **Dra. Irene García** (Endodoncia): irene.garcia@rubiogarciadental.com
- **Tc. Juan Antonio Manzanedo** (Higienista): juan.manzanedo@rubiogarciadental.com

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes  
│   │   └── auth/          # NextAuth.js
│   ├── clinica/           # Módulo Clínica
│   │   ├── agenda/        # Calendar y citas
│   │   ├── pacientes/     # CRUD pacientes
│   │   └── historia/      # Historia clínica
│   ├── gestion/           # Módulo Gestión
│   │   └── facturas/      # Facturación VeriFactu
│   ├── ia/                # Módulo IA
│   │   ├── documentos/    # Templates
│   │   ├── automatizaciones/ # Workflows
│   │   ├── agente/        # Agente IA
│   │   └── voz/           # AI por voz
│   └── config/            # Configuración
│       ├── usuarios/      # Gestión usuarios
│       └── tablas/        # Tablas maestras
├── components/            # Componentes React
├── lib/                   # Librerías y utilidades
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   └── trpc/             # tRPC setup
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── types/                # TypeScript types
└── utils/                # Funciones utilidades

prisma/
├── schema.prisma         # Schema de BD (25+ modelos)
└── seed.ts              # Datos iniciales
```

## 🗄️ Modelos de Base de Datos

- **Users & Auth**: Users, Sessions, Roles (ADMIN, DOCTOR, RECEPTIONIST, HYGIENIST)
- **Patients**: Patients, MedicalHistory, Treatments, Photos, Alerts, SignedDocuments
- **Appointments**: Appointments, Reminders (EMAIL, WHATSAPP, SMS)
- **Invoices**: Invoices, InvoiceItems (VeriFactu compliant)
- **WhatsApp**: WhatsAppMessages (con detección de urgencias IA)
- **IA**: Templates, Automations
- **Configuration**: Settings, AuditLogs, DoctorSchedules, TreatmentPrices, PaymentMethods

## 🚧 Estado de Implementación

✅ **Completado:**
- Setup inicial del proyecto Next.js 14
- Instalación de dependencias (Prisma, NextAuth, tRPC, etc.)
- Schema Prisma completo con 25+ modelos
- Estructura modular de carpetas
- Configuración de Prisma y NextAuth
- Script de seed con datos iniciales

🔄 **Pendiente:**
- Configurar base de datos PostgreSQL
- Ejecutar migraciones
- Implementar módulos (Clínica, Gestión, IA, Config)

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio (explorador de BD)
- `npm run prisma:seed` - Poblar BD con datos iniciales

## 🔐 Seguridad

- Autenticación JWT con NextAuth.js
- Passwords hasheados con bcrypt (12 rounds)
- RBAC (Role-Based Access Control)
- Input validation con Zod
- SQL injection prevention (Prisma ORM)
- XSS protection (React default + CSP headers)

## 📄 Licencia

Privado - Rubio García Dental © 2025
