import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function usePatients(search?: string) {
    const url = search ? `/api/patients?search=${encodeURIComponent(search)}` : '/api/patients'
    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        patients: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useAppointments(params?: { date?: string; doctorId?: string; status?: string }) {
    let url = '/api/appointments'
    if (params) {
        const queryParams = new URLSearchParams()
        if (params.date) queryParams.append('date', params.date)
        if (params.doctorId) queryParams.append('doctorId', params.doctorId)
        if (params.status) queryParams.append('status', params.status)
        url += `?${queryParams.toString()}`
    }

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        appointments: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useInvoices(params?: { status?: string; patientId?: string }) {
    let url = '/api/invoices'
    if (params) {
        const queryParams = new URLSearchParams()
        if (params.status) queryParams.append('status', params.status)
        if (params.patientId) queryParams.append('patientId', params.patientId)
        url += `?${queryParams.toString()}`
    }

    const { data, error, isLoading, mutate } = useSWR(url, fetcher)

    return {
        invoices: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useWhatsAppMessages(patientId?: string) {
    const url = patientId ? `/api/whatsapp/messages?patientId=${patientId}` : '/api/whatsapp/messages'
    const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
        refreshInterval: 5000 // Poll every 5 seconds
    })

    return {
        messages: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useUsers() {
    const { data, error, isLoading, mutate } = useSWR('/api/users', fetcher)

    return {
        users: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useSettings() {
    const { data, error, isLoading, mutate } = useSWR('/api/settings', fetcher)

    return {
        settings: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useTreatmentPrices() {
    const { data, error, isLoading, mutate } = useSWR('/api/treatment-prices', fetcher)

    return {
        prices: data,
        isLoading,
        isError: error,
        mutate
    }
}

// Mutation helpers
export async function createPatient(data: any) {
    const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create patient')
    return res.json()
}

export async function updatePatient(id: string, data: any) {
    const res = await fetch(`/api/patients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update patient')
    return res.json()
}

export async function deletePatient(id: string) {
    const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete patient')
    return res.json()
}

export async function createAppointment(data: any) {
    const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create appointment')
    return res.json()
}

export async function updateAppointment(id: string, data: any) {
    const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update appointment')
    return res.json()
}

export async function deleteAppointment(id: string) {
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete appointment')
    return res.json()
}

export async function sendWhatsAppMessage(data: any) {
    const res = await fetch('/api/whatsapp/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to send message')
    return res.json()
}

export async function createInvoice(data: any) {
    const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create invoice')
    return res.json()
}

export async function createUser(data: any) {
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create user')
    return res.json()
}

export async function updateUser(id: string, data: any) {
    const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update user')
    return res.json()
}

export async function deleteUser(id: string) {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete user')
    return res.json()
}

export async function updateSettings(data: any) {
    const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update settings')
    return res.json()
}

// Dashboard stats
export function useStats() {
    const { data, error, isLoading, mutate } = useSWR('/api/stats', fetcher, {
        refreshInterval: 30000 // Refresh every 30 seconds
    })

    return {
        stats: data,
        isLoading,
        isError: error,
        mutate
    }
}

// Doctors (users with DOCTOR role)
export function useDoctors() {
    const { data, error, isLoading } = useSWR('/api/users', fetcher)

    return {
        doctors: data?.filter((u: any) => u.role === 'DOCTOR') || [],
        isLoading,
        isError: error
    }
}

// Medical History
export async function getMedicalHistory(patientId: string) {
    const res = await fetch(`/api/medical-history/${patientId}`)
    if (!res.ok) throw new Error('Failed to fetch medical history')
    return res.json()
}

export async function updateOdontogram(patientId: string, odontogram: any) {
    const res = await fetch(`/api/medical-history/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odontogram })
    })
    if (!res.ok) throw new Error('Failed to update odontogram')
    return res.json()
}

export async function createTreatment(patientId: string, data: any) {
    const res = await fetch(`/api/medical-history/${patientId}/treatments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create treatment')
    return res.json()
}

export async function updateTreatment(id: string, data: any) {
    const res = await fetch(`/api/medical-history/treatments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update treatment')
    return res.json()
}

export async function deleteTreatment(id: string) {
    const res = await fetch(`/api/medical-history/treatments/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete treatment')
    return res.json()
}

export async function createAlert(patientId: string, data: any) {
    const res = await fetch(`/api/medical-history/${patientId}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create alert')
    return res.json()
}

export async function resolveAlert(id: string) {
    const res = await fetch(`/api/medical-history/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: true })
    })
    if (!res.ok) throw new Error('Failed to resolve alert')
    return res.json()
}

export async function uploadPhoto(patientId: string, data: any) {
    const res = await fetch(`/api/medical-history/${patientId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to upload photo')
    return res.json()
}

export async function createDocument(patientId: string, data: any) {
    const res = await fetch(`/api/medical-history/${patientId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create document')
    return res.json()
}

export async function signDocument(id: string, signature: string) {
    const res = await fetch(`/api/medical-history/documents/${id}/sign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature })
    })
    if (!res.ok) throw new Error('Failed to sign document')
    return res.json()
}

// Templates & Automatizaciones
export async function createTemplate(data: any) {
    const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create template')
    return res.json()
}

export async function updateTemplate(id: string, data: any) {
    const res = await fetch(`/api/templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update template')
    return res.json()
}

export async function deleteTemplate(id: string) {
    const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete template')
    return res.json()
}

export async function createAutomation(data: any) {
    const res = await fetch('/api/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to create automation')
    return res.json()
}

export async function updateAutomation(id: string, data: any) {
    const res = await fetch(`/api/automations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error('Failed to update automation')
    return res.json()
}

export async function deleteAutomation(id: string) {
    const res = await fetch(`/api/automations/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete automation')
    return res.json()
}

export async function executeAutomation(automationId: string, context: any) {
    const res = await fetch('/api/automations/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automationId, context })
    })
    if (!res.ok) throw new Error('Failed to execute automation')
    return res.json()
}
