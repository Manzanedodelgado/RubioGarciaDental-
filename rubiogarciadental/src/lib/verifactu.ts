import crypto from 'crypto';

interface InvoiceHashData {
    issuerNif: string;
    invoiceNumber: string;
    issueDate: string; // YYYY-MM-DD
    amount: string; // Total amount with 2 decimals
    previousHash: string;
}

/**
 * Generates a SHA-256 hash for Verifactu compliance (simplified chain).
 * The chain links the current invoice with the previous one to ensure integrity.
 */
export function generateInvoiceHash(data: InvoiceHashData): string {
    // Format: NIF + InvoiceNumber + Date + Amount + PreviousHash
    const chainString = `${data.issuerNif}${data.invoiceNumber}${data.issueDate}${data.amount}${data.previousHash}`;

    return crypto
        .createHash('sha256')
        .update(chainString)
        .digest('hex')
        .toUpperCase();
}

/**
 * Generates the QR content string for Verifactu.
 * This is a simplified version. Real Verifactu requires specific URL and parameters.
 */
export function generateVerifactuQRString(
    baseUrl: string,
    nif: string,
    invoiceNumber: string,
    date: string,
    amount: string,
    hash: string
): string {
    // Example format: https://www2.agenciatributaria.gob.es/vl1234?nif=...&num=...&date=...&amount=...&hash=...
    return `${baseUrl}?nif=${nif}&num=${invoiceNumber}&date=${date}&amount=${amount}&hash=${hash}`;
}
