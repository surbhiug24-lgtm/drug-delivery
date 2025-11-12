import { Drug, Supplier, Warehouse, Hospital, Batch, Order, StockMovement, Consumption, InventoryItem } from '../types';
import { drugs, suppliers, warehouses, hospitals, batches, orders, stockMovements, consumptions } from '../data/mockData';

export class InventoryService {
  // Drug Management
  static getDrugs(): Drug[] {
    return drugs;
  }

  static getDrugById(id: string): Drug | undefined {
    return drugs.find(drug => drug.id === id);
  }

  // Supplier Management
  static getSuppliers(): Supplier[] {
    return suppliers;
  }

  static getSupplierById(id: string): Supplier | undefined {
    return suppliers.find(supplier => supplier.id === id);
  }

  static getSuppliersWithMaxPendingOrders(): Supplier[] {
    const maxPending = Math.max(...suppliers.map(s => s.pendingOrders));
    return suppliers.filter(s => s.pendingOrders === maxPending);
  }

  // Warehouse Management
  static getWarehouses(): Warehouse[] {
    return warehouses;
  }

  static getWarehouseById(id: string): Warehouse | undefined {
    return warehouses.find(warehouse => warehouse.id === id);
  }

  // Hospital Management
  static getHospitals(): Hospital[] {
    return hospitals;
  }

  static getHospitalById(id: string): Hospital | undefined {
    return hospitals.find(hospital => hospital.id === id);
  }

  static getHospitalsByHighestConsumption(months: number = 3): Hospital[] {
    // In a real system, this would filter by date range
    return [...hospitals].sort((a, b) => (b.totalConsumption || 0) - (a.totalConsumption || 0));
  }

  // Batch Management
  static getBatches(): Batch[] {
    return batches;
  }

  static getBatchesByDrug(drugId: string): Batch[] {
    return batches.filter(batch => batch.drugId === drugId);
  }

  static getBatchesBySupplier(supplierId: string): Batch[] {
    return batches.filter(batch => batch.supplierId === supplierId);
  }

  static getBatchesExpiringInDays(days: number): Array<Batch & { drug: Drug; warehouse: Warehouse }> {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    
    return batches
      .filter(batch => batch.expiryDate <= targetDate && batch.status === 'active')
      .map(batch => ({
        ...batch,
        drug: this.getDrugById(batch.drugId)!,
        warehouse: this.getWarehouseById(batch.warehouseId)!
      }))
      .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
  }

  // Inventory Calculations
  static getInventoryByWarehouse(): Record<string, InventoryItem[]> {
    const inventory: Record<string, InventoryItem[]> = {};

    warehouses.forEach(warehouse => {
      const warehouseBatches = batches.filter(b => b.warehouseId === warehouse.id);
      const drugGroups = this.groupBy(warehouseBatches, 'drugId');

      inventory[warehouse.id] = Object.entries(drugGroups).map(([drugId, drugBatches]) => {
        const totalStock = drugBatches.reduce((sum, batch) => sum + batch.remainingQuantity, 0);
        const drug = this.getDrugById(drugId)!;
        
        return {
          drugId,
          warehouseId: warehouse.id,
          totalStock,
          availableStock: totalStock,
          reservedStock: 0,
          batches: drugBatches.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime()), // FIFO
          reorderRequired: totalStock < drug.reorderThreshold
        };
      });
    });

    return inventory;
  }

  static getDrugsBelowThreshold(): Array<{ drug: Drug; warehouse: Warehouse; currentStock: number }> {
    const inventory = this.getInventoryByWarehouse();
    const result: Array<{ drug: Drug; warehouse: Warehouse; currentStock: number }> = [];

    Object.entries(inventory).forEach(([warehouseId, items]) => {
      items.forEach(item => {
        if (item.reorderRequired) {
          result.push({
            drug: this.getDrugById(item.drugId)!,
            warehouse: this.getWarehouseById(warehouseId)!,
            currentStock: item.totalStock
          });
        }
      });
    });

    return result;
  }

  // Stock Movement and Consumption
  static getStockMovements(): StockMovement[] {
    return stockMovements;
  }

  static getConsumptions(): Consumption[] {
    return consumptions;
  }

  static getConsumptionByHospital(hospitalId?: string): Consumption[] {
    if (hospitalId) {
      return consumptions.filter(c => c.hospitalId === hospitalId);
    }
    return consumptions;
  }

  static getConsumptionByDrugCategory(): Record<string, Record<string, number>> {
    const result: Record<string, Record<string, number>> = {};

    consumptions.forEach(consumption => {
      const drug = this.getDrugById(consumption.drugId);
      const hospital = this.getHospitalById(consumption.hospitalId);
      
      if (drug && hospital) {
        if (!result[hospital.name]) {
          result[hospital.name] = {};
        }
        if (!result[hospital.name][drug.category]) {
          result[hospital.name][drug.category] = 0;
        }
        result[hospital.name][drug.category] += consumption.quantity;
      }
    });

    return result;
  }

  static getTopDrugsByConsumption(limit: number = 5): Array<{ drug: Drug; totalConsumption: number }> {
    const consumptionByDrug: Record<string, number> = {};

    consumptions.forEach(consumption => {
      if (!consumptionByDrug[consumption.drugId]) {
        consumptionByDrug[consumption.drugId] = 0;
      }
      consumptionByDrug[consumption.drugId] += consumption.quantity;
    });

    return Object.entries(consumptionByDrug)
      .map(([drugId, totalConsumption]) => ({
        drug: this.getDrugById(drugId)!,
        totalConsumption
      }))
      .sort((a, b) => b.totalConsumption - a.totalConsumption)
      .slice(0, limit);
  }

  // Orders and Shipments
  static getOrders(): Order[] {
    return orders;
  }

  static getShipmentsByDrug(drugName: string): Array<any> {
    // In a real system, this would join tables properly
    return orders
      .filter(order => order.items.some(item => {
        const drug = this.getDrugById(item.drugId);
        return drug?.name.toLowerCase() === drugName.toLowerCase();
      }))
      .map(order => ({
        orderId: order.id,
        shipmentId: `SH${order.id.slice(1)}`,
        receivedDate: order.actualDeliveryDate,
        warehouse: this.getWarehouseById(order.warehouseId)?.name
      }));
  }

  static getSupplierDeliveryPerformance(): Array<{ supplier: Supplier; averageDelay: number }> {
    return suppliers.map(supplier => ({
      supplier,
      averageDelay: supplier.averageDeliveryDelay
    })).sort((a, b) => a.averageDelay - b.averageDelay);
  }

  // Utility functions
  private static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }

  // Dashboard Statistics
  static getDashboardStats() {
    const totalDrugs = drugs.length;
    const totalWarehouses = warehouses.length;
    const totalSuppliers = suppliers.length;
    const totalHospitals = hospitals.length;
    
    const expiringBatches = this.getBatchesExpiringInDays(30).length;
    const lowStockItems = this.getDrugsBelowThreshold().length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    const totalInventoryValue = batches.reduce((sum, batch) => 
      sum + (batch.remainingQuantity * batch.unitCost), 0
    );

    return {
      totalDrugs,
      totalWarehouses,
      totalSuppliers,
      totalHospitals,
      expiringBatches,
      lowStockItems,
      pendingOrders,
      totalInventoryValue
    };
  }
}