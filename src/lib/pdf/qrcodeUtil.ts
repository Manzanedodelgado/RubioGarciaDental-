// QR Code utility for PDF generation
// Requires: npm install qrcode

export async function generateQRCodeDataURL(text: string): Promise<string> {
    const QRCode = await import('qrcode');
    // Generate a Data URL (PNG) for the given text
    return QRCode.default.toDataURL(text);
}
