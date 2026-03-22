import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ExportMenu from "../components/ExportMenu";
import {
  formatCurrency,
  sampleOrders,
  sampleProducts,
} from "../data/sampleData";
import { generateWhatsAppSummaryText } from "../utils/importExport";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CURRENT_MONTH = new Date().getMonth();
const PIE_COLORS = ["#1C7C7A", "#B24B22", "#E2B23A", "#C43A34", "#5A0F2B"];

const EXPORT_HEADERS = [
  { key: "name", label: "Product" },
  { key: "units", label: "Units Sold" },
  { key: "revenue", label: "Revenue (₹)" },
];

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const monthIdx = (CURRENT_MONTH - 5 + i + 12) % 12;
    const monthOrders = sampleOrders.filter(
      (o) => new Date(o.createdAt).getMonth() === monthIdx,
    );
    const revenue = monthOrders.reduce((s, o) => s + o.orderValue, 0);
    return { month: MONTHS[monthIdx], revenue, orders: monthOrders.length };
  });

  const filteredOrders = sampleOrders.filter(
    (o) => new Date(o.createdAt).getMonth() === selectedMonth,
  );
  const revenue = filteredOrders.reduce((s, o) => s + o.orderValue, 0);
  const units = filteredOrders.reduce((s, o) => s + o.quantity, 0);
  const returnCount = filteredOrders.filter(
    (o) => o.orderStatus === "Returned",
  ).length;
  const returnPct =
    filteredOrders.length > 0
      ? ((returnCount / filteredOrders.length) * 100).toFixed(1)
      : "0.0";

  const grossProfit = filteredOrders.reduce((s, o) => {
    const product = sampleProducts.find((p) => p.id === o.productId);
    const margin = product
      ? (product.sellingPrice - product.costPrice) * o.quantity
      : 0;
    return s + margin;
  }, 0);

  const channelBreakdown = ["WhatsApp", "Meesho", "Amazon", "Website"]
    .map((ch) => ({
      name: ch,
      value: sampleOrders
        .filter((o) => o.platform === ch)
        .reduce((s, o) => s + o.orderValue, 0),
    }))
    .filter((c) => c.value > 0);

  const productRevenue: Record<
    string,
    { name: string; revenue: number; units: number }
  > = {};
  for (const o of sampleOrders) {
    const key = String(o.productId);
    if (!productRevenue[key])
      productRevenue[key] = { name: o.productName, revenue: 0, units: 0 };
    productRevenue[key].revenue += o.orderValue;
    productRevenue[key].units += o.quantity;
  }
  const sortedProducts = Object.values(productRevenue).sort(
    (a, b) => b.revenue - a.revenue,
  );
  const topProducts = sortedProducts.slice(0, 5);
  const bottomProducts = [...sortedProducts].reverse().slice(0, 5);

  const monthName = new Date(2026, selectedMonth, 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const whatsAppText = generateWhatsAppSummaryText({
    totalSales: revenue,
    totalOrders: filteredOrders.length,
    totalProfit: grossProfit,
    month: monthName,
  });

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Monthly Reports</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Business performance overview
          </p>
        </div>
        <ExportMenu
          title={`Report - ${MONTHS[selectedMonth]}`}
          data={topProducts as unknown as Record<string, unknown>[]}
          headers={EXPORT_HEADERS}
          whatsAppSummary={whatsAppText}
          summaryCardId="reports-summary-card"
        />
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 flex-wrap">
        {MONTHS.map((m, i) => (
          <button
            type="button"
            key={m}
            data-ocid="reports.month.tab"
            onClick={() => setSelectedMonth(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedMonth === i
                ? "bg-javika-maroon text-white"
                : "bg-card border border-border text-muted-foreground hover:border-javika-maroon/50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div
        id="reports-summary-card"
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
        data-ocid="reports.summary.section"
      >
        <ReportCard label="Revenue" value={formatCurrency(revenue)} />
        <ReportCard label="Orders" value={filteredOrders.length.toString()} />
        <ReportCard label="Units Sold" value={units.toString()} />
        <ReportCard
          label="Gross Profit"
          value={formatCurrency(grossProfit)}
          highlight
        />
        <ReportCard label="Return %" value={`${returnPct}%`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Revenue Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
                <Bar
                  dataKey="revenue"
                  fill="oklch(0.28 0.10 355)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Sales by Channel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={channelBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {channelBreakdown.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => [formatCurrency(v), "Revenue"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top & Bottom Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              🏆 Top 5 Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Product
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Units
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr
                    key={p.name}
                    className="border-b border-border/50"
                    data-ocid={`reports.top_products.item.${i + 1}`}
                  >
                    <td className="py-2 truncate max-w-[150px]">{p.name}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {p.units}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {formatCurrency(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              🐢 Low Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">
                    Product
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Units
                  </th>
                  <th className="text-right py-2 text-muted-foreground font-medium">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {bottomProducts.map((p, i) => (
                  <tr
                    key={p.name}
                    className="border-b border-border/50"
                    data-ocid={`reports.bottom_products.item.${i + 1}`}
                  >
                    <td className="py-2 truncate max-w-[150px]">{p.name}</td>
                    <td className="py-2 text-right text-muted-foreground">
                      {p.units}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {formatCurrency(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportCard({
  label,
  value,
  highlight,
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`border rounded-xl p-4 shadow-card ${
        highlight
          ? "border-javika-maroon/30 bg-javika-maroon/5"
          : "bg-card border-border"
      }`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-lg font-bold mt-1 ${highlight ? "text-javika-maroon" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
