import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Prefab mixins
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Product Types
  type ProductCategory = {
    #saree;
    #kurta;
    #dupatta;
    #lehenga;
    #fabric;
    #unspecified;
  };

  type ProductTag = {
    #festive;
    #premium;
    #daily;
    #bestseller;
  };

  type Product = {
    id : Nat;
    name : Text;
    sku : Text;
    category : ProductCategory;
    fabric : Text;
    sizes : [Text];
    colors : [Text];
    description : Text;
    costPrice : Float;
    sellingPrice : Float;
    marketplacePrice : Float;
    stockQuantity : Nat;
    reservedStock : Nat;
    isActive : Bool;
    tags : [ProductTag];
    imageUrl : ?Text;
    createdTimestamp : Time.Time;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  type Order = {
    id : Nat;
    orderId : Text;
    customerName : Text;
    customerPhone : Text;
    productId : Nat;
    productName : Text;
    quantity : Nat;
    orderValue : Float;
    platform : Text;
    paymentMethod : Text;
    shippingStatus : Text;
    orderStatus : Text;
    notes : Text;
    createdTimestamp : Time.Time;
  };

  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  // Product management functions (CRUD), using persistent arrays for tags
  public shared ({ caller }) func addProduct(persistentProduct : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    let newProduct = { persistentProduct with tags = persistentProduct.tags };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    nextProductId - 1;
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view products");
    };
    products.values().toArray();
  };

  public query ({ caller }) func getLowStockProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view inventory");
    };
    products.values().toArray().filter(func(product) { product.stockQuantity < 5 });
  };

  public query ({ caller }) func getProductsByCategory(persistentCategory : ProductCategory) : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view products");
    };
    products.values().toArray().filter(func(product) { product.category == persistentCategory });
  };

  func removeTag(tag : ProductTag, tags : [ProductTag]) : [ProductTag] {
    tags.filter(func(existingTag) { tag != existingTag });
  };

  // Order management functions (CRUD)
  public shared ({ caller }) func addOrder(persistentOrder : Order) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add orders");
    };
    let newOrder = { persistentOrder with orderId = persistentOrder.orderId };
    orders.add(nextOrderId, newOrder);
    nextOrderId += 1;
    nextOrderId - 1;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };
    orders.values().toArray();
  };
};
