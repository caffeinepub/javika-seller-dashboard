import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ExportMenu from "../components/ExportMenu";
import ImportModal from "../components/ImportModal";
import {
  type SalesEntry,
  formatCurrency,
  formatDate,
  sampleLedgerEntries,
  sampleProducts,
} from "../data/sampleData";
import { generateWhatsAppSummaryText } from "../utils/importExport";

const CHANNELS = ["WhatsApp", "Meesho", "Amazon", "Website"];
const PAYMENT_STATUSES = ["Paid", "Pending", "COD"];
const DELIVERY_STATUSES = ["Delivered", "Pending", "Returned"];

const EXPORT_HEADERS = [
  { key: "date", label: "Date" },
  { key: "productName", label: "Product" },
  { key: "customerName", label: "Customer" },
  { key: "channel", label: "Channel" },
  { key: "quantity", label: "Qty" },
  { key: "sellingPrice", label: "Price (₹)" },
  { key: "totalAmount", label: "Total (₹)" },
  { key: "paymentStatus", label: "Payment" },
  { key: "deliveryStatus", label: "Delivery" },
];

export default function SalesLedger() {
  const [entries, setEntries] = useState<SalesEntry[]>(sampleLedgerEntries);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form, setForm] = useState<Partial<SalesEntry>>({
    date: new Date().toISOString().split("T")[0],
    quantity: 1,
    channel: "WhatsApp",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    isReturn: false,
  });

  const today = new Date().toDateString();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const todayTotal = entries
    .filter((e) => !e.isReturn && new Date(e.date).toDateString() === today)
    .reduce((s, e) => s + e.totalAmount, 0);
  const weekTotal = entries
    .filter((e) => !e.isReturn && new Date(e.date) >= weekAgo)
    .reduce((s, e) => s + e.totalAmount, 0);
  const monthTotal = entries
    .filter((e) => !e.isReturn)
    .reduce((s, e) => s + e.totalAmount, 0);
  const totalUnits = entries
    .filter((e) => !e.isReturn)
    .reduce((s, e) => s + e.quantity, 0);

  const channelSales: Record<string, number> = {};
  for (const e of entries.filter((e) => !e.isReturn)) {
    channelSales[e.channel] = (channelSales[e.channel] ?? 0) + e.totalAmount;
  }

  const productSales: Record<string, { amount: number; qty: number }> = {};
  for (const e of entries.filter((e) => !e.isReturn)) {
    if (!productSales[e.productName])
      productSales[e.productName] = { amount: 0, qty: 0 };
    productSales[e.productName].amount += e.totalAmount;
    productSales[e.productName].qty += e.quantity;
  }
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 5);

  const handleAdd = () => {
    if (!form.productId || !form.customerName) {
      toast.error("Product and customer are required");
      return;
    }
    const product = sampleProducts.find((p) => p.id === form.productId);
    const qty = form.quantity ?? 1;
    const price = form.sellingPrice ?? product?.sellingPrice ?? 0;
    const newEntry: SalesEntry = {
      id: Math.max(...entries.map((e) => e.id)) + 1,
      date: form.date ?? new Date().toISOString(),
      productId: form.productId,
      productName: product?.name ?? "",
      quantity: qty,
      channel: form.channel ?? "WhatsApp",
      sellingPrice: price,
      totalAmount: price * qty,
      customerName: form.customerName ?? "",
      paymentStatus: form.paymentStatus ?? "Paid",
      deliveryStatus: form.deliveryStatus ?? "Delivered",
      isReturn: form.isReturn ?? false,
      notes: form.notes ?? "",
    };
    setEntries((prev) => [newEntry, ...prev]);
    toast.success("Sales entry added");
    setAddOpen(false);
    setForm({
      date: new Date().toISOString().split("T")[0],
      quantity: 1,
      channel: "WhatsApp",
      paymentStatus: "Paid",
      deliveryStatus: "Delivered",
      isReturn: false,
    });
  };

  const handleSalesImport = (rows: Record<string, string>[]) => {
    const newEntries = rows.map((row, i) => {
      const qty = Number(row.quantity) || 1;
      const price = Number(row.price) || 0;
      return {
        id: Math.max(...entries.map((e) => e.id)) + i + 1,
        date: row.date || new Date().toISOString(),
        productId: 1,
        productName: row.productName || "",
        quantity: qty,
        channel: row.channel || "WhatsApp",
        sellingPrice: price,
        totalAmount: price * qty,
        customerName: "",
        paymentStatus: row.paymentMethod || "Paid",
        deliveryStatus: "Delivered",
        isReturn: false,
        notes: "",
      } as SalesEntry;
    });
    setEntries((prev) => [...newEntries, ...prev]);
  };

  const whatsAppText = generateWhatsAppSummaryText({
    totalSales: monthTotal,
    totalOrders: entries.filter((e) => !e.isReturn).length,
    totalProfit: monthTotal * 0.35,
    month: new Date().toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    }),
  });

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Sales Ledger</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {entries.length} entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="ledger.import.button"
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <ExportMenu
            title="Sales Ledger"
            data={entries as unknown as Record<string, unknown>[]}
            headers={EXPORT_HEADERS}
            whatsAppSummary={whatsAppText}
          />
          <Button
            data-ocid="ledger.add_entry.primary_button"
            onClick={() => setAddOpen(true)}
            className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="ledger.summary.section"
      >
        <SummaryCard label="Today's Total" value={formatCurrency(todayTotal)} />
        <SummaryCard label="This Week" value={formatCurrency(weekTotal)} />
        <SummaryCard label="This Month" value={formatCurrency(monthTotal)} />
        <SummaryCard
          label="Total Units Sold"
          value={totalUnits.toString()}
          isUnits
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Channel Breakdown */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Sales by Channel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(channelSales).map(([ch, amt]) => (
              <div key={ch} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{ch}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-javika-teal h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (amt / monthTotal) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-20 text-right">
                    {formatCurrency(amt)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Top Products by Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topProducts.map(([name, data]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {data.qty} units
                  </span>
                  <span className="text-xs font-semibold">
                    {formatCurrency(data.amount)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-ocid="ledger.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Channel
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Qty
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Payment
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Delivery
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.slice(0, 30).map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${e.isReturn ? "opacity-60" : ""}`}
                  data-ocid={`ledger.item.${i + 1}`}
                >
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {formatDate(e.date)}
                  </td>
                  <td className="px-4 py-2.5 font-medium max-w-[120px] truncate">
                    {e.isReturn && <span className="text-red-600 mr-1">↩</span>}
                    {e.productName}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell">
                    {e.customerName}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">
                      {e.channel}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right">{e.quantity}</td>
                  <td
                    className={`px-4 py-2.5 text-right font-semibold ${e.isReturn ? "text-red-600" : ""}`}
                  >
                    {e.isReturn ? "-" : ""}
                    {formatCurrency(e.totalAmount)}
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        e.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : e.paymentStatus === "COD"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {e.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 hidden md:table-cell">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        e.deliveryStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {e.deliveryStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        importType="sales"
        onImport={handleSalesImport}
      />

      {/* Add Entry Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md" data-ocid="ledger.add.dialog">
          <DialogHeader>
            <DialogTitle>Add Sales Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input
                  data-ocid="ledger.date.input"
                  type="date"
                  className="h-9 text-sm mt-1"
                  value={form.date ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Product *</Label>
                <Select
                  value={form.productId?.toString()}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, productId: +v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="ledger.product.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Qty</Label>
                <Input
                  data-ocid="ledger.qty.input"
                  type="number"
                  min={1}
                  className="h-9 text-sm mt-1"
                  value={form.quantity ?? 1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: +e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Price (₹)</Label>
                <Input
                  data-ocid="ledger.price.input"
                  type="number"
                  className="h-9 text-sm mt-1"
                  value={form.sellingPrice ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sellingPrice: +e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Channel</Label>
                <Select
                  value={form.channel ?? "WhatsApp"}
                  onValueChange={(v) => setForm((f) => ({ ...f, channel: v }))}
                >
                  <SelectTrigger
                    data-ocid="ledger.channel.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Customer Name *</Label>
              <Input
                data-ocid="ledger.customer.input"
                className="h-9 text-sm mt-1"
                value={form.customerName ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customerName: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Payment Status</Label>
                <Select
                  value={form.paymentStatus ?? "Paid"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, paymentStatus: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="ledger.payment.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Delivery Status</Label>
                <Select
                  value={form.deliveryStatus ?? "Delivered"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, deliveryStatus: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="ledger.delivery.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                data-ocid="ledger.return.checkbox"
                checked={form.isReturn ?? false}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isReturn: !!v }))
                }
                id="isReturn"
              />
              <Label htmlFor="isReturn" className="text-xs">
                Mark as Return/Refund
              </Label>
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea
                data-ocid="ledger.notes.textarea"
                className="text-sm mt-1 resize-none"
                rows={2}
                value={form.notes ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="ledger.cancel.cancel_button"
              variant="outline"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="ledger.save.submit_button"
              onClick={handleAdd}
              className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
            >
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  isUnits,
}: { label: string; value: string; isUnits?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-card">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-bold mt-1 ${isUnits ? "text-xl" : "text-lg"}`}>
        {value}
      </p>
    </div>
  );
}
