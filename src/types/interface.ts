import {
  Address,
  Conversation,
  Material,
  Message,
  Notifications,
  OrderItems,
  Orders,
  Payment,
  Service,
  ServiceRating,
  Staff,
  Supplier,
  User,
} from "@prisma/client";

export interface SupplierWithMaterial extends Supplier {
  materials: Material[];
}

export interface MaterialWithSupplier extends Material {
  supplier: Supplier;
}

export interface ServiceWithMaterials extends Service {
  materials: MaterialWithSupplier[];
}

export interface UserWithProps extends User {
  address: Address[];
  orders: Orders[];
  notifications: Notifications[];
  conversation: Conversation[];
}

export interface OrderItemsWithService extends OrderItems {
  service: Service;
  serviceRating?: ServiceRating | null;
}

export interface OrderWithOrderItems extends Orders {
  orderItems: OrderItemsWithService[];
  user?: User | null;
  payments: Payment[];
}

export interface MessageWithProps extends Message {
  user: User | null;
  staff: Staff | null;
}
