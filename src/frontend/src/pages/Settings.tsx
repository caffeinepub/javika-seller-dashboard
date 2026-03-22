import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Building2, Download, Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BusinessSettings {
  name: string;
  contactNumber: string;
  whatsappNumber: string;
  currency: string;
  gstNumber: string;
}

const DEFAULT_CATEGORIES = [
  "Dupatta",
  "Kurta",
  "Saree",
  "Lehenga",
  "Fabric",
  "Suit Set",
];
const DEFAULT_CHANNELS: { name: string; active: boolean }[] = [
  { name: "WhatsApp", active: true },
  { name: "Meesho", active: true },
  { name: "Amazon", active: true },
  { name: "Website", active: false },
];

export default function Settings() {
  const [business, setBusiness] = useState<BusinessSettings>({
    name: "Javika Ethnic Wear",
    contactNumber: "+91 98765 43210",
    whatsappNumber: "+91 98765 43210",
    currency: "INR",
    gstNumber: "27ABCDE1234F1Z5",
  });
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);

  const handleSaveBusiness = () => toast.success("Business settings saved!");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
    toast.success("Category added");
  };

  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    toast.success(`${cat} removed`);
  };

  const toggleChannel = (name: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.name === name ? { ...c, active: !c.active } : c)),
    );
  };

  const handleExport = (type: string) =>
    toast.success(`${type} exported successfully!`);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your business configuration
        </p>
      </div>

      {/* Business Info */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Business Name</Label>
              <Input
                data-ocid="settings.business_name.input"
                className="h-9 text-sm mt-1"
                value={business.name}
                onChange={(e) =>
                  setBusiness((b) => ({ ...b, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">Contact Number</Label>
              <Input
                data-ocid="settings.contact.input"
                className="h-9 text-sm mt-1"
                value={business.contactNumber}
                onChange={(e) =>
                  setBusiness((b) => ({ ...b, contactNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">WhatsApp Number</Label>
              <Input
                data-ocid="settings.whatsapp.input"
                className="h-9 text-sm mt-1"
                value={business.whatsappNumber}
                onChange={(e) =>
                  setBusiness((b) => ({ ...b, whatsappNumber: e.target.value }))
                }
              />
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Input
                data-ocid="settings.currency.input"
                className="h-9 text-sm mt-1"
                value={business.currency}
                readOnly
              />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs">GST Number</Label>
              <Input
                data-ocid="settings.gst.input"
                className="h-9 text-sm mt-1"
                value={business.gstNumber}
                onChange={(e) =>
                  setBusiness((b) => ({ ...b, gstNumber: e.target.value }))
                }
              />
            </div>
          </div>
          <Button
            data-ocid="settings.save_business.save_button"
            onClick={handleSaveBusiness}
            className="bg-javika-maroon hover:bg-javika-maroon/90 text-white w-full sm:w-auto"
          >
            <Save className="h-4 w-4 mr-1" /> Save Changes
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Categories */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Product Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="flex flex-wrap gap-2"
              data-ocid="settings.categories.section"
            >
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="flex items-center gap-1 bg-muted text-xs px-2.5 py-1 rounded-full"
                >
                  {cat}
                  <button
                    type="button"
                    data-ocid="settings.category.delete_button"
                    onClick={() => removeCategory(cat)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Separator />
            <div className="flex gap-2">
              <Input
                data-ocid="settings.new_category.input"
                className="h-8 text-sm"
                placeholder="New category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <Button
                type="button"
                data-ocid="settings.add_category.button"
                size="sm"
                variant="outline"
                className="h-8 px-2"
                onClick={addCategory}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Channels */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Sales Channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {channels.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{ch.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {ch.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <Switch
                  data-ocid={`settings.channel.${ch.name.toLowerCase()}.switch`}
                  checked={ch.active}
                  onCheckedChange={() => toggleChannel(ch.name)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Export Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Daily Sales Report",
              "Monthly Sales Report",
              "Product Stock Report",
              "Order List",
              "Expense Summary",
            ].map((exportType) => (
              <Button
                key={exportType}
                data-ocid="settings.export.button"
                variant="outline"
                className="justify-start text-xs h-9"
                onClick={() => handleExport(exportType)}
              >
                <Download className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                {exportType}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center py-4 space-y-1">
        <p className="text-xs text-muted-foreground">
          Javika Seller Dashboard v1.0
        </p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-javika-maroon hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
