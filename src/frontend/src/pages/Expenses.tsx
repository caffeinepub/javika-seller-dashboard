import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import ExportMenu from "../components/ExportMenu";
import {
  type Expense,
  formatCurrency,
  formatDate,
  sampleExpenses,
} from "../data/sampleData";
import { generateWhatsAppSummaryText } from "../utils/importExport";

const EXPENSE_CATEGORIES = [
  "Packaging",
  "Shipping",
  "Ad Spend",
  "Marketplace Fees",
  "Product Sourcing",
  "Miscellaneous",
];

const CAT_COLORS: Record<string, string> = {
  Packaging: "bg-blue-100 text-blue-700",
  Shipping: "bg-teal-100 text-teal-700",
  "Ad Spend": "bg-purple-100 text-purple-700",
  "Marketplace Fees": "bg-amber-100 text-amber-700",
  "Product Sourcing": "bg-indigo-100 text-indigo-700",
  Miscellaneous: "bg-gray-100 text-gray-600",
};

const EXPORT_HEADERS = [
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount (₹)" },
  { key: "description", label: "Description" },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<Expense>>({
    date: new Date().toISOString().split("T")[0],
    category: "Packaging",
    amount: 0,
    description: "",
  });

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const monthSales = 68432;
  const profitAfterExpenses = monthSales - totalExpenses;

  const byCategory: Record<string, number> = {};
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
  }
  const categoryData = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const handleAdd = () => {
    if (!form.amount || form.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const newId = Math.max(...expenses.map((e) => e.id)) + 1;
    setExpenses((prev) => [
      {
        id: newId,
        date: form.date ?? new Date().toISOString(),
        category: form.category ?? "Miscellaneous",
        amount: form.amount ?? 0,
        description: form.description ?? "",
      },
      ...prev,
    ]);
    toast.success("Expense added");
    setAddOpen(false);
    setForm({
      date: new Date().toISOString().split("T")[0],
      category: "Packaging",
      amount: 0,
      description: "",
    });
  };

  const monthName = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const whatsAppText = generateWhatsAppSummaryText({
    totalSales: monthSales,
    totalOrders: 0,
    totalProfit: profitAfterExpenses,
    month: monthName,
  });

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Expenses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track business costs
          </p>
        </div>
        <div className="flex gap-2">
          <ExportMenu
            title="Expenses"
            data={expenses as unknown as Record<string, unknown>[]}
            headers={EXPORT_HEADERS}
            whatsAppSummary={whatsAppText}
          />
          <Button
            data-ocid="expenses.add.primary_button"
            onClick={() => setAddOpen(true)}
            className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        data-ocid="expenses.summary.section"
      >
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-red-700 mt-1">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Est. Monthly Sales</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {formatCurrency(monthSales)}
          </p>
        </div>
        <div
          className={`border rounded-xl p-4 ${profitAfterExpenses > 0 ? "bg-teal-50 border-teal-100" : "bg-red-50 border-red-100"}`}
        >
          <p className="text-xs text-muted-foreground">Profit After Expenses</p>
          <p
            className={`text-2xl font-bold mt-1 ${profitAfterExpenses > 0 ? "text-teal-700" : "text-red-700"}`}
          >
            {formatCurrency(profitAfterExpenses)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  width={90}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Amount"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
                <Bar
                  dataKey="value"
                  fill="oklch(0.52 0.13 40)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categoryData.map(({ name, value }) => (
              <div key={name} className="flex items-center justify-between">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${CAT_COLORS[name] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {name}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-javika-orange h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (value / totalExpenses) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-16 text-right">
                    {formatCurrency(value)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-ocid="expenses.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">
                  Description
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr
                  key={e.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`expenses.item.${i + 1}`}
                >
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {formatDate(e.date)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CAT_COLORS[e.category] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell max-w-[200px] truncate">
                    {e.description}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-red-600">
                    {formatCurrency(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm" data-ocid="expenses.add.dialog">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Date</Label>
              <Input
                data-ocid="expenses.date.input"
                type="date"
                className="h-9 text-sm mt-1"
                value={form.date ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">Category</Label>
              <Select
                value={form.category ?? "Packaging"}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  data-ocid="expenses.category.select"
                  className="h-9 text-sm mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Amount (₹)</Label>
              <Input
                data-ocid="expenses.amount.input"
                type="number"
                className="h-9 text-sm mt-1"
                value={form.amount ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: +e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                data-ocid="expenses.desc.textarea"
                className="text-sm mt-1 resize-none"
                rows={2}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="expenses.cancel.cancel_button"
              variant="outline"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="expenses.save.submit_button"
              onClick={handleAdd}
              className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
            >
              Save Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
