// API route to generate PDF documents (invoice, etc.) with optional QR and signature
// Path: src/app/api/documents/generate/route.ts

import { NextResponse } from 'next/server';
import { generateInvoicePDF } from '@/lib/pdf/pdfGenerator';

// Expected payload structure
interface GeneratePDFRequest {
    invoiceData: any; // will be validated loosely; should match InvoiceData shape
    signatureDataURL?: string; // base64 PNG data URL from SignatureCanvas
    qrDataURL?: string; // base64 PNG data URL from QR utility
}

export async function POST(request: Request) {
    try {
        const body: GeneratePDFRequest = await request.json();
        const { invoiceData, signatureDataURL, qrDataURL } = body;

        if (!invoiceData) {
            return NextResponse.json({ error: 'invoiceData is required' }, { status: 400 });
        }

        // Merge optional fields into the data object expected by generateInvoicePDF
        const pdfBlob = await generateInvoicePDF({
            ...invoiceData,
            signatureDataURL,
            qrDataURL,
        });

        // Convert Blob to ArrayBuffer for response
        const arrayBuffer = await pdfBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        return new NextResponse(uint8Array, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                // Suggest a filename; client can override
                'Content-Disposition': `attachment; filename="document.pdf"`,
            },
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
