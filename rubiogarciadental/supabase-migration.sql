-- Migración inicial para Rubio García Dental
-- Ejecutar este SQL en Supabase SQL Editor


-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'HYGIENIST');
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "ReminderType" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS');
CREATE TYPE "ReminderStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');
CREATE TYPE "TreatmentStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "AlertType" AS ENUM ('ALLERGY', 'MEDICATION_INTERACTION', 'TREATMENT_WARNING', 'GENERAL');
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "DocumentType" AS ENUM ('LOPD', 'INFORMED_CONSENT', 'TREATMENT_PLAN', 'AUTHORIZATION', 'OTHER');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'CANCELLED');
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');
CREATE TYPE "TemplateType" AS ENUM ('WHATSAPP', 'EMAIL', 'SMS', 'DOCUMENT');
CREATE TYPE "AutomationTrigger" AS ENUM ('APPOINTMENT_24H_BEFORE', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'FIRST_VISIT', 'CUSTOM');

-- CreateTable: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: sessions
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: patients
CREATE TABLE "patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientNumber" TEXT NOT NULL UNIQUE,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dni" TEXT UNIQUE,
    "birthDate" TIMESTAMP(3),
    "phone" TEXT,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "allergies" TEXT NOT NULL,
    "diseases" TEXT NOT NULL,
    "medications" TEXT NOT NULL,
    "communicationPreference" TEXT,
    "lopdSigned" BOOLEAN NOT NULL DEFAULT false,
    "lopdDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: appointments
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "treatment" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: reminders
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "type" "ReminderType" NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" "ReminderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: medical_histories
CREATE TABLE "medical_histories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "odontogram" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: treatments
CREATE TABLE "treatments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicalHistoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TreatmentStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "cost" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: history_photos
CREATE TABLE "history_photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicalHistoryId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: medical_alerts
CREATE TABLE "medical_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicalHistoryId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'MEDIUM',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: signed_documents
CREATE TABLE "signed_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "medicalHistoryId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3),
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: invoices
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL UNIQUE,
    "series" TEXT NOT NULL DEFAULT 'A',
    "patientId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "subtotal" DECIMAL(10,2) NOT NULL,
    "vat" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "qrData" TEXT,
    "hash" TEXT,
    "signatureDate" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "paidAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "sentToAEAT" BOOLEAN NOT NULL DEFAULT false,
    "aeatReference" TEXT,
    "aeatSentAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: invoice_items
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "vat" DECIMAL(5,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL
);

-- CreateTable: whatsapp_messages
CREATE TABLE "whatsapp_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "urgencyReason" TEXT,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: templates
CREATE TABLE "templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: automations
CREATE TABLE "automations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "trigger" "AutomationTrigger" NOT NULL,
    "templateId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: settings
CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable: audit_logs
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable: doctor_schedules
CREATE TABLE "doctor_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable: treatment_prices
CREATE TABLE "treatment_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable: payment_methods
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE INDEX "appointments_patientId_idx" ON "appointments"("patientId");
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");
CREATE INDEX "appointments_startTime_idx" ON "appointments"("startTime");
CREATE INDEX "invoices_patientId_idx" ON "invoices"("patientId");
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");
CREATE INDEX "whatsapp_messages_patientId_idx" ON "whatsapp_messages"("patientId");
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "medical_histories" ADD CONSTRAINT "medical_histories_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "medical_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "history_photos" ADD CONSTRAINT "history_photos_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "medical_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "medical_alerts" ADD CONSTRAINT "medical_alerts_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "medical_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "signed_documents" ADD CONSTRAINT "signed_documents_medicalHistoryId_fkey" FOREIGN KEY ("medicalHistoryId") REFERENCES "medical_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "automations" ADD CONSTRAINT "automations_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
