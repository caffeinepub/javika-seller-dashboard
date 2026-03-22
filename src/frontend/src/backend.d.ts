import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    sku: string;
    marketplacePrice: number;
    stockQuantity: bigint;
    name: string;
    tags: Array<ProductTag>;
    sellingPrice: number;
    description: string;
    isActive: boolean;
    sizes: Array<string>;
    imageUrl?: string;
    reservedStock: bigint;
    createdTimestamp: Time;
    category: ProductCategory;
    colors: Array<string>;
    costPrice: number;
    fabric: string;
}
export interface Order {
    id: bigint;
    customerName: string;
    paymentMethod: string;
    customerPhone: string;
    orderStatus: string;
    shippingStatus: string;
    productId: bigint;
    productName: string;
    platform: string;
    orderValue: number;
    orderId: string;
    notes: string;
    createdTimestamp: Time;
    quantity: bigint;
}
export type Time = bigint;
export enum ProductCategory {
    unspecified = "unspecified",
    lehenga = "lehenga",
    saree = "saree",
    dupatta = "dupatta",
    fabric = "fabric",
    kurta = "kurta"
}
export enum ProductTag {
    premium = "premium",
    festive = "festive",
    bestseller = "bestseller",
    daily = "daily"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrder(persistentOrder: Order): Promise<bigint>;
    addProduct(persistentProduct: Product): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getLowStockProducts(): Promise<Array<Product>>;
    getProductsByCategory(persistentCategory: ProductCategory): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
}
