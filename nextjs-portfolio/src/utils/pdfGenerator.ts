// src/utils/pdfGenerator.ts
/**
 * PDF Generation Service for CV Templates
 * Converts React CV components to downloadable PDFs
 */

export interface PDFGenerationOptions {
  filename?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  quality?: number; // 0.1 to 1.0
  scale?: number; // 0.1 to 2.0
}

export class PDFGenerator {
  private static readonly DEFAULT_OPTIONS: PDFGenerationOptions = {
    filename: 'CV_Tun_Keltesch.pdf',
    format: 'A4',
    orientation: 'portrait',
    margins: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    quality: 0.98,
    scale: 1.0
  };

  /**
   * Generate PDF from CV template element
   */
  static async generatePDF(
    elementId: string = 'cv-template',
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<void> {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    
    try {
      // Try html2canvas + jsPDF approach first
      if (await this.isHtml2CanvasAvailable()) {
        await this.generateWithHtml2Canvas(elementId, finalOptions);
        return;
      }
      
      // Fallback to browser print API
      await this.generateWithPrintAPI(finalOptions);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again or use your browser\'s print function.');
    }
  }

  /**
   * Check if html2canvas is available
   */
  private static async isHtml2CanvasAvailable(): Promise<boolean> {
    try {
      // Dynamically import html2canvas and jspdf
      const html2canvas = await import('html2canvas');
      const jsPDF = await import('jspdf');
      return !!(html2canvas && jsPDF);
    } catch (error) {
      console.log('PDF libraries not available, using fallback print method');
      return false;
    }
  }

  /**
   * Generate PDF using html2canvas + jsPDF
   */
  private static async generateWithHtml2Canvas(
    elementId: string,
    options: PDFGenerationOptions
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    // Import libraries dynamically
    const html2canvas = await import('html2canvas');
    const { jsPDF } = await import('jspdf');

    // Ensure element is visible and styled correctly
    this.prepareElementForCapture(element);

    try {
      // Generate canvas from element
      const canvas = await html2canvas.default(element, {
        useCORS: true,
        allowTaint: true,
        scale: options.scale || 1.0,
        width: 210 * 3.779527559, // A4 width in pixels (210mm * 3.779527559 px/mm)
        height: 297 * 3.779527559, // A4 height in pixels (297mm * 3.779527559 px/mm)
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc: Document) => {
          // Ensure all styles are properly applied to the cloned document
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            this.ensureStylesInClone(clonedElement);
          }
        }
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.format || 'A4',
        compress: true
      });

      // Calculate dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pageWidth - (options.margins!.left + options.margins!.right);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', options.quality || 0.98);
      pdf.addImage(
        imgData,
        'JPEG',
        options.margins!.left,
        options.margins!.top,
        imgWidth,
        Math.min(imgHeight, pageHeight - (options.margins!.top + options.margins!.bottom))
      );

      // Handle multi-page content if needed
      if (imgHeight > pageHeight - (options.margins!.top + options.margins!.bottom)) {
        await this.handleMultiPageContent(pdf, canvas, options, pageWidth, pageHeight);
      }

      // Save the PDF
      pdf.save(options.filename || 'CV_Tun_Keltesch.pdf');

    } finally {
      // Restore element state
      this.restoreElementAfterCapture(element);
    }
  }

  /**
   * Prepare element for PDF capture
   */
  private static prepareElementForCapture(element: HTMLElement): void {
    // Store original styles
    const originalStyle = element.style.cssText;
    element.setAttribute('data-original-style', originalStyle);

    // Apply PDF-specific styles
    element.style.position = 'relative';
    element.style.zIndex = '9999';
    element.style.background = 'white';
    element.style.transform = 'none';
    element.style.margin = '0';
    element.style.padding = '0';

    // Ensure all fonts are loaded
    document.fonts.ready.then(() => {
      console.log('Fonts loaded for PDF generation');
    });
  }

  /**
   * Restore element after capture
   */
  private static restoreElementAfterCapture(element: HTMLElement): void {
    const originalStyle = element.getAttribute('data-original-style');
    if (originalStyle) {
      element.style.cssText = originalStyle;
      element.removeAttribute('data-original-style');
    }
  }

  /**
   * Ensure styles are properly applied in cloned element
   */
  private static ensureStylesInClone(clonedElement: HTMLElement): void {
    // Add any critical inline styles that might be missing
    clonedElement.style.fontFamily = '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    clonedElement.style.lineHeight = '1.4';
    clonedElement.style.color = '#333';
  }

  /**
   * Handle multi-page content (simplified version)
   */
  private static async handleMultiPageContent(
    pdf: any,
    canvas: HTMLCanvasElement,
    options: PDFGenerationOptions,
    pageWidth: number,
    pageHeight: number
  ): Promise<void> {
    // This is a simplified implementation
    // In a production environment, you'd want more sophisticated page breaking
    console.log('Multi-page content detected, using single page with scaling');
  }

  /**
   * Fallback: Generate PDF using browser print API
   */
  private static async generateWithPrintAPI(options: PDFGenerationOptions): Promise<void> {
    // Create a new window with just the CV content
    const element = document.getElementById('cv-template');
    if (!element) {
      throw new Error('CV template element not found');
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup blockers.');
    }

    // Create HTML for print window
    const printHTML = this.createPrintHTML(element.outerHTML);
    
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    };
  }

  /**
   * Create HTML for print window
   */
  private static createPrintHTML(cvContent: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>CV - Tun Keltesch</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            
            /* Include CV styles */
            ${this.getInlineCVStyles()}
          </style>
        </head>
        <body>
          ${cvContent}
        </body>
      </html>
    `;
  }

  /**
   * Get inline CV styles for print
   */
  private static getInlineCVStyles(): string {
    // This would include the CSS from CVTemplate.css
    // For brevity, returning a simplified version
    return `
      .cv-template {
        display: flex;
        width: 210mm;
        min-height: 297mm;
        background: white;
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #333;
        line-height: 1.4;
      }
      
      .cv-left-column {
        width: 35%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 25px;
      }
      
      .cv-right-column {
        width: 65%;
        padding: 30px 35px;
        background: white;
      }
      
      /* Additional styles would go here */
    `;
  }

  /**
   * Prepare CV for PDF generation
   */
  static prepareCVForPDF(elementId: string = 'cv-template'): Promise<void> {
    return new Promise((resolve) => {
      const element = document.getElementById(elementId);
      if (!element) {
        resolve();
        return;
      }

      // Ensure all images are loaded
      const images = element.querySelectorAll('img');
      const imagePromises = Array.from(images).map((img) => {
        return new Promise((imgResolve) => {
          if (img.complete) {
            imgResolve(true);
          } else {
            img.onload = () => imgResolve(true);
            img.onerror = () => imgResolve(false);
          }
        });
      });

      Promise.all(imagePromises).then(() => {
        // Wait a bit more for any dynamic content
        setTimeout(resolve, 500);
      });
    });
  }

  /**
   * Download CV as PDF with job-specific filename
   */
  static async downloadTailoredCV(
    jobTitle: string,
    company: string,
    elementId: string = 'cv-template'
  ): Promise<void> {
    const sanitizedJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedCompany = company.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `CV_Tun_Keltesch_${sanitizedJobTitle}_${sanitizedCompany}.pdf`;

    await this.prepareCVForPDF(elementId);
    await this.generatePDF(elementId, { filename });
  }
}

export default PDFGenerator; 