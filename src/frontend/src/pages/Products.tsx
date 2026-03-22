import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Filter,
  Plus,
  Search,
  ToggleLeft,
  ToggleRight,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ExportMenu from "../components/ExportMenu";
import ImportModal from "../components/ImportModal";
import {
  type SampleProduct,
  formatCurrency,
  sampleProducts,
} from "../data/sampleData";

const CATEGORIES = ["all", "dupatta", "kurta", "saree", "lehenga", "fabric"];
const TAGS = ["festive", "premium", "daily", "bestseller"];

const TAG_COLORS: Record<string, string> = {
  festive: "bg-amber-100 text-amber-700",
  premium: "bg-purple-100 text-purple-700",
  daily: "bg-blue-100 text-blue-700",
  bestseller: "bg-green-100 text-green-700",
};

const EXPORT_HEADERS = [
  { key: "name", label: "Product Name" },
  { key: "sku", label: "SKU" },
  { key: "category", label: "Category" },
  { key: "costPrice", label: "Cost Price (₹)" },
  { key: "sellingPrice", label: "Selling Price (₹)" },
  { key: "stockQuantity", label: "Stock" },
  { key: "fabric", label: "Fabric" },
];

export default function Products() {
  const [products, setProducts] = useState<SampleProduct[]>(sampleProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editProduct, setEditProduct] = useState<SampleProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<SampleProduct>>({});
  const [importOpen, setImportOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm({
      sku: "",
      name: "",
      category: "dupatta",
      fabric: "",
      sizes: [],
      colors: [],
      description: "",
      costPrice: 0,
      sellingPrice: 0,
      marketplacePrice: 0,
      stockQuantity: 0,
      reservedStock: 0,
      isActive: true,
      tags: [],
      colorHex: "#D4A23A",
    });
    setDialogOpen(true);
  };

  const openEdit = (p: SampleProduct) => {
    setEditProduct(p);
    setForm({ ...p });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.sku) {
      toast.error("Name and SKU are required");
      return;
    }
    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id ? ({ ...p, ...form } as SampleProduct) : p,
        ),
      );
      toast.success("Product updated successfully");
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...form, id: newId } as SampleProduct]);
      toast.success("Product added successfully");
    }
    setDialogOpen(false);
  };

  const toggleActive = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
    toast.success("Product status updated");
  };

  const toggleTag = (tag: string) => {
    const tags = form.tags ?? [];
    setForm((f) => ({
      ...f,
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    }));
  };

  const handleProductImport = (rows: Record<string, string>[]) => {
    const newProducts = rows.map(
      (row, i) =>
        ({
          id: Math.max(...products.map((p) => p.id)) + i + 1,
          name: row.name ?? "",
          sku: row.sku ?? `JVK-IMP-${Date.now()}-${i}`,
          category: row.category ?? "dupatta",
          fabric: row.fabric ?? "",
          sizes: [],
          colors: row.color ? [row.color] : [],
          description: "",
          costPrice: Number(row.costPrice) || 0,
          sellingPrice: Number(row.sellingPrice) || 0,
          marketplacePrice: Number(row.sellingPrice) || 0,
          stockQuantity: Number(row.stockQuantity) || 0,
          reservedStock: 0,
          isActive: true,
          tags: [],
          colorHex: "#D4A23A",
        }) as SampleProduct,
    );
    setProducts((prev) => [...prev, ...newProducts]);
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {products.length} total products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            data-ocid="products.import.button"
            variant="outline"
            size="sm"
            className="h-9 text-xs gap-1.5"
            onClick={() => setImportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <ExportMenu
            title="Products"
            data={products as unknown as Record<string, unknown>[]}
            headers={EXPORT_HEADERS}
          />
          <Button
            data-ocid="products.add_product.primary_button"
            onClick={openAdd}
            className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            data-ocid="products.search_input"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger
            data-ocid="products.category.select"
            className="h-9 w-36 text-sm"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c === "all" ? "All Categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        data-ocid="products.list"
      >
        {filtered.map((p, i) => (
          <Card
            key={p.id}
            className="shadow-card hover:shadow-card-hover transition-shadow"
            data-ocid={`products.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div
                  className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: p.colorHex }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <button
                      type="button"
                      data-ocid={`products.toggle.${i + 1}`}
                      onClick={() => toggleActive(p.id)}
                      className="flex-shrink-0"
                    >
                      {p.isActive ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {p.sku}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {p.category} · {p.fabric}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-foreground">
                    {formatCurrency(p.sellingPrice)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Cost: {formatCurrency(p.costPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={p.stockQuantity <= 5 ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {p.stockQuantity <= 0
                      ? "Out of Stock"
                      : `${p.stockQuantity} in stock`}
                  </Badge>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  data-ocid={`products.edit_button.${i + 1}`}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => openEdit(p)}
                >
                  <Edit2 className="h-3 w-3 mr-1" /> Edit
                </Button>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.colorHex }}
                  />
                  {p.colors.slice(0, 2).join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="products.empty_state"
        >
          <Filter className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>No products found</p>
        </div>
      )}

      {/* Import Modal */}
      <ImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        importType="products"
        onImport={handleProductImport}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Product Name *</Label>
                <Input
                  data-ocid="products.name.input"
                  className="h-9 text-sm mt-1"
                  value={form.name ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Banarasi Silk Dupatta"
                />
              </div>
              <div>
                <Label className="text-xs">SKU *</Label>
                <Input
                  data-ocid="products.sku.input"
                  className="h-9 text-sm mt-1"
                  value={form.sku ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sku: e.target.value }))
                  }
                  placeholder="JVK-DUP-001"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    data-ocid="products.category_form.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter((c) => c !== "all").map((c) => (
                      <SelectItem key={c} value={c} className="capitalize">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Fabric</Label>
                <Input
                  data-ocid="products.fabric.input"
                  className="h-9 text-sm mt-1"
                  value={form.fabric ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fabric: e.target.value }))
                  }
                  placeholder="e.g. Silk, Cotton"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Cost Price (₹)</Label>
                <Input
                  data-ocid="products.cost_price.input"
                  type="number"
                  className="h-9 text-sm mt-1"
                  value={form.costPrice ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, costPrice: +e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Selling Price (₹)</Label>
                <Input
                  data-ocid="products.selling_price.input"
                  type="number"
                  className="h-9 text-sm mt-1"
                  value={form.sellingPrice ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sellingPrice: +e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Marketplace (₹)</Label>
                <Input
                  data-ocid="products.marketplace_price.input"
                  type="number"
                  className="h-9 text-sm mt-1"
                  value={form.marketplacePrice ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      marketplacePrice: +e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Stock Quantity</Label>
                <Input
                  data-ocid="products.stock.input"
                  type="number"
                  className="h-9 text-sm mt-1"
                  value={form.stockQuantity ?? 0}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stockQuantity: +e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Colors (comma-separated)</Label>
                <Input
                  data-ocid="products.colors.input"
                  className="h-9 text-sm mt-1"
                  value={(form.colors ?? []).join(", ")}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      colors: e.target.value.split(",").map((s) => s.trim()),
                    }))
                  }
                  placeholder="Red, Green, Blue"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                data-ocid="products.description.textarea"
                className="text-sm mt-1 resize-none"
                rows={2}
                value={form.description ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Product description..."
              />
            </div>
            <div>
              <Label className="text-xs mb-2 block">Tags</Label>
              <div className="flex gap-2 flex-wrap">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    data-ocid={`products.tag.${tag}.toggle`}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      (form.tags ?? []).includes(tag)
                        ? "bg-javika-maroon text-white border-transparent"
                        : "bg-transparent text-muted-foreground border-border hover:border-javika-maroon/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                data-ocid="products.active.switch"
                checked={form.isActive ?? true}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              />
              <Label className="text-xs">Active / Available for sale</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="products.cancel.cancel_button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="products.save.save_button"
              onClick={handleSave}
              className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
            >
              Save Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
