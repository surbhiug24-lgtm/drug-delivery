import { Drug, Supplier, Manufacturer, Warehouse, Hospital, Batch, Order, Shipment, StockMovement, Consumption } from '../types';

export const drugs: Drug[] = [
  { id: 'D001', name: 'Paracetamol', genericName: 'Acetaminophen', category: 'Analgesic', dosageForm: 'Tablet', strength: '500mg', reorderThreshold: 100, unitPrice: 2.5 },
  { id: 'D002', name: 'Amoxicillin', genericName: 'Amoxicillin', category: 'Antibiotic', dosageForm: 'Capsule', strength: '250mg', reorderThreshold: 50, unitPrice: 8.0 },
  { id: 'D003', name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'NSAID', dosageForm: 'Tablet', strength: '400mg', reorderThreshold: 75, unitPrice: 3.2 },
  { id: 'D004', name: 'Metformin', genericName: 'Metformin HCl', category: 'Antidiabetic', dosageForm: 'Tablet', strength: '500mg', reorderThreshold: 80, unitPrice: 4.5 },
  { id: 'D005', name: 'Lisinopril', genericName: 'Lisinopril', category: 'ACE Inhibitor', dosageForm: 'Tablet', strength: '10mg', reorderThreshold: 60, unitPrice: 6.8 },
  { id: 'D006', name: 'Amlodipine', genericName: 'Amlodipine Besylate', category: 'Calcium Channel Blocker', dosageForm: 'Tablet', strength: '5mg', reorderThreshold: 70, unitPrice: 5.2 },
  { id: 'D007', name: 'Aspirin', genericName: 'Acetylsalicylic Acid', category: 'Antiplatelet', dosageForm: 'Tablet', strength: '81mg', reorderThreshold: 120, unitPrice: 1.8 },
  { id: 'D008', name: 'Omeprazole', genericName: 'Omeprazole', category: 'PPI', dosageForm: 'Capsule', strength: '20mg', reorderThreshold: 90, unitPrice: 7.3 },
];

export const suppliers: Supplier[] = [
  { id: 'S001', name: 'MedSupply Corp', contactPerson: 'John Smith', email: 'john@medsupply.com', phone: '+1234567890', address: '123 Medical St, Boston', rating: 4.5, totalOrders: 156, pendingOrders: 3, averageDeliveryDelay: 1.2 },
  { id: 'S002', name: 'PharmaCare Ltd', contactPerson: 'Sarah Johnson', email: 'sarah@pharmacare.com', phone: '+1234567891', address: '456 Health Ave, Chicago', rating: 4.2, totalOrders: 98, pendingOrders: 7, averageDeliveryDelay: 2.1 },
  { id: 'S003', name: 'Global Pharma', contactPerson: 'Mike Chen', email: 'mike@globalpharma.com', phone: '+1234567892', address: '789 Drug Blvd, Los Angeles', rating: 4.8, totalOrders: 234, pendingOrders: 2, averageDeliveryDelay: 0.8 },
  { id: 'S004', name: 'HealthFirst Supply', contactPerson: 'Lisa Brown', email: 'lisa@healthfirst.com', phone: '+1234567893', address: '321 Care Lane, Miami', rating: 3.9, totalOrders: 67, pendingOrders: 5, averageDeliveryDelay: 3.2 },
];

export const manufacturers: Manufacturer[] = [
  { id: 'M001', name: 'Global Pharmaceuticals', licenseNumber: 'GPL-2023-001', country: 'USA', certifications: ['FDA', 'GMP'] },
  { id: 'M002', name: 'European MedTech', licenseNumber: 'EMT-2023-002', country: 'Germany', certifications: ['EMA', 'ISO 13485'] },
  { id: 'M003', name: 'Asian Health Solutions', licenseNumber: 'AHS-2023-003', country: 'India', certifications: ['WHO-GMP', 'ISO 9001'] },
  { id: 'M004', name: 'Canadian Therapeutics', licenseNumber: 'CT-2023-004', country: 'Canada', certifications: ['Health Canada', 'GMP'] },
];

export const warehouses: Warehouse[] = [
  { id: 'W001', name: 'Central Warehouse', location: 'New York', capacity: 50000, currentOccupancy: 35000, managerId: 'U001' },
  { id: 'W002', name: 'West Coast Hub', location: 'California', capacity: 40000, currentOccupancy: 28000, managerId: 'U002' },
  { id: 'W003', name: 'Southern Distribution', location: 'Texas', capacity: 30000, currentOccupancy: 22000, managerId: 'U003' },
  { id: 'W004', name: 'Midwest Storage', location: 'Illinois', capacity: 35000, currentOccupancy: 18000, managerId: 'U004' },
];

export const hospitals: Hospital[] = [
  { id: 'H001', name: 'General Hospital', location: 'New York', type: 'General', bedCapacity: 500, contactPerson: 'Dr. Williams', totalConsumption: 45000 },
  { id: 'H002', name: 'Children\'s Medical Center', location: 'California', type: 'Pediatric', bedCapacity: 200, contactPerson: 'Dr. Davis', totalConsumption: 28000 },
  { id: 'H003', name: 'Regional Medical Center', location: 'Texas', type: 'Regional', bedCapacity: 800, contactPerson: 'Dr. Miller', totalConsumption: 62000 },
  { id: 'H004', name: 'Community Health', location: 'Illinois', type: 'Community', bedCapacity: 150, contactPerson: 'Dr. Wilson', totalConsumption: 18000 },
  { id: 'H005', name: 'Specialty Care Hospital', location: 'Florida', type: 'Specialty', bedCapacity: 300, contactPerson: 'Dr. Garcia', totalConsumption: 35000 },
];

const currentDate = new Date();
const futureDate = (days: number) => new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
const pastDate = (days: number) => new Date(currentDate.getTime() - days * 24 * 60 * 60 * 1000);

export const batches: Batch[] = [
  { id: 'B001', drugId: 'D001', batchNumber: 'PAR2024001', manufacturerId: 'M001', manufacturingDate: pastDate(90), expiryDate: futureDate(270), quantity: 5000, remainingQuantity: 3200, warehouseId: 'W001', supplierId: 'S001', unitCost: 2.0, status: 'active' },
  { id: 'B002', drugId: 'D001', batchNumber: 'PAR2024002', manufacturerId: 'M001', manufacturingDate: pastDate(60), expiryDate: futureDate(25), quantity: 3000, remainingQuantity: 450, warehouseId: 'W001', supplierId: 'S001', unitCost: 2.1, status: 'active' },
  { id: 'B003', drugId: 'D002', batchNumber: 'AMX2024001', manufacturerId: 'M002', manufacturingDate: pastDate(120), expiryDate: futureDate(240), quantity: 2000, remainingQuantity: 1800, warehouseId: 'W002', supplierId: 'S002', unitCost: 7.5, status: 'active' },
  { id: 'B004', drugId: 'D003', batchNumber: 'IBU2024001', manufacturerId: 'M003', manufacturingDate: pastDate(45), expiryDate: futureDate(315), quantity: 4000, remainingQuantity: 2100, warehouseId: 'W001', supplierId: 'S003', unitCost: 2.8, status: 'active' },
  { id: 'B005', drugId: 'D004', batchNumber: 'MET2024001', manufacturerId: 'M004', manufacturingDate: pastDate(30), expiryDate: futureDate(18), quantity: 1500, remainingQuantity: 75, warehouseId: 'W003', supplierId: 'S001', unitCost: 4.0, status: 'active' },
  { id: 'B006', drugId: 'D005', batchNumber: 'LIS2024001', manufacturerId: 'M001', manufacturingDate: pastDate(75), expiryDate: futureDate(285), quantity: 2500, remainingQuantity: 1900, warehouseId: 'W002', supplierId: 'S004', unitCost: 6.2, status: 'active' },
  { id: 'B007', drugId: 'D006', batchNumber: 'AML2024001', manufacturerId: 'M002', manufacturingDate: pastDate(15), expiryDate: futureDate(345), quantity: 3500, remainingQuantity: 3100, warehouseId: 'W004', supplierId: 'S003', unitCost: 4.8, status: 'active' },
  { id: 'B008', drugId: 'D007', batchNumber: 'ASP2024001', manufacturerId: 'M003', manufacturingDate: pastDate(100), expiryDate: futureDate(8), quantity: 6000, remainingQuantity: 150, warehouseId: 'W001', supplierId: 'S002', unitCost: 1.5, status: 'active' },
];

export const orders: Order[] = [
  {
    id: 'O001',
    supplierId: 'S001',
    warehouseId: 'W001',
    orderDate: pastDate(15),
    expectedDeliveryDate: pastDate(8),
    actualDeliveryDate: pastDate(6),
    status: 'delivered',
    totalAmount: 15000,
    items: [
      { drugId: 'D001', quantity: 3000, unitPrice: 2.5 },
      { drugId: 'D004', quantity: 1500, unitPrice: 4.5 }
    ]
  },
  {
    id: 'O002',
    supplierId: 'S002',
    warehouseId: 'W002',
    orderDate: pastDate(10),
    expectedDeliveryDate: futureDate(2),
    status: 'pending',
    totalAmount: 12000,
    items: [
      { drugId: 'D002', quantity: 1000, unitPrice: 8.0 },
      { drugId: 'D003', quantity: 800, unitPrice: 3.2 }
    ]
  },
  {
    id: 'O003',
    supplierId: 'S003',
    warehouseId: 'W003',
    orderDate: pastDate(5),
    expectedDeliveryDate: futureDate(5),
    status: 'shipped',
    totalAmount: 18000,
    items: [
      { drugId: 'D005', quantity: 2000, unitPrice: 6.8 },
      { drugId: 'D006', quantity: 1500, unitPrice: 5.2 }
    ]
  }
];

export const shipments: Shipment[] = [
  {
    id: 'SH001',
    orderId: 'O001',
    shipmentDate: pastDate(8),
    receivedDate: pastDate(6),
    warehouseId: 'W001',
    supplierId: 'S001',
    status: 'delivered',
    batches: ['B001', 'B005']
  },
  {
    id: 'SH002',
    orderId: 'O002',
    shipmentDate: pastDate(3),
    warehouseId: 'W002',
    supplierId: 'S002',
    status: 'in_transit',
    batches: ['B003']
  }
];

export const stockMovements: StockMovement[] = [
  { id: 'SM001', drugId: 'D001', batchId: 'B001', warehouseId: 'W001', movementType: 'inbound', quantity: 5000, timestamp: pastDate(30), reason: 'New stock received', performedBy: 'system' },
  { id: 'SM002', drugId: 'D001', batchId: 'B001', warehouseId: 'W001', hospitalId: 'H001', movementType: 'outbound', quantity: 1000, timestamp: pastDate(20), reason: 'Hospital order fulfillment', performedBy: 'operator1' },
  { id: 'SM003', drugId: 'D002', batchId: 'B003', warehouseId: 'W002', hospitalId: 'H002', movementType: 'outbound', quantity: 200, timestamp: pastDate(15), reason: 'Emergency supply', performedBy: 'operator2' },
  { id: 'SM004', drugId: 'D003', batchId: 'B004', warehouseId: 'W001', movementType: 'adjustment', quantity: -50, timestamp: pastDate(10), reason: 'Damaged goods', performedBy: 'manager1' },
];

export const consumptions: Consumption[] = [
  { id: 'C001', hospitalId: 'H001', drugId: 'D001', batchId: 'B001', quantity: 800, consumptionDate: pastDate(18), requestedBy: 'Dr. Williams' },
  { id: 'C002', hospitalId: 'H002', drugId: 'D002', batchId: 'B003', quantity: 150, consumptionDate: pastDate(12), requestedBy: 'Dr. Davis' },
  { id: 'C003', hospitalId: 'H003', drugId: 'D001', batchId: 'B001', quantity: 1200, consumptionDate: pastDate(8), requestedBy: 'Dr. Miller' },
  { id: 'C004', hospitalId: 'H001', drugId: 'D003', batchId: 'B004', quantity: 300, consumptionDate: pastDate(5), requestedBy: 'Dr. Williams' },
  { id: 'C005', hospitalId: 'H004', drugId: 'D004', batchId: 'B005', quantity: 80, consumptionDate: pastDate(3), requestedBy: 'Dr. Wilson' },
];