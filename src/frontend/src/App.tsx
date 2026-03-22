import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Inventory from "./pages/Inventory";
import Marketplace from "./pages/Marketplace";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import SalesLedger from "./pages/SalesLedger";
import Settings from "./pages/Settings";
import WhatsAppSales from "./pages/WhatsAppSales";

export type Page =
  | "dashboard"
  | "products"
  | "orders"
  | "ledger"
  | "inventory"
  | "reports"
  | "expenses"
  | "whatsapp"
  | "marketplace"
  | "settings";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  useEffect(() => {
    document.title = "Javika — Seller Dashboard";
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "ledger":
        return <SalesLedger />;
      case "inventory":
        return <Inventory />;
      case "reports":
        return <Reports />;
      case "expenses":
        return <Expenses />;
      case "whatsapp":
        return <WhatsAppSales />;
      case "marketplace":
        return <Marketplace />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
