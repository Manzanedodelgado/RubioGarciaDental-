import { UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import prisma from '../src/lib/prisma'

async function main() {
    console.log('🌱 Seeding database...')

    // Crear usuarios (doctores y equipo)
    const password = await hash('190582', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'info@rubiogarciadental.com' },
        update: {},
        create: {
            email: 'info@rubiogarciadental.com',
            name: 'Juan Antonio Manzanedo',
            password,
            role: UserRole.ADMIN,
            active: true,
        },
    })

    // Usuario JMD para login rápido
    const jmd = await prisma.user.upsert({
        where: { email: 'jmd@rubiogarciadental.com' },
        update: {},
        create: {
            email: 'jmd@rubiogarciadental.com',
            name: 'JMD',
            password,
            role: UserRole.ADMIN,
            active: true,
        },
    })

    const drMario = await prisma.user.upsert({
        where: { email: 'mario.rubio@rubiogarciadental.com' },
        update: {},
        create: {
            email: 'mario.rubio@rubiogarciadental.com',
            name: 'Dr. Mario Rubio García',
            password,
            role: UserRole.DOCTOR,
            active: true,
        },
    })

    const draVirginia = await prisma.user.upsert({
        where: { email: 'virginia.tresgallo@rubiogarciadental.com' },
        update: {},
        create: {
            email: 'virginia.tresgallo@rubiogarciadental.com',
            name: 'Dra. Virginia Tresgallo',
            password,
            role: UserRole.DOCTOR,
            active: true,
        },
    })

    const draIrene = await prisma.user.upsert({
        where: { email: 'irene.garcia@rubiogarciadental.com' },
        update: {},
        create: {
            email: 'irene.garcia@rubiogarciadental.com',
            name: 'Dra. Irene García',
            password,
            role: UserRole.DOCTOR,
            active: true,
        },
    })

    const tcJuan = await prisma.user.upsert({
        where: { email: 'juan.manzanedo@rubiogarciadental.com' },
        update: {},
        create: {
            email: 'juan.manzanedo@rubiogarciadental.com',
            name: 'Tc. Juan Antonio Manzanedo',
            password,
            role: UserRole.HYGIENIST,
            active: true,
        },
    })

    console.log('✅ Usuarios creados:', {
        admin: admin.email,
        jmd: jmd.email,
        drMario: drMario.email,
        draVirginia: draVirginia.email,
        draIrene: draIrene.email,
        tcJuan: tcJuan.email,
    })

    // Crear horarios de doctores
    await prisma.doctorSchedule.createMany({
        data: [
            // Dr. Mario - Miércoles 10:00-14:00 y 16:00-20:00
            {
                doctorId: drMario.id,
                dayOfWeek: 3, // Wednesday
                startTime: '10:00',
                endTime: '14:00',
            },
            {
                doctorId: drMario.id,
                dayOfWeek: 3,
                startTime: '16:00',
                endTime: '20:00',
            },
            // Dra. Virginia - Lunes 10:00-14:00 y 16:00-20:00
            {
                doctorId: draVirginia.id,
                dayOfWeek: 1, // Monday
                startTime: '10:00',
                endTime: '14:00',
            },
            {
                doctorId: draVirginia.id,
                dayOfWeek: 1,
                startTime: '16:00',
                endTime: '20:00',
            },
            // Dra. Irene - Martes 10:00-14:00 y 16:00-20:00
            {
                doctorId: draIrene.id,
                dayOfWeek: 2, // Tuesday
                startTime: '10:00',
                endTime: '14:00',
            },
            {
                doctorId: draIrene.id,
                dayOfWeek: 2,
                startTime: '16:00',
                endTime: '20:00',
            },
            // Tc. Juan - Jueves 10:00-14:00
            {
                doctorId: tcJuan.id,
                dayOfWeek: 4, // Thursday
                startTime: '10:00',
                endTime: '14:00',
            },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Horarios de doctores creados')

    // Crear métodos de pago
    await prisma.paymentMethod.createMany({
        data: [
            { name: 'Efectivo' },
            { name: 'Tarjeta' },
            { name: 'Transferencia' },
            { name: 'Bizum' },
            { name: 'Financiación' },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Métodos de pago creados')

    // Crear precios de tratamientos
    await prisma.treatmentPrice.createMany({
        data: [
            {
                name: 'Limpieza dental',
                description: 'Higiene bucodental completa',
                price: 60.0,
            },
            {
                name: 'Blanqueamiento dental',
                description: 'Tratamiento de blanqueamiento',
                price: 250.0,
            },
            {
                name: 'Empaste',
                description: 'Empaste de composite',
                price: 80.0,
            },
            {
                name: 'Extracción simple',
                description: 'Extracción dental simple',
                price: 90.0,
            },
            {
                name: 'Endodoncia',
                description: 'Tratamiento de conducto',
                price: 350.0,
            },
            {
                name: 'Corona dental',
                description: 'Corona de porcelana',
                price: 600.0,
            },
            {
                name: 'Implante dental',
                description: 'Implante con corona',
                price: 1500.0,
            },
            {
                name: 'Ortodoncia (mensualidad)',
                description: 'Cuota mensual de ortodoncia',
                price: 150.0,
            },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Precios de tratamientos creados')

    // Crear configuración de la clínica
    await prisma.setting.createMany({
        data: [
            {
                key: 'CLINIC_NAME',
                value: 'Rubio García Dental',
                group: 'clinic',
            },
            {
                key: 'CLINIC_PHONE_1',
                value: '916 410 841',
                group: 'clinic',
            },
            {
                key: 'CLINIC_PHONE_2',
                value: '664 218 253',
                group: 'clinic',
            },
            {
                key: 'CLINIC_EMAIL',
                value: 'info@rubiogarciadental.com',
                group: 'clinic',
            },
            {
                key: 'AI_ENABLED',
                value: 'true',
                group: 'ai',
            },
            {
                key: 'WHATSAPP_ENABLED',
                value: 'true',
                group: 'whatsapp',
            },
            {
                key: 'AUTOMATIONS_ENABLED',
                value: 'true',
                group: 'automations',
            },
        ],
        skipDuplicates: true,
    })

    console.log('✅ Configuración de clínica creada')

    console.log('🎉 Seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
