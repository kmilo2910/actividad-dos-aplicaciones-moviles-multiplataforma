'use client';
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatCurrency } from '@/core/formatters/currency';
import { useI18n } from '@/i18n/provider';

export default function DownloadReceipt({ purchase, book }) {
  const title = book?.title || purchase.bookId;
  const { dictionary } = useI18n();
  const t = dictionary.acquisitions;
  function deliverPdf(pdf, fileName) {
    const dataUri = pdf.output('datauristring');
    const data = dataUri.split(',')[1];
    const nativeWebView = typeof window !== 'undefined' && window.ReactNativeWebView;

    if (nativeWebView) {
      nativeWebView.postMessage(
        JSON.stringify({
          type: 'DOWNLOAD_PDF',
          fileName,
          data,
          mimeType: 'application/pdf',
        })
      );
      return;
    }

    pdf.save(fileName);
  }
  function productPdf() {
    const pdf = new jsPDF();
    pdf.setFontSize(24);
    pdf.text('NEXUS UNIVERSIDAD', 20, 25);
    pdf.setFontSize(20);
    pdf.text(title, 20, 55, { maxWidth: 170 });
    pdf.setFontSize(12);
    pdf.text('Material digital de ejemplo', 20, 72);
    pdf.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 20, 105);
    pdf.text('Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 20, 118);
    pdf.text('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', 20, 131);
    deliverPdf(pdf, `nexus-${purchase.bookId}.pdf`);
  }
  function receiptPdf() {
    const pdf = new jsPDF();
    pdf.setFontSize(22);
    pdf.text('NEXUS · COMPROBANTE', 20, 25);
    pdf.setFontSize(12);
    pdf.text(`Producto: ${title}`, 20, 60);
    pdf.text(`Precio: ${formatCurrency(purchase.price)}`, 20, 72);
    pdf.text(`Fecha: ${new Date(purchase.purchasedAt).toLocaleString('es-CO')}`, 20, 84);
    pdf.text(`Referencia: ${purchase.id}`, 20, 96);
    deliverPdf(pdf, `nexus-${purchase.bookId}-comprobante.pdf`);
  }
  return (
    <div className="flex min-w-0 max-w-full flex-col items-start gap-2">
      <button
        onClick={productPdf}
        className="inline-flex min-w-0 max-w-full items-center gap-2 text-left text-sm font-semibold whitespace-normal break-words text-[#1f4f66] hover:underline"
      >
        <FileText size={16} /> {t.downloadBook}
      </button>
      <button
        onClick={receiptPdf}
        className="inline-flex min-w-0 max-w-full items-center gap-2 text-left text-sm font-semibold whitespace-normal break-words text-[#64707d] hover:underline"
      >
        <Download size={16} /> {t.downloadReceipt}
      </button>
    </div>
  );
}
