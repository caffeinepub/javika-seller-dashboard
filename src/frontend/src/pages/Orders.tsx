import { Button } from "@/components/ui/button";
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
import { Eye, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ExportMenu from "../components/ExportMenu";
import {
  type SampleOrder,
  formatCurrency,
  formatDate,
  sampleOrders,
  sampleProducts,
} from "../data/sampleData";

const ORDER_STATUSES = [
  "All",
  "New",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];
const PLATFORMS = ["All", "WhatsApp", "Meesho", "Amazon", "Website"];
const PAYMENT_METHODS = [
  "UPI",
  "COD",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "NEFT",
];

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

const EXPORT_HEADERS = [
  { key: "orderId", label: "Order ID" },
  { key: "customerName", label: "Customer" },
  { key: "productName", label: "Product" },
  { key: "platform", label: "Channel" },
  { key: "quantity", label: "Qty" },
  { key: "orderValue", label: "Value (₹)" },
  { key: "orderStatus", label: "Status" },
  { key: "paymentMethod", label: "Payment" },
];

export default function Orders() {
  const [orders, setOrders] = useState<SampleOrder[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<SampleOrder | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<SampleOrder>>({});

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || o.orderStatus === statusFilter;
    const matchPlatform =
      platformFilter === "All" || o.platform === platformFilter;
    return matchSearch && matchStatus && matchPlatform;
  });

  const openDetail = (o: SampleOrder) => {
    setSelectedOrder(o);
    setDetailOpen(true);
  };

  const updateStatus = (id: number, status: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, orderStatus: status, shippingStatus: status } : o,
      ),
    );
    if (selectedOrder?.id === id)
      setSelectedOrder((o) => (o ? { ...o, orderStatus: status } : o));
    toast.success(`Order status updated to ${status}`);
  };

  const handleAddOrder = () => {
    if (!form.customerName || !form.productId) {
      toast.error("Customer and product are required");
      return;
    }
    const product = sampleProducts.find((p) => p.id === form.productId);
    const newId = Math.max(...orders.map((o) => o.id)) + 1;
    const qty = form.quantity ?? 1;
    setOrders((prev) => [
      ...prev,
      {
        id: newId,
        orderId: `JVK-${2400 + newId}`,
        customerName: form.customerName ?? "",
        customerPhone: form.customerPhone ?? "",
        productId: form.productId ?? 1,
        productName: product?.name ?? "",
        quantity: qty,
        orderValue: (product?.sellingPrice ?? 0) * qty,
        platform: form.platform ?? "WhatsApp",
        paymentMethod: form.paymentMethod ?? "UPI",
        shippingStatus: "Processing",
        orderStatus: "New",
        notes: form.notes ?? "",
        createdAt: new Date().toISOString(),
      },
    ]);
    toast.success("Order added successfully");
    setAddOpen(false);
    setForm({});
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {orders.length} total orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu
            title="Orders"
            data={orders as unknown as Record<string, unknown>[]}
            headers={EXPORT_HEADERS}
          />
          <Button
            data-ocid="orders.add_order.primary_button"
            onClick={() => {
              setForm({});
              setAddOpen(true);
            }}
            className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> New Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            data-ocid="orders.search_input"
            placeholder="Search customer, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            data-ocid="orders.status.select"
            className="h-9 w-32 text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger
            data-ocid="orders.platform.select"
            className="h-9 w-32 text-sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PLATFORMS.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs" data-ocid="orders.table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden md:table-cell">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden sm:table-cell">
                  Qty
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Value
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Platform
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  data-ocid={`orders.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-muted-foreground">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[140px] truncate">
                    {order.productName}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {order.quantity}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(order.orderValue)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PLATFORM_COLORS[order.platform] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {order.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-ocid={`orders.view.${i + 1}`}
                      onClick={() => openDetail(order)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div
            className="text-center py-10 text-muted-foreground"
            data-ocid="orders.empty_state"
          >
            <p className="text-sm">No orders match your filters</p>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        {selectedOrder && (
          <DialogContent className="max-w-md" data-ocid="orders.detail.dialog">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.orderId}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <InfoRow label="Customer" value={selectedOrder.customerName} />
                <InfoRow label="Phone" value={selectedOrder.customerPhone} />
                <InfoRow label="Product" value={selectedOrder.productName} />
                <InfoRow
                  label="Quantity"
                  value={selectedOrder.quantity.toString()}
                />
                <InfoRow
                  label="Order Value"
                  value={formatCurrency(selectedOrder.orderValue)}
                />
                <InfoRow label="Platform" value={selectedOrder.platform} />
                <InfoRow label="Payment" value={selectedOrder.paymentMethod} />
                <InfoRow
                  label="Date"
                  value={formatDate(selectedOrder.createdAt)}
                />
              </div>
              {selectedOrder.notes && (
                <InfoRow label="Notes" value={selectedOrder.notes} />
              )}
              <div>
                <Label className="text-xs">Update Status</Label>
                <Select
                  value={selectedOrder.orderStatus}
                  onValueChange={(v) => updateStatus(selectedOrder.id, v)}
                >
                  <SelectTrigger
                    data-ocid="orders.status_update.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.filter((s) => s !== "All").map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                data-ocid="orders.detail.close_button"
                variant="outline"
                onClick={() => setDetailOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md" data-ocid="orders.add.dialog">
          <DialogHeader>
            <DialogTitle>New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Customer Name *</Label>
                <Input
                  data-ocid="orders.customer_name.input"
                  className="h-9 text-sm mt-1"
                  value={form.customerName ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input
                  data-ocid="orders.phone.input"
                  className="h-9 text-sm mt-1"
                  value={form.customerPhone ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, customerPhone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Product *</Label>
                <Select
                  value={form.productId?.toString()}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, productId: +v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="orders.product.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue placeholder="Select product" />
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
              <div>
                <Label className="text-xs">Quantity</Label>
                <Input
                  data-ocid="orders.quantity.input"
                  type="number"
                  min={1}
                  className="h-9 text-sm mt-1"
                  value={form.quantity ?? 1}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: +e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Platform</Label>
                <Select
                  value={form.platform ?? "WhatsApp"}
                  onValueChange={(v) => setForm((f) => ({ ...f, platform: v }))}
                >
                  <SelectTrigger
                    data-ocid="orders.platform_form.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.filter((p) => p !== "All").map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Payment Method</Label>
                <Select
                  value={form.paymentMethod ?? "UPI"}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, paymentMethod: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="orders.payment.select"
                    className="h-9 text-sm mt-1"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea
                data-ocid="orders.notes.textarea"
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
              data-ocid="orders.add.cancel_button"
              variant="outline"
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="orders.add.submit_button"
              onClick={handleAddOrder}
              className="bg-javika-maroon hover:bg-javika-maroon/90 text-white"
            >
              Add Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  );
}
