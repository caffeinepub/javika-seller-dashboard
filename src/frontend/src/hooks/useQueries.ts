import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, Product, ProductCategory } from "../backend.d";
import { sampleOrders, sampleProducts } from "../data/sampleData";
import { useActor } from "./useActor";

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllProducts();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllOrders();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLowStock() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["lowStock"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getLowStockProducts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: ProductCategory) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getProductsByCategory(category);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useAddOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error("No actor");
      return actor.addOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      try {
        const existing = await actor.getAllProducts();
        if (existing.length === 0) {
          await Promise.all(
            sampleProducts.slice(0, 3).map((p) =>
              actor.addProduct({
                id: BigInt(p.id),
                sku: p.sku,
                name: p.name,
                category: p.category as any,
                fabric: p.fabric,
                sizes: p.sizes,
                colors: p.colors,
                description: p.description,
                costPrice: p.costPrice,
                sellingPrice: p.sellingPrice,
                marketplacePrice: p.marketplacePrice,
                stockQuantity: BigInt(p.stockQuantity),
                reservedStock: BigInt(p.reservedStock),
                isActive: p.isActive,
                tags: p.tags as any,
                createdTimestamp: BigInt(Date.now()),
              }),
            ),
          );
          const existingOrders = await actor.getAllOrders();
          if (existingOrders.length === 0) {
            await Promise.all(
              sampleOrders.slice(0, 3).map((o) =>
                actor.addOrder({
                  id: BigInt(o.id),
                  orderId: o.orderId,
                  customerName: o.customerName,
                  customerPhone: o.customerPhone,
                  productId: BigInt(o.productId),
                  productName: o.productName,
                  quantity: BigInt(o.quantity),
                  orderValue: o.orderValue,
                  platform: o.platform,
                  paymentMethod: o.paymentMethod,
                  shippingStatus: o.shippingStatus,
                  orderStatus: o.orderStatus,
                  notes: o.notes,
                  createdTimestamp: BigInt(Date.now()),
                }),
              ),
            );
          }
        }
      } catch {
        // Silently fail — sample data in local state covers it
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
