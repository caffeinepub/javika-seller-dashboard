import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, sampleOrders } from "../data/sampleData";

const PLATFORMS = ["WhatsApp", "Meesho", "Amazon", "Website"];

const PLATFORM_COLORS_MAP: Record<string, string> = {
  WhatsApp: "#25D366",
  Meesho: "#F43397",
  Amazon: "#FF9900",
  Website: "#6366F1",
};

const PLATFORM_BG: Record<string, string> = {
  WhatsApp: "bg-green-50 border-green-200",
  Meesho: "bg-pink-50 border-pink-200",
  Amazon: "bg-amber-50 border-amber-200",
  Website: "bg-indigo-50 border-indigo-200",
};

export default function Marketplace() {
  const platformStats = PLATFORMS.map((platform) => {
    const platformOrders = sampleOrders.filter((o) => o.platform === platform);
    const revenue = platformOrders.reduce((s, o) => s + o.orderValue, 0);
    const returns = platformOrders.filter(
      (o) => o.orderStatus === "Returned",
    ).length;
    const returnRate =
      platformOrders.length > 0
        ? ((returns / platformOrders.length) * 100).toFixed(1)
        : "0.0";

    const productRevenue: Record<string, number> = {};
    for (const o of platformOrders) {
      productRevenue[o.productName] =
        (productRevenue[o.productName] ?? 0) + o.orderValue;
    }
    const bestProduct =
      Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "N/A";

    return {
      platform,
      orders: platformOrders.length,
      revenue,
      returns,
      returnRate: Number.parseFloat(returnRate),
      bestProduct,
    };
  });

  const comparisonData = platformStats.map((s) => ({
    name: s.platform,
    Orders: s.orders,
    Revenue: s.revenue,
  }));

  const alerts: string[] = [];
  for (const s of platformStats) {
    if (s.returnRate > 10)
      alerts.push(`${s.platform} return rate is high at ${s.returnRate}%`);
    if (s.orders === 0) alerts.push(`No orders from ${s.platform} yet`);
    if (s.revenue > 20000)
      alerts.push(`${s.platform} is your top revenue channel this month!`);
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold">Marketplace Performance</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Compare your sales channels
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2" data-ocid="marketplace.alerts.section">
          {alerts.map((alert) => (
            <div
              key={alert}
              className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
            >
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-800">{alert}</p>
            </div>
          ))}
        </div>
      )}

      {/* Platform Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        data-ocid="marketplace.channels.section"
      >
        {platformStats.map((s, i) => (
          <div
            key={s.platform}
            className={`border rounded-xl p-4 ${PLATFORM_BG[s.platform]}`}
            data-ocid={`marketplace.channel.item.${i + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PLATFORM_COLORS_MAP[s.platform] }}
                />
                <span className="font-semibold text-sm">{s.platform}</span>
              </div>
              {s.orders > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <div>
                <p className="text-[10px] text-muted-foreground">Orders</p>
                <p className="text-xl font-bold">{s.orders}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Revenue</p>
                <p className="text-base font-bold">
                  {formatCurrency(s.revenue)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Returns</p>
                <p className="text-sm font-semibold">
                  {s.returns}
                  {s.returnRate > 0 && (
                    <span className="text-[10px] text-muted-foreground ml-1">
                      ({s.returnRate}%)
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Best Product
                </p>
                <p className="text-xs font-medium truncate max-w-[130px]">
                  {s.bestProduct}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Chart */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Channel Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 10 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(v: number, name: string) => [
                  name === "Revenue" ? formatCurrency(v) : v,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar
                yAxisId="left"
                dataKey="Orders"
                fill="oklch(0.54 0.09 185)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="Revenue"
                fill="oklch(0.28 0.10 355)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Detailed Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-ocid="marketplace.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Channel
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Orders
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Revenue
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Returns
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Return %
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Best Product
                </th>
              </tr>
            </thead>
            <tbody>
              {platformStats.map((s, i) => (
                <tr
                  key={s.platform}
                  className="border-b border-border/50 hover:bg-muted/20"
                  data-ocid={`marketplace.row.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: PLATFORM_COLORS_MAP[s.platform],
                        }}
                      />
                      <span className="font-medium">{s.platform}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{s.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(s.revenue)}
                  </td>
                  <td className="px-4 py-3 text-right">{s.returns}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge
                      variant={s.returnRate > 10 ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {s.returnRate}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground truncate max-w-[160px]">
                    {s.bestProduct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
