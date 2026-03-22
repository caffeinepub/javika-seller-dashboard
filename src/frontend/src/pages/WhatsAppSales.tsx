import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check, Copy, Eye, MessageCircle, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type WhatsAppPromo,
  formatCurrency,
  formatDate,
  sampleOrders,
  sampleProducts,
  samplePromos,
} from "../data/sampleData";

const generateMessage = (promo: WhatsAppPromo) =>
  `🌸 *${promo.productName}* | ${formatCurrency(promo.price)} | ${promo.fabric} | Available in ${promo.colors.join(", ")} | DM to order! 📲\n\n_Javika Ethnic Wear — Quality you can feel_ ✨`;

export default function WhatsAppSales() {
  const [promos, setPromos] = useState<WhatsAppPromo[]>(samplePromos);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);

  const waOrders = sampleOrders.filter((o) => o.platform === "WhatsApp");
  const waRevenue = waOrders.reduce((s, o) => s + o.orderValue, 0);

  const togglePromo = (id: number) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
    const promo = promos.find((p) => p.id === id);
    toast.success(
      `${promo?.productName} ${promo?.isActive ? "removed from" : "added to"} daily deals`,
    );
  };

  const copyMessage = async (promo: WhatsAppPromo) => {
    const msg = generateMessage(promo);
    try {
      await navigator.clipboard.writeText(msg);
      setCopiedId(promo.id);
      toast.success("Message copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const activePromos = promos.filter((p) => p.isActive);
  const allProducts = sampleProducts.filter((p) => p.isActive);
  const unpromotedProducts = allProducts.filter(
    (p) => !promos.some((pr) => pr.productId === p.id),
  );

  const addPromo = (productId: number) => {
    const product = sampleProducts.find((p) => p.id === productId);
    if (!product) return;
    const newId = Math.max(...promos.map((p) => p.id)) + 1;
    setPromos((prev) => [
      ...prev,
      {
        id: newId,
        productId: product.id,
        productName: product.name,
        price: product.sellingPrice,
        fabric: product.fabric,
        colors: product.colors,
        promotedAt: new Date().toISOString(),
        isActive: true,
        engagements: 0,
      },
    ]);
    toast.success(`${product.name} added to WhatsApp deals`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" /> WhatsApp Sales
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage deals and promotions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">WA Orders</p>
          <p className="text-xl font-bold text-green-700">{waOrders.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">WA Revenue</p>
          <p className="text-base font-bold text-green-700">
            {formatCurrency(waRevenue)}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Active Deals</p>
          <p className="text-xl font-bold text-green-700">
            {activePromos.length}
          </p>
        </div>
      </div>

      {/* Daily Deals */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Daily Deals</h2>
        <div className="space-y-3" data-ocid="whatsapp.deals.section">
          {promos.map((promo, i) => (
            <Card
              key={promo.id}
              className={`shadow-card ${promo.isActive ? "border-green-200" : ""}`}
              data-ocid={`whatsapp.deals.item.${i + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">
                        {promo.productName}
                      </p>
                      {promo.isActive && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
                          Active Deal
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {promo.fabric} · {promo.colors.join(", ")} ·{" "}
                      {formatCurrency(promo.price)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {promo.engagements} engagements · Promoted{" "}
                      {formatDate(promo.promotedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch
                      data-ocid={`whatsapp.deal.toggle.${i + 1}`}
                      checked={promo.isActive}
                      onCheckedChange={() => togglePromo(promo.id)}
                    />
                  </div>
                </div>

                {promo.isActive && (
                  <div className="mt-3 space-y-2">
                    {previewId === promo.id && (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-xs whitespace-pre-wrap font-mono text-green-800">
                        {generateMessage(promo)}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        data-ocid={`whatsapp.preview.${i + 1}`}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs flex-1"
                        onClick={() =>
                          setPreviewId(previewId === promo.id ? null : promo.id)
                        }
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        {previewId === promo.id ? "Hide" : "Preview"}
                      </Button>
                      <Button
                        data-ocid={`whatsapp.copy.${i + 1}`}
                        size="sm"
                        className="h-7 text-xs flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => copyMessage(promo)}
                      >
                        {copiedId === promo.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 mr-1" /> Copy Message
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Product to Deals */}
      {unpromotedProducts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3">Add to WhatsApp Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {unpromotedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-card border border-border rounded-lg px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatCurrency(p.sellingPrice)}
                  </p>
                </div>
                <Button
                  data-ocid="whatsapp.add_deal.button"
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] px-2"
                  onClick={() => addPromo(p.id)}
                >
                  <Zap className="h-3 w-3 mr-0.5" /> Add
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WA Orders */}
      <div>
        <h2 className="text-sm font-semibold mb-3">WhatsApp Orders</h2>
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">
                  Product
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Value
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {waOrders.map((o, i) => (
                <tr
                  key={o.id}
                  className="border-b border-border/50 hover:bg-muted/20"
                  data-ocid={`whatsapp.orders.item.${i + 1}`}
                >
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">
                    {o.orderId}
                  </td>
                  <td className="px-4 py-2.5 font-medium">{o.customerName}</td>
                  <td className="px-4 py-2.5 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">
                    {o.productName}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold">
                    {formatCurrency(o.orderValue)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">
                      {o.orderStatus}
                    </span>
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
