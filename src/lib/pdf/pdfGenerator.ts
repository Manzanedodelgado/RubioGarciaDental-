// PDF Generator for Invoices
// Requires: npm install jspdf jspdf-autotable qrcode

interface InvoiceData {
    invoiceNumber: string
    issueDate: string
    patient: {
        firstName: string
        lastName: string
        email: string
        mobile: string
        address?: string
    }
    clinic: {
        name: string
        address: string
        phone: string
        email: string
        nif: string
    }
    items: Array<{
        description: string
        quantity: number
        price: number
        total: number
    }>
    subtotal: number
    tax: number
    total: number
    notes?: string
}

export async function generateInvoicePDF(data: InvoiceData & { signatureDataURL?: string; qrDataURL?: string; }): Promise<Blob> {
    // Use dynamic imports for server-side compatibility
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF()

    // Header with logo placeholder
    doc.setFontSize(20)
    doc.setTextColor(29, 17, 96) // #1D1160
    doc.text(data.clinic.name, 20, 20)

    doc.setFontSize(10)
    doc.setTextColor(132, 146, 166) // #8492a6
    doc.text(`${data.clinic.address}`, 20, 28)
    doc.text(`Tel: ${data.clinic.phone} | Email: ${data.clinic.email}`, 20, 33)
    doc.text(`NIF: ${data.clinic.nif}`, 20, 38)

    // Invoice title and number
    doc.setFontSize(24)
    doc.setTextColor(29, 17, 96)
    doc.text('FACTURA', 150, 20)

    doc.setFontSize(12)
    doc.text(data.invoiceNumber, 150, 28)
    doc.setFontSize(10)
    doc.setTextColor(132, 146, 166)
    doc.text(`Fecha: ${new Date(data.issueDate).toLocaleDateString('es-ES')}`, 150, 33)

    // Patient info
    doc.setFontSize(12)
    doc.setTextColor(29, 17, 96)
    doc.text('Cliente:', 20, 55)

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text(`${data.patient.firstName} ${data.patient.lastName}`, 20, 62)
    doc.text(data.patient.email, 20, 67)
    doc.text(data.patient.mobile, 20, 72)
    if (data.patient.address) {
        doc.text(data.patient.address, 20, 77)
    }

    // Items table
    autoTable(doc, {
        startY: 90,
        head: [['Descripción', 'Cantidad', 'Precio', 'Total']],
        body: data.items.map(item => [
            item.description,
            item.quantity.toString(),
            `${item.price.toFixed(2)}€`,
            `${item.total.toFixed(2)}€`
        ]),
        theme: 'grid',
        headStyles: {
            fillColor: [51, 64, 211], // #3340D3
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10
        }
    })

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY || 150

    doc.setFontSize(10)
    doc.text('Subtotal:', 130, finalY + 10)
    doc.text(`${data.subtotal.toFixed(2)}€`, 180, finalY + 10, { align: 'right' })

    doc.text(`IVA (${((data.tax / data.subtotal) * 100).toFixed(0)}%):`, 130, finalY + 17)
    doc.text(`${data.tax.toFixed(2)}€`, 180, finalY + 17, { align: 'right' })

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 198, 204) // #00C6CC
    doc.text('TOTAL:', 130, finalY + 27)
    doc.text(`${data.total.toFixed(2)}€`, 180, finalY + 27, { align: 'right' })

    // Notes
    if (data.notes) {
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(132, 146, 166)
        doc.text('Notas:', 20, finalY + 40)
        doc.text(data.notes, 20, finalY + 47, { maxWidth: 170 })
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(180, 180, 180)
    doc.text('Documento generado electrónicamente', 105, 285, { align: 'center' })

    // Embed QR code if provided
    if (data.qrDataURL) {
        // Add QR at bottom left
        doc.addImage(data.qrDataURL, 'PNG', 15, 260, 30, 30)
    }
    // Embed signature if provided
    if (data.signatureDataURL) {
        // Add signature at bottom right
        doc.addImage(data.signatureDataURL, 'PNG', 165, 260, 30, 30)
    }

    return doc.output('blob')
}

export async function downloadInvoicePDF(invoiceId: string) {
    try {
        // Fetch invoice data from API
        const response = await fetch(`/api/invoices/${invoiceId}`)
        const invoice = await response.json()

        // Generate PDF
        const pdfBlob = await generateInvoicePDF({
            invoiceNumber: invoice.invoiceNumber,
            issueDate: invoice.issueDate,
            patient: invoice.patient,
            clinic: {
                name: 'Rubio García Dental',
                address: 'Calle Principal 123, Madrid',
                phone: '+34 912 345 678',
                email: 'info@rubiogarciadental.com',
                nif: 'B12345678'
            },
            items: invoice.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                price: Number(item.price),
                total: Number(item.total)
            })),
            subtotal: Number(invoice.subtotal),
            tax: Number(invoice.tax),
            total: Number(invoice.total),
            notes: invoice.notes
        })

        // Download
        const url = URL.createObjectURL(pdfBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Factura_${invoice.invoiceNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error generating PDF:', error)
        throw error
    }
}
