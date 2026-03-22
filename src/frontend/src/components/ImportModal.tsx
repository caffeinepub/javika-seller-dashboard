import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  FileUp,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  downloadExcelTemplate,
  parseExcelFile,
  parsePDFText,
} from "../utils/importExport";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importType: "products" | "sales" | "inventory";
  onImport: (rows: Record<string, string>[]) => void;
}

const TYPE_LABELS = {
  products: "Products",
  sales: "Sales",
  inventory: "Inventory",
};

const REQUIRED_FIELDS: Record<string, { key: string; label: string }[]> = {
  products: [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU / Code" },
    { key: "costPrice", label: "Cost Price" },
    { key: "sellingPrice", label: "Selling Price" },
    { key: "stockQuantity", label: "Stock Quantity" },
  ],
  sales: [
    { key: "date", label: "Date" },
    { key: "productName", label: "Product Name" },
    { key: "channel", label: "Channel" },
    { key: "quantity", label: "Quantity" },
    { key: "price", label: "Price" },
  ],
  inventory: [
    { key: "sku", label: "SKU / Code" },
    { key: "productName", label: "Product Name" },
    { key: "stockQuantity", label: "Stock Quantity" },
  ],
};

type Step = 1 | 2 | 3;

export default function ImportModal({
  open,
  onOpenChange,
  importType,
  onImport,
}: ImportModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [isPDF, setIsPDF] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [isScannedPDF, setIsScannedPDF] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [validRows, setValidRows] = useState<Record<string, string>[]>([]);
  const [errorRows, setErrorRows] = useState<{ row: number; reason: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const typeLabel = TYPE_LABELS[importType];
  const requiredFields = REQUIRED_FIELDS[importType];

  const reset = () => {
    setStep(1);
    setIsPDF(false);
    setPdfText("");
    setIsScannedPDF(false);
    setHeaders([]);
    setRawRows([]);
    setMapping({});
    setValidRows([]);
    setErrorRows([]);
  };

  const handleClose = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  const handleFileDrop = async (f: File) => {
    setLoading(true);
    const isPdf = f.name.toLowerCase().endsWith(".pdf");
    setIsPDF(isPdf);

    if (isPdf) {
      const text = await parsePDFText(f);
      if (text === "SCANNED_PDF") {
        setIsScannedPDF(true);
      } else {
        setPdfText(text);
        setIsScannedPDF(false);
      }
      setLoading(false);
      setStep(3);
      return;
    }

    try {
      const { rows, headers: hdrs } = await parseExcelFile(f);
      setHeaders(hdrs);
      setRawRows(rows);
      // Auto-map by similarity
      const autoMap: Record<string, string> = {};
      for (const field of requiredFields) {
        const match = hdrs.find(
          (h) =>
            h.toLowerCase().replace(/[^a-z]/g, "") ===
            field.label.toLowerCase().replace(/[^a-z]/g, ""),
        );
        if (match) autoMap[field.key] = match;
      }
      setMapping(autoMap);
      setLoading(false);
      setStep(2);
    } catch {
      toast.error("Could not read file. Please use a valid Excel/CSV file.");
      setLoading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileDrop(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFileDrop(f);
  };

  const proceedToPreview = () => {
    const valid: Record<string, string>[] = [];
    const errors: { row: number; reason: string }[] = [];

    rawRows.forEach((row, i) => {
      const mapped: Record<string, string> = {};
      let reason = "";

      for (const field of requiredFields) {
        const colName = mapping[field.key];
        const val = colName ? row[colName] : "";
        if (!val || val.trim() === "") {
          reason = `${field.label} is missing`;
          break;
        }
        const isNumericField = [
          "costPrice",
          "sellingPrice",
          "price",
          "stockQuantity",
          "quantity",
        ].includes(field.key);
        if (isNumericField && Number.isNaN(Number(val))) {
          reason = `${field.label} must be a number`;
          break;
        }
        mapped[field.key] = val.trim();
      }

      // Also carry extra mapped fields
      for (const [key, col] of Object.entries(mapping)) {
        if (!mapped[key] && col) mapped[key] = row[col] ?? "";
      }

      if (reason) {
        errors.push({ row: i + 2, reason });
      } else {
        valid.push(mapped);
      }
    });

    setValidRows(valid);
    setErrorRows(errors);
    setStep(3);
  };

  const handleImport = () => {
    onImport(validRows);
    toast.success(
      `${validRows.length} ${typeLabel.toLowerCase()} imported successfully!`,
    );
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="import.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-javika-maroon" />
            Import {typeLabel}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          {([1, 2, 3] as Step[]).map((s) => (
            <span
              key={s}
              className={`flex items-center gap-1 ${
                step >= s ? "text-javika-maroon font-semibold" : ""
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= s
                    ? "bg-javika-maroon text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {s === 1 ? "Upload" : s === 2 ? "Map Columns" : "Preview"}
              {s < 3 && <span className="mx-1 text-muted-foreground">›</span>}
            </span>
          ))}
        </div>

        {/* STEP 1: Upload */}
        {step === 1 && (
          <div className="space-y-4">
            <button
              type="button"
              data-ocid="import.template.button"
              onClick={() => downloadExcelTemplate(importType)}
              className="w-full flex items-center gap-2 p-3 rounded-lg border border-dashed border-javika-teal/50 text-javika-teal text-sm hover:bg-javika-teal/5 transition-colors"
            >
              <Download className="h-4 w-4" />📥 Download Sample Excel Template
            </button>

            <button
              type="button"
              className="w-full border-2 border-dashed border-muted rounded-xl p-8 text-center hover:border-javika-maroon/40 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              data-ocid="import.dropzone"
            >
              <FileUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-semibold text-sm mb-1">
                {loading ? "Reading file..." : "Tap or drag to upload file"}
              </p>
              <p className="text-xs text-muted-foreground">
                Accepts Excel (.xlsx), CSV, or structured PDF
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.csv,.pdf"
                className="hidden"
                onChange={handleFileInput}
                data-ocid="import.upload_button"
              />
            </button>

            <p className="text-[11px] bg-amber-50 text-amber-700 rounded-lg p-2.5 leading-relaxed">
              💡 <strong>Tip:</strong> Download the sample template first, fill
              it with your data, then upload it here.
            </p>
          </div>
        )}

        {/* STEP 2: Column Mapping */}
        {step === 2 && !isPDF && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We found <strong>{headers.length} columns</strong> in your file.
              Tell us which column has which info:
            </p>
            <div className="space-y-3">
              {requiredFields.map((field) => (
                <div key={field.key}>
                  <Label className="text-xs font-medium mb-1 block">
                    Which column has the <strong>{field.label}</strong>?
                  </Label>
                  <Select
                    value={mapping[field.key] ?? ""}
                    onValueChange={(v) =>
                      setMapping((m) => ({ ...m, [field.key]: v }))
                    }
                  >
                    <SelectTrigger
                      data-ocid={`import.mapping.${field.key}.select`}
                      className="h-10 text-sm"
                    >
                      <SelectValue placeholder="Select a column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
              <Button
                data-ocid="import.next.button"
                className="flex-1 bg-javika-maroon hover:bg-javika-maroon/90 text-white"
                onClick={proceedToPreview}
              >
                Preview Data →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Preview & Confirm */}
        {step === 3 && (
          <div className="space-y-4">
            {isScannedPDF && (
              <div
                className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700"
                data-ocid="import.error_state"
              >
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                This PDF appears to be a <strong>scanned image</strong>. Scanned
                PDFs are not fully supported yet.
                <br />
                <br />
                Please upload an <strong>Excel file</strong> or a{" "}
                <strong>text-based PDF</strong> instead.
              </div>
            )}

            {isPDF && !isScannedPDF && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  📄 Text extracted from PDF. Please review and manually verify
                  before importing.
                </p>
                <textarea
                  readOnly
                  className="w-full h-40 text-xs font-mono border rounded-lg p-3 bg-muted/30 resize-none"
                  value={pdfText}
                />
                <p className="text-[11px] text-amber-700 bg-amber-50 rounded p-2">
                  💡 For accurate import, use the Excel template instead of PDF.
                </p>
              </div>
            )}

            {!isPDF && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-medium">
                    {validRows.length} rows ready to import
                  </span>
                  {errorRows.length > 0 && (
                    <span className="text-red-600 ml-auto">
                      {errorRows.length} errors
                    </span>
                  )}
                </div>

                {validRows.length > 0 && (
                  <div
                    className="overflow-x-auto rounded-lg border"
                    data-ocid="import.table"
                  >
                    <table className="text-[11px] w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          {requiredFields.map((f) => (
                            <th
                              key={f.key}
                              className="px-2 py-1.5 text-left font-semibold"
                            >
                              {f.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {validRows.slice(0, 5).map((row, idx) => (
                          <tr
                            key={Object.values(row).join("-") || String(idx)}
                            className="border-t"
                          >
                            {requiredFields.map((f) => (
                              <td key={f.key} className="px-2 py-1.5">
                                {row[f.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {validRows.length > 5 && (
                      <p className="text-[11px] text-center text-muted-foreground py-1.5">
                        +{validRows.length - 5} more rows
                      </p>
                    )}
                  </div>
                )}

                {errorRows.length > 0 && (
                  <div
                    className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1"
                    data-ocid="import.error_state"
                  >
                    <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Issues found:
                    </p>
                    {errorRows.slice(0, 5).map((err) => (
                      <p key={err.row} className="text-[11px] text-red-600">
                        Row {err.row}: {err.reason}
                      </p>
                    ))}
                    {errorRows.length > 5 && (
                      <p className="text-[11px] text-red-500">
                        +{errorRows.length - 5} more issues
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(isPDF ? 1 : 2)}
              >
                ← Back
              </Button>
              {!isScannedPDF && !isPDF && (
                <Button
                  data-ocid="import.confirm.button"
                  className="flex-1 bg-javika-maroon hover:bg-javika-maroon/90 text-white"
                  disabled={validRows.length === 0}
                  onClick={handleImport}
                >
                  Import {validRows.length} Rows
                </Button>
              )}
              {(isScannedPDF || isPDF) && (
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Try Another File
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
