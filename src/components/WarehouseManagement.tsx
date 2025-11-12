import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { InventoryService } from '../services/inventoryService';

export function WarehouseManagement() {
  const warehouses = InventoryService.getWarehouses();
  const inventory = InventoryService.getInventoryByWarehouse();

  const getWarehouseStats = (warehouseId: string) => {
    const warehouseInventory = inventory[warehouseId] || [];
    const totalDrugs = warehouseInventory.length;
    const totalStock = warehouseInventory.reduce((sum, item) => sum + item.totalStock, 0);
    const lowStockItems = warehouseInventory.filter(item => item.reorderRequired).length;
    const totalValue = warehouseInventory.reduce((sum, item) => {
      const drug = InventoryService.getDrugById(item.drugId)!;
      return sum + (item.totalStock * drug.unitPrice);
    }, 0);

    return { totalDrugs, totalStock, lowStockItems, totalValue };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Warehouse Management</h1>
        <p className="text-muted-foreground">
          Monitor warehouse capacity, occupancy, and inventory distribution
        </p>
      </div>

      {/* Warehouse Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {warehouses.map((warehouse) => {
          const occupancyPercentage = (warehouse.currentOccupancy / warehouse.capacity) * 100;
          const stats = getWarehouseStats(warehouse.id);
          
          return (
            <Card key={warehouse.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {warehouse.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{warehouse.location}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Capacity</span>
                    <span className="text-sm font-medium">
                      {warehouse.currentOccupancy.toLocaleString()} / {warehouse.capacity.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={occupancyPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {occupancyPercentage.toFixed(1)}% occupied
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{stats.totalDrugs}</p>
                    <p className="text-xs text-muted-foreground">Drug Types</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalStock.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Units</p>
                  </div>
                </div>

                {stats.lowStockItems > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">
                      {stats.lowStockItems} low stock items
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Inventory Value</p>
                  <p className="text-lg font-bold">${stats.totalValue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Warehouse Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detailed Warehouse Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Warehouse</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity Utilization</TableHead>
                <TableHead>Drug Types</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Low Stock Items</TableHead>
                <TableHead>Inventory Value</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((warehouse) => {
                const occupancyPercentage = (warehouse.currentOccupancy / warehouse.capacity) * 100;
                const stats = getWarehouseStats(warehouse.id);
                
                return (
                  <TableRow key={warehouse.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{warehouse.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={occupancyPercentage} className="h-2 w-20" />
                        <span className="text-xs text-muted-foreground">
                          {occupancyPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{stats.totalDrugs}</TableCell>
                    <TableCell>{stats.totalStock.toLocaleString()}</TableCell>
                    <TableCell>
                      {stats.lowStockItems > 0 ? (
                        <Badge variant="destructive">{stats.lowStockItems}</Badge>
                      ) : (
                        <Badge variant="default">0</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${stats.totalValue.toLocaleString()}
                    </TableCell>
                    <TableCell>{warehouse.managerId}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Warehouse Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Warehouses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses
                .map(warehouse => ({
                  warehouse,
                  stats: getWarehouseStats(warehouse.id),
                  occupancy: (warehouse.currentOccupancy / warehouse.capacity) * 100
                }))
                .sort((a, b) => b.stats.totalValue - a.stats.totalValue)
                .map(({ warehouse, stats, occupancy }, index) => (
                  <div key={warehouse.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${stats.totalValue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{occupancy.toFixed(1)}% capacity</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses.map(warehouse => {
                const occupancyPercentage = (warehouse.currentOccupancy / warehouse.capacity) * 100;
                
                return (
                  <div key={warehouse.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{warehouse.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {occupancyPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={occupancyPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {warehouses.map(warehouse => {
                const stats = getWarehouseStats(warehouse.id);
                const occupancy = (warehouse.currentOccupancy / warehouse.capacity) * 100;
                
                return (
                  <div key={warehouse.id}>
                    {stats.lowStockItems > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{warehouse.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {stats.lowStockItems} items need reordering
                          </p>
                        </div>
                      </div>
                    )}
                    {occupancy > 90 && (
                      <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{warehouse.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Near capacity limit ({occupancy.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}