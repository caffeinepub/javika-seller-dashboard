// Import/Export utilities for Javika Seller Dashboard
// Uses browser-native CSV/print approaches (no external dependencies needed)

// ─── TEMPLATE DOWNLOADS ───────────────────────────────────────────────────────

const TEMPLATE_CONFIGS = {
  products: {
    headers: [
      "Name",
      "SKU",
      "Category",
      "Cost Price",
      "Selling Price",
      "Stock Quantity",
      "Color",
    ],
    rows: [
      [
        "Banarasi Silk Dupatta",
        "JVK-DUP-001",
        "dupatta",
        "450",
        "950",
        "25",
        "Red",
      ],
      [
        "Cotton Floral Suit",
        "JVK-SUT-001",
        "kurta",
        "600",
        "1299",
        "15",
        "Blue",
      ],
      [
        "Festive Lehenga Set",
        "JVK-LEH-001",
        "lehenga",
        "1200",
        "2499",
        "8",
        "Green",
      ],
    ],
  },
  sales: {
    headers: [
      "Date",
      "Product Name",
      "Channel",
      "Quantity",
      "Price",
      "Payment Method",
    ],
    rows: [
      ["2026-03-01", "Banarasi Silk Dupatta", "WhatsApp", "2", "950", "UPI"],
      ["2026-03-02", "Cotton Floral Suit", "Meesho", "1", "1299", "COD"],
      [
        "2026-03-03",
        "Festive Lehenga Set",
        "Amazon",
        "1",
        "2499",
        "Credit Card",
      ],
    ],
  },
  inventory: {
    headers: ["SKU", "Product Name", "Stock Quantity", "Restock Quantity"],
    rows: [
      ["JVK-DUP-001", "Banarasi Silk Dupatta", "25", "50"],
      ["JVK-SUT-001", "Cotton Floral Suit", "15", "30"],
      ["JVK-LEH-001", "Festive Lehenga Set", "8", "20"],
    ],
  },
};

export function downloadExcelTemplate(
  type: "products" | "sales" | "inventory",
) {
  const config = TEMPLATE_CONFIGS[type];
  const csvRows = [config.headers, ...config.rows];
  const csvContent = csvRows
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
  downloadFile(
    `javika_${type}_template.csv`,
    csvContent,
    "text/csv;charset=utf-8;",
  );
}

// ─── CSV ESCAPE ────────────────────────────────────────────────────────────────

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ─── FILE DOWNLOAD HELPER ─────────────────────────────────────────────────────

function downloadFile(filename: string, content: string, mimeType: string) {
  const bom = "\uFEFF"; // BOM for Excel UTF-8
  const blob = new Blob([`${bom}${content}`], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── EXCEL (CSV) IMPORT ───────────────────────────────────────────────────────

export async function parseExcelFile(
  file: File,
): Promise<{ rows: Record<string, string>[]; headers: string[] }> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { rows: [], headers: [] };

  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }

  return { rows, headers };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// ─── EXCEL (CSV) EXPORT ───────────────────────────────────────────────────────

export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string,
  headers: { key: string; label: string }[],
) {
  const headerRow = headers.map((h) => h.label);
  const dataRows = data.map((row) => headers.map((h) => csvEscape(row[h.key])));
  const csvContent = [headerRow, ...dataRows]
    .map((r) => r.join(","))
    .join("\n");
  downloadFile(`${filename}.csv`, csvContent, "text/csv;charset=utf-8;");
}

// ─── PDF EXPORT (PRINT) ───────────────────────────────────────────────────────

export function exportToPDF(
  data: Record<string, unknown>[],
  filename: string,
  title: string,
  headers: { key: string; label: string }[],
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const now = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const tableRows = data
    .map(
      (row) =>
        `<tr>${headers.map((h) => `<td>${row[h.key] ?? ""}</td>`).join("")}</tr>`,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #222; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #5A0F2B; padding-bottom: 12px; }
        .brand { font-size: 22px; font-weight: bold; color: #5A0F2B; }
        .brand small { display: block; font-size: 10px; color: #666; font-weight: normal; margin-top: 2px; }
        .report-date { font-size: 11px; color: #888; text-align: right; }
        h2 { font-size: 16px; color: #333; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #5A0F2B; color: white; padding: 8px 10px; text-align: left; font-size: 11px; }
        td { padding: 7px 10px; border-bottom: 1px solid #eee; font-size: 11px; }
        tr:nth-child(even) td { background: #faf9f8; }
        .footer { margin-top: 20px; font-size: 10px; color: #aaa; text-align: center; }
        @media print { body { padding: 10px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="brand">🧣 Javika<small>Indian Ethnic Wear</small></div>
        <div class="report-date">Generated: ${now}<br /><strong>${filename}</strong></div>
      </div>
      <h2>${title}</h2>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h.label}</th>`).join("")}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">Generated via Javika Dashboard · caffeine.ai</div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

// ─── PDF IMPORT (TEXT EXTRACTION) ─────────────────────────────────────────────

export async function parsePDFText(file: File): Promise<string> {
  try {
    const text = await file.text();
    // A real PDF has binary content; check ratio of printable vs total chars
    let readableCount = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 32 && code < 127) readableCount++;
    }
    const ratio = readableCount / Math.max(text.length, 1);
    if (ratio < 0.3) return "SCANNED_PDF";
    // Extract lines that look like content
    const lines = text
      .split(/\n|\r/)
      .map((l) => l.replace(/[^ -~]/g, " ").trim())
      .filter((l) => l.length > 2)
      .join("\n");
    return lines.length > 50 ? lines : "SCANNED_PDF";
  } catch {
    return "SCANNED_PDF";
  }
}

// ─── WHATSAPP SHARE ───────────────────────────────────────────────────────────

export function shareViaWhatsApp(text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

export function generateWhatsAppSummaryText(data: {
  totalSales: number;
  totalOrders: number;
  totalProfit: number;
  month: string;
}): string {
  const fmt = (n: number) =>
    `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  return [
    `📊 Javika Monthly Report - ${data.month}`,
    "─────────────────────",
    `💰 Total Sales: ${fmt(data.totalSales)}`,
    `📦 Total Orders: ${data.totalOrders}`,
    `📈 Profit: ${fmt(data.totalProfit)}`,
    "─────────────────────",
    "Generated via Javika Dashboard",
  ].join("\n");
}
