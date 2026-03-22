import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  BarChart2,
  Bell,
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Store,
  Warehouse,
  X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import type { Page } from "../App";

const navItems: {
  id: Page;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "ledger", label: "Sales Ledger", icon: BookOpen },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "reports", label: "Reports", icon: BarChart2 },
  { id: "expenses", label: "Expenses", icon: Receipt },
  { id: "whatsapp", label: "WhatsApp Sales", icon: MessageCircle },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "settings", label: "Settings", icon: Settings },
];

const mobileBottomItems: Page[] = [
  "dashboard",
  "products",
  "orders",
  "inventory",
];

interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  children: ReactNode;
}

export default function Layout({
  currentPage,
  setCurrentPage,
  children,
}: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setMoreOpen(false);
  };

  const currentLabel =
    navItems.find((n) => n.id === currentPage)?.label ?? "Dashboard";

  const notifications = [
    { text: "3 products have low stock", type: "warning" },
    { text: "2 orders pending dispatch", type: "info" },
    { text: "Meesho order #JVK-2402 shipped", type: "success" },
    { text: "Monthly report for March ready", type: "info" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-sidebar border-r border-sidebar-border shadow-md z-20">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-sidebar font-bold text-sm">J</span>
            </div>
            <div>
              <span className="text-gold font-bold text-lg tracking-wide">
                Javika
              </span>
              <p className="text-sidebar-foreground/50 text-[10px] -mt-0.5">
                Ethnic Wear
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-3"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 ${active ? "text-gold" : ""}`}
                />
                <span className="truncate">{item.label}</span>
                {active && (
                  <ChevronRight className="h-3.5 w-3.5 ml-auto text-gold" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-sidebar-border">
          <p className="text-sidebar-foreground/30 text-[10px] text-center">
            &copy; {new Date().getFullYear()} Javika
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-4 md:px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex md:hidden items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-gold flex items-center justify-center">
                <span className="text-white font-bold text-xs">J</span>
              </div>
              <span className="font-bold text-sm text-foreground">Javika</span>
            </div>
            <span className="hidden md:block text-sm font-medium text-muted-foreground">
              {currentLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="header.notif.button"
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-javika-red rounded-full" />
            </button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-javika-maroon text-white text-xs font-bold">
                P
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col -space-y-0.5">
              <span className="text-xs font-semibold text-foreground">
                Priya
              </span>
              <span className="text-[10px] text-muted-foreground">Admin</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 px-1"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around">
          {mobileBottomItems.map((pageId) => {
            const item = navItems.find((n) => n.id === pageId)!;
            const Icon = item.icon;
            const active = currentPage === pageId;
            return (
              <button
                type="button"
                key={pageId}
                data-ocid={`mobile.nav.${pageId}.link`}
                onClick={() => navigate(pageId)}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 flex-1 transition-colors ${
                  active ? "text-javika-maroon" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            data-ocid="mobile.nav.more.button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 flex-1 transition-colors ${
              !mobileBottomItems.includes(currentPage)
                ? "text-javika-maroon"
                : "text-muted-foreground"
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Mobile More Sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-auto rounded-t-2xl pb-8">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left text-sm">More Options</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-3">
            {navItems
              .filter((n) => !mobileBottomItems.includes(n.id))
              .map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    data-ocid={`mobile.more.${item.id}.link`}
                    onClick={() => navigate(item.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${
                      active
                        ? "border-javika-maroon/50 bg-javika-maroon/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-javika-maroon" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-[10px] font-medium text-center leading-tight ${active ? "text-javika-maroon" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Notification Panel */}
      {notifOpen && (
        <div
          className="absolute top-14 right-4 z-50 bg-card border border-border rounded-xl shadow-card-hover w-72 p-4"
          data-ocid="header.notif.popover"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Notifications</span>
            <button type="button" onClick={() => setNotifOpen(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <div
                key={`notif-${n.text.slice(0, 10)}-${i}`}
                className="flex gap-2 p-2 rounded-lg bg-muted/50 text-xs"
              >
                <Badge
                  variant={n.type === "warning" ? "destructive" : "secondary"}
                  className="h-4 px-1 text-[9px]"
                >
                  {n.type}
                </Badge>
                <span className="text-muted-foreground">{n.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
