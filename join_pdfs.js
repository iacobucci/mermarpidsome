const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function mergePDFs(pdfPathsDir, outputPath) {
	const pdfPaths = fs.readdirSync(pdfPathsDir).map((pdfPath) => `${pdfPathsDir}/${pdfPath}`);

    const mergedPdf = await PDFDocument.create();

    for (const pdfPath of pdfPaths) {
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    fs.writeFileSync(outputPath, mergedPdfBytes);
}

//TODO add outline

// Esempio di utilizzo
const pdfPaths = "./out";
// get the first argument passed from the command line
const mergedPdfOutputPath = process.argv[2] || './merged.pdf';

mergePDFs(pdfPaths, mergedPdfOutputPath)
    .catch((error) => console.error(error));