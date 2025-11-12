export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  reorderThreshold: number;
  unitPrice: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  totalOrders: number;
  pendingOrders: number;
  averageDeliveryDelay: number;
}

export interface Manufacturer {
  id: string;
  name: string;
  licenseNumber: string;
  country: string;
  certifications: string[];
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  managerId: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  type: string;
  bedCapacity: number;
  contactPerson: string;
  totalConsumption?: number;
}

export interface Batch {
  id: string;
  drugId: string;
  batchNumber: string;
  manufacturerId: string;
  manufacturingDate: Date;
  expiryDate: Date;
  quantity: number;
  remainingQuantity: number;
  warehouseId: string;
  supplierId: string;
  unitCost: number;
  status: 'active' | 'expired' | 'consumed';
}

export interface Order {
  id: string;
  supplierId: string;
  warehouseId: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderItem {
  drugId: string;
  quantity: number;
  unitPrice: number;
}

export interface Shipment {
  id: string;
  orderId: string;
  shipmentDate: Date;
  receivedDate?: Date;
  warehouseId: string;
  supplierId: string;
  status: 'in_transit' | 'delivered' | 'delayed';
  batches: string[]; // batch IDs
}

export interface StockMovement {
  id: string;
  drugId: string;
  batchId: string;
  warehouseId: string;
  hospitalId?: string;
  movementType: 'inbound' | 'outbound' | 'transfer' | 'adjustment';
  quantity: number;
  timestamp: Date;
  reason: string;
  performedBy: string;
}

export interface Consumption {
  id: string;
  hospitalId: string;
  drugId: string;
  batchId: string;
  quantity: number;
  consumptionDate: Date;
  requestedBy: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changes: Record<string, any>;
  timestamp: Date;
  performedBy: string;
}

export interface InventoryItem {
  drugId: string;
  warehouseId: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  batches: Batch[];
  reorderRequired: boolean;
}