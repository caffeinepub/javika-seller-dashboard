# Javika Seller Dashboard — Import/Export Feature

## Current State
A fully working mobile-first React frontend seller dashboard with 10 modules: Dashboard, Products, Orders, SalesLedger, Inventory, Reports, Expenses, WhatsAppSales, Marketplace, Settings. All data is managed in-memory using sample data from `sampleData.ts`. The app has no import/export capabilities yet — existing Export buttons in Expenses show only a toast placeholder.

## Requested Changes (Diff)

### Add
- **ImportExport utility module** (`utils/importExport.ts`): functions for Excel generation/parsing (using SheetJS/xlsx), PDF generation (using jsPDF + autotable), and PDF text extraction (basic, for structured text PDFs)
- **ImportModal component** (`components/ImportModal.tsx`): reusable 3-step modal: (1) Upload file, (2) Map columns, (3) Preview & confirm with error rows highlighted
- **ExportMenu component** (`components/ExportMenu.tsx`): reusable dropdown with Excel download, PDF download, WhatsApp share options
- **WhatsApp share helpers**: text summary, PDF share link, image summary card (html2canvas)
- **Sample template downloads**: pre-built Excel templates for Products, Sales, Inventory imports
- Import/Export UI wired into: Products, SalesLedger, Inventory, Reports, Orders, Expenses pages

### Modify
- **Products page**: Add Import button (Excel/PDF) and Export button (Excel/PDF + WhatsApp)
- **SalesLedger page**: Add Import button and Export button
- **Inventory page**: Add Import button and Export button
- **Reports page**: Add Export button with all 3 WhatsApp share options; monthly summary card exportable as image
- **Orders page**: Add Export button
- **Expenses page**: Replace placeholder Export button with real export + WhatsApp share

### Remove
- Nothing removed

## Implementation Plan

1. Install `xlsx` (SheetJS) and `jspdf` + `jspdf-autotable` packages via package.json
2. Create `utils/importExport.ts` with:
   - `generateExcelTemplate(type: 'products'|'sales'|'inventory')` — returns sample .xlsx with correct headers
   - `parseExcel(file: File)` — returns array of row objects
   - `exportToExcel(data, filename, headers)` — triggers .xlsx download
   - `exportToPDF(data, filename, title, headers)` — triggers .pdf download using jsPDF autotable
   - `parsePDF(file: File)` — basic text extraction, returns lines; shows error if scanned
   - `shareOnWhatsApp(type, data)` — opens WhatsApp with text summary
   - `generateSummaryCard(elementId)` — html2canvas screenshot for monthly card
3. Create `components/ImportModal.tsx`: 3-step wizard (Upload → Map Columns → Preview/Errors)
4. Create `components/ExportMenu.tsx`: dropdown with Excel, PDF, WhatsApp Text, WhatsApp PDF options
5. Wire ImportModal and ExportMenu into each page (Products, SalesLedger, Inventory, Reports, Orders, Expenses)
6. Add sample template download links in ImportModal step 1
7. Validate, fix errors, deploy
