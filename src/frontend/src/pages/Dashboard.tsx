import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Clock,
  Package,
  Plus,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";
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
import type { Page } from "../App";
import {
  formatCurrency,
  formatDate,
  sampleOrders,
  sampleProducts,
} from "../data/sampleData";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-700",
  Confirmed: "bg-indigo-100 text-indigo-700",
  Packed: "bg-orange-100 text-orange-700",
  Shipped: "bg-teal-100 text-teal-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-gray-100 text-gray-600",
  Returned: "bg-red-100 text-red-700",
};

const PLATFORM_COLORS: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-700",
  Meesho: "bg-pink-100 text-pink-700",
  Amazon: "bg-amber-100 text-amber-700",
  Website: "bg-purple-100 text-purple-700",
};

interface Props {
  setCurrentPage: (p: Page) => void;
}

export default function Dashboard({ setCurrentPage }: Props) {
  const today = new Date().toDateString();
  const todayOrders = sampleOrders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  );
  const todaySales = todayOrders.reduce((s, o) => s + o.orderValue, 0);
  const monthSales = sampleOrders.reduce((s, o) => s + o.orderValue, 0);
  const pending = sampleOrders.filter((o) =>
    ["New", "Confirmed"].includes(o.orderStatus),
  ).length;
  const packed = sampleOrders.filter((o) => o.orderStatus === "Packed").length;
  const shipped = sampleOrders.filter(
    (o) => o.orderStatus === "Shipped",
  ).length;
  const delivered = sampleOrders.filter(
    (o) => o.orderStatus === "Delivered",
  ).length;
  const returns = sampleOrders.filter(
    (o) => o.orderStatus === "Returned",
  ).length;
  const lowStock = sampleProducts.filter((p) => p.stockQuantity <= 5);

  const channelData = [
    {
      channel: "WhatsApp",
      orders: sampleOrders.filter((o) => o.platform === "WhatsApp").length,
      revenue: sampleOrders
        .filter((o) => o.platform === "WhatsApp")
        .reduce((s, o) => s + o.orderValue, 0),
    },
    {
      channel: "Meesho",
      orders: sampleOrders.filter((o) => o.platform === "Meesho").length,
      revenue: sampleOrders
        .filter((o) => o.platform === "Meesho")
        .reduce((s, o) => s + o.orderValue, 0),
    },
    {
      channel: "Amazon",
      orders: sampleOrders.filter((o) => o.platform === "Amazon").length,
      revenue: sampleOrders
        .filter((o) => o.platform === "Amazon")
        .reduce((s, o) => s + o.orderValue, 0),
    },
  ];

  const productRevenue: Record<string, number> = {};
  for (const o of sampleOrders) {
    productRevenue[o.productName] =
      (productRevenue[o.productName] || 0) + o.orderValue;
  }
  const bestSeller =
    Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

  const recentOrders = [...sampleOrders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Welcome Back, Priya! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Javika Ethnic Wear &nbsp;·&nbsp;{" "}
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {alertVisible && (
        <div
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3"
          data-ocid="dashboard.alert.panel"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            <strong>{lowStock.length} products</strong> are running low on
            stock. &nbsp;
            <button
              type="button"
              className="underline font-medium"
              onClick={() => setCurrentPage("inventory")}
            >
              View Inventory
            </button>
          </p>
          <button
            type="button"
            className="text-amber-500 hover:text-amber-700"
            onClick={() => setAlertVisible(false)}
          >
            &times;
          </button>
        </div>
      )}

      {/* KPI Cards Row 1 */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="dashboard.kpi.section"
      >
        <KpiCard
          label="Today's Orders"
          value={todayOrders.length.toString()}
          sub="orders placed today"
          colorClass="kpi-teal"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <KpiCard
          label="Today's Sales"
          value={formatCurrency(todaySales)}
          sub="revenue today"
          colorClass="kpi-orange"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KpiCard
          label="Pending Orders"
          value={pending.toString()}
          sub="need attention"
          colorClass="kpi-mustard"
          icon={<Clock className="h-5 w-5" />}
        />
        <KpiCard
          label="Low Stock Alerts"
          value={lowStock.length.toString()}
          sub="items need restock"
          colorClass="kpi-red"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      {/* KPI Cards Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MiniKpi
          label="This Month"
          value={formatCurrency(monthSales)}
          icon={<TrendingUp className="h-4 w-4 text-javika-teal" />}
        />
        <MiniKpi
          label="Packed"
          value={packed.toString()}
          icon={<Package className="h-4 w-4 text-orange-500" />}
        />
        <MiniKpi
          label="Shipped"
          value={shipped.toString()}
          icon={<Truck className="h-4 w-4 text-blue-500" />}
        />
        <MiniKpi
          label="Delivered"
          value={delivered.toString()}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        />
        <MiniKpi
          label="Returns"
          value={returns.toString()}
          icon={<RotateCcw className="h-4 w-4 text-red-500" />}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Today’s Activity — Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table
                  className="w-full text-xs"
                  data-ocid="dashboard.orders.table"
                >
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">
                        Order
                      </th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">
                        Customer
                      </th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium hidden sm:table-cell">
                        Product
                      </th>
                      <th className="text-right px-4 py-2 text-muted-foreground font-medium">
                        Amount
                      </th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">
                        Platform
                      </th>
                      <th className="text-left px-4 py-2 text-muted-foreground font-medium">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        data-ocid={`dashboard.orders.item.${idx + 1}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-muted-foreground">
                          {order.orderId}
                        </td>
                        <td className="px-4 py-2.5 font-medium">
                          {order.customerName}
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell max-w-[120px] truncate">
                          {order.productName}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold">
                          {formatCurrency(order.orderValue)}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PLATFORM_COLORS[order.platform] ?? "bg-gray-100 text-gray-700"}`}
                          >
                            {order.platform}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[order.orderStatus] ?? "bg-gray-100 text-gray-700"}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance */}
        <div>
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Channel Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={channelData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number) => [v, "Orders"]}
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="oklch(0.54 0.09 185)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {channelData.map((c) => (
                  <div
                    key={c.channel}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{c.channel}</span>
                    <span className="font-semibold">
                      {formatCurrency(c.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lower Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Inventory Status */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent
            className="space-y-2"
            data-ocid="dashboard.inventory.section"
          >
            {lowStock.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                data-ocid={`dashboard.inventory.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: p.colorHex }}
                  />
                  <span className="text-xs font-medium truncate max-w-[160px]">
                    {p.name}
                  </span>
                </div>
                <Badge variant="destructive" className="text-[10px] h-5">
                  {p.stockQuantity} left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              data-ocid="dashboard.new_order.primary_button"
              className="w-full bg-javika-maroon hover:bg-javika-maroon/90 text-white font-semibold"
              onClick={() => setCurrentPage("orders")}
            >
              <Plus className="h-4 w-4 mr-2" /> New Order
            </Button>
            <Button
              data-ocid="dashboard.add_product.secondary_button"
              variant="outline"
              className="w-full"
              onClick={() => setCurrentPage("products")}
            >
              <Package className="h-4 w-4 mr-2" /> Add Product
            </Button>
            <Button
              data-ocid="dashboard.view_reports.secondary_button"
              variant="outline"
              className="w-full"
              onClick={() => setCurrentPage("reports")}
            >
              <BarChart2 className="h-4 w-4 mr-2" /> View Reports
            </Button>
            <div className="pt-2 border-t border-border">
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Best Seller This Month
                </p>
                <p className="text-javika-maroon font-semibold truncate">
                  {bestSeller}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-2 pb-4">
        &copy; {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-javika-maroon hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  colorClass,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  colorClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`${colorClass} rounded-xl p-4 text-white relative overflow-hidden`}
    >
      <div className="absolute top-3 right-3 opacity-30">{icon}</div>
      <p className="text-xs font-medium opacity-90 mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-extrabold leading-tight">
        {value}
      </p>
      <p className="text-[10px] opacity-75 mt-1">{sub}</p>
    </div>
  );
}

function MiniKpi({
  label,
  value,
  icon,
}: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-2 shadow-card">
      <div className="p-1.5 bg-muted rounded-lg">{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
