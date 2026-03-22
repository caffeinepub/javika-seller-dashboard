import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Package,
  Upload,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import ExportMenu from "../components/ExportMenu";
import ImportModal from "../components/ImportModal";
import {
  type SampleProduct,
  formatCurrency,
  sampleProducts,
} from "../data/sampleData";

const EXPORT_HEADERS = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Product Name" },
  { key: "stockQuantity", label: "Stock" },
  { key: "reservedStock", label: "Reserved" },
  { key: "sellingPrice", label: "Selling Price (₹)" },
  { key: "category", label: "Category" },
];

export default function Inventory() {
  const [products, setProducts] = useState<SampleProduct[]>(sampleProducts);
  const [importOpen, setImportOpen] = useState(false);

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stockQuantity > 5).length;
  const lowStock = products.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= 5,
  );
  const outOfStock = products.filter((p) => p.stockQuantity === 0);

  const getStockBadge = (qty: number) => {
    if (qty === 0)
      return (
        <Badge variant="destructive" className="text-[10px]">
          Out of Stock
        </Badge>
      );
    if (qty <= 5)
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
          Low Stock
        </Badge>
      );
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
        In Stock
      </Badge>
    );
  };

  const restockSuggestion = (p: SampleProduct) => {
    const margin = p.sellingPrice - p.costPrice;
    if (margin > 1000) return 15;
    if (margin > 500) return 20;
    return 30;
  };

  const handleInventoryImport = (rows: Record<string, string>[]) => {
    setProducts((prev) =>
      prev.map((p) => {
        const match = rows.find(
          (r) => r.sku?.toLowerCase() === p.sku.toLowerCase(),
        );
        if (match?.stockQuantity) {
          return {
            ...p,
            stockQuantity: Number(match.stockQuantity) || p.stockQuantity,
          };
        }
        return p;
      }),
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Inventory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stock management and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="inventory.import.button"
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <ExportMenu
            title="Inventory"
            data={products as unknown as Record<string, unknown>[]}
            headers={EXPORT_HEADERS}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="inventory.overview.section"
      >
        <OverviewCard
          icon={<Package className="h-5 w-5 text-blue-500" />}
          label="Total Products"
          value={totalProducts}
          color="bg-blue-50 border-blue-100"
        />
        <OverviewCard
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          label="In Stock"
          value={inStock}
          color="bg-green-50 border-green-100"
        />
        <OverviewCard
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          label="Low Stock"
          value={lowStock.length}
          color="bg-amber-50 border-amber-100"
        />
        <OverviewCard
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          label="Out of Stock"
          value={outOfStock.length}
          color="bg-red-50 border-red-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Low Stock Alerts */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent
            className="space-y-3"
            data-ocid="inventory.low_stock.section"
          >
            {lowStock.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-amber-100 bg-amber-50 rounded-lg px-3 py-2"
                data-ocid={`inventory.low_stock.item.${i + 1}`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex-shrink-0"
                    style={{ backgroundColor: p.colorHex }}
                  />
                  <div>
                    <p className="text-xs font-medium">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-700">
                    {p.stockQuantity} left
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Restock: {restockSuggestion(p)}
                  </p>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                All products well-stocked!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" /> Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent data-ocid="inventory.out_of_stock.section">
            {outOfStock.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  No out-of-stock items!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {outOfStock.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border border-red-100 bg-red-50 rounded-lg px-3 py-2"
                    data-ocid={`inventory.out_of_stock.item.${i + 1}`}
                  >
                    <p className="text-xs font-medium">{p.name}</p>
                    <Badge variant="destructive" className="text-[10px]">
                      Out
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Inventory Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Full Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-ocid="inventory.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">
                  SKU
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Current
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Reserved
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Available
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">
                  Selling Price
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">
                  Restock Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`inventory.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded flex-shrink-0"
                        style={{ backgroundColor: p.colorHex }}
                      />
                      <span className="font-medium truncate max-w-[120px]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono hidden sm:table-cell">
                    {p.sku}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {p.stockQuantity}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                    {p.reservedStock}
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    {Math.max(0, p.stockQuantity - p.reservedStock)}
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    {formatCurrency(p.sellingPrice)}
                  </td>
                  <td className="px-4 py-3">
                    {getStockBadge(p.stockQuantity)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden lg:table-cell">
                    {restockSuggestion(p)}
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
        importType="inventory"
        onImport={handleInventoryImport}
      />
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
  color,
}: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className={`border rounded-xl p-4 flex items-center gap-3 ${color}`}>
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
