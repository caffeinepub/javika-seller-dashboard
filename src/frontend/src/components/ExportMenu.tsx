import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Image,
  MessageCircle,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import {
  exportToExcel,
  exportToPDF,
  shareViaWhatsApp,
} from "../utils/importExport";

interface ExportMenuProps {
  title: string;
  data: Record<string, unknown>[];
  headers: { key: string; label: string }[];
  whatsAppSummary?: string;
  summaryCardId?: string;
}

export default function ExportMenu({
  title,
  data,
  headers,
  whatsAppSummary,
  summaryCardId,
}: ExportMenuProps) {
  const filename = title.toLowerCase().replace(/\s+/g, "-");

  const handleExcel = () => {
    exportToExcel(data, filename, headers);
    toast.success(`${title} downloaded as Excel/CSV`);
  };

  const handlePDF = () => {
    exportToPDF(data, filename, title, headers);
    toast.success("PDF export opened — use Print > Save as PDF");
  };

  const handleWhatsAppText = () => {
    if (whatsAppSummary) shareViaWhatsApp(whatsAppSummary);
  };

  const handleWhatsAppPDF = () => {
    exportToPDF(data, filename, title, headers);
    toast.success(
      "PDF downloaded! Open WhatsApp and share the file from your downloads.",
      { duration: 5000 },
    );
  };

  const handleImageCard = () => {
    // Fallback: copy summary text to clipboard (html2canvas not available)
    if (whatsAppSummary) {
      navigator.clipboard
        .writeText(whatsAppSummary)
        .then(() => {
          toast.success("📋 Monthly summary copied! Paste it in WhatsApp.");
        })
        .catch(() => {
          toast.error("Could not copy to clipboard");
        });
    } else {
      toast.info(
        "Summary card feature — paste from clipboard after copying text",
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-xs gap-1.5"
          data-ocid="export.dropdown_menu"
        >
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={handleExcel} data-ocid="export.excel.button">
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />📊 Download
          Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePDF} data-ocid="export.pdf.button">
          <FileText className="h-4 w-4 mr-2 text-red-600" />📄 Download PDF
        </DropdownMenuItem>

        {whatsAppSummary && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleWhatsAppText}
              data-ocid="export.whatsapp.button"
            >
              <MessageCircle className="h-4 w-4 mr-2 text-green-500" />💬 Share
              on WhatsApp (Text)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleWhatsAppPDF}
              data-ocid="export.whatsapp_pdf.button"
            >
              <Share2 className="h-4 w-4 mr-2 text-green-600" />📤 Share PDF on
              WhatsApp
            </DropdownMenuItem>
          </>
        )}

        {summaryCardId && (
          <DropdownMenuItem
            onClick={handleImageCard}
            data-ocid="export.image_card.button"
          >
            <Image className="h-4 w-4 mr-2 text-purple-500" />
            🖼️ Copy Summary Card
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
