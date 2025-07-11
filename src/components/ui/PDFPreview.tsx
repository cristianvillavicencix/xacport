import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, X, Printer } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import AnimatedCard from './AnimatedCard';
import LoadingButton from './LoadingButton';

interface PDFPreviewProps {
  formData: any;
  onClose: () => void;
  onDownload?: () => void;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ formData, onClose, onDownload }) => {
  const { t } = useLanguage();
  const { showSuccess } = useToast();
  const [isGenerating, setIsGenerating] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  // Generate PDF preview (mock implementation)
  useEffect(() => {
    const generatePDF = async () => {
      setIsGenerating(true);
      
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock PDF blob
      const pdfContent = generatePDFContent(formData);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setPdfUrl(url);
      setIsGenerating(false);
    };

    generatePDF();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [formData]);

  const generatePDFContent = (data: any): string => {
    // This is a simplified mock. In production, use a proper PDF library like jsPDF or PDFKit
    return `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(ESTIMADO PROFESIONAL - LATINOS BUSINESS SUPPORT) Tj
0 -20 Td
(Cliente: ${data.fullName || data.existingClientEmail || 'N/A'}) Tj
0 -20 Td
(Empresa: ${data.companyName || 'N/A'}) Tj
0 -20 Td
(Propiedad: ${data.propertyAddress || 'N/A'}) Tj
0 -20 Td
(Tipo de Pérdida: ${data.typeOfLoss || 'N/A'}) Tj
0 -20 Td
(Paquete: ${data.selectedPackage?.name || 'N/A'}) Tj
0 -20 Td
(Total: $${data.selectedPackage?.totalPrice || data.selectedPackage?.price || '0'}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `estimado-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('PDF descargado', 'El estimado se ha descargado correctamente');
      onDownload?.();
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vista Previa del Estimado
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isGenerating && (
              <>
                <LoadingButton
                  onClick={handlePrint}
                  variant="secondary"
                  size="sm"
                  icon={<Printer className="h-4 w-4" />}
                >
                  Imprimir
                </LoadingButton>
                <LoadingButton
                  onClick={handleDownload}
                  variant="primary"
                  size="sm"
                  icon={<Download className="h-4 w-4" />}
                >
                  Descargar
                </LoadingButton>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Cerrar vista previa"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {isGenerating ? (
            <AnimatedCard className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Generando Estimado...
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Creando tu estimado profesional con todos los detalles
              </p>
            </AnimatedCard>
          ) : (
            <div className="space-y-6">
              {/* PDF Preview Area */}
              <AnimatedCard className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-700">
                <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Estimado Generado
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Tu estimado profesional está listo para descargar
                </p>
                
                {/* PDF Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Resumen del Estimado:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.fullName || formData.existingClientEmail || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Empresa:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.companyName || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Propiedad:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.propertyAddress || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tipo de Pérdida:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.typeOfLoss || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Paquete:</span>
                      <span className="text-gray-900 dark:text-white">
                        {formData.selectedPackage?.name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-green-600 dark:text-green-400">
                        ${formData.selectedPackage?.totalPrice || formData.selectedPackage?.price || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LoadingButton
                  onClick={handleDownload}
                  variant="primary"
                  size="lg"
                  icon={<Download className="h-5 w-5" />}
                  className="flex-1 sm:flex-none"
                >
                  Descargar PDF
                </LoadingButton>
                <LoadingButton
                  onClick={handlePrint}
                  variant="secondary"
                  size="lg"
                  icon={<Printer className="h-5 w-5" />}
                  className="flex-1 sm:flex-none"
                >
                  Imprimir
                </LoadingButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;