import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Package, AlertTriangle, Calendar } from 'lucide-react';
import { InventoryService } from '../services/inventoryService';

export function DrugInventory() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const warehouses = InventoryService.getWarehouses();
  const inventory = InventoryService.getInventoryByWarehouse();
  const drugs = InventoryService.getDrugs();

  // Filter and search logic
  const filteredInventory = React.useMemo(() => {
    let items: any[] = [];
    
    if (selectedWarehouse === 'all') {
      Object.entries(inventory).forEach(([warehouseId, warehouseItems]) => {
        const warehouse = InventoryService.getWarehouseById(warehouseId);
        items.push(...warehouseItems.map(item => ({
          ...item,
          warehouseName: warehouse?.name
        })));
      });
    } else {
      const warehouseItems = inventory[selectedWarehouse] || [];
      const warehouse = InventoryService.getWarehouseById(selectedWarehouse);
      items = warehouseItems.map(item => ({
        ...item,
        warehouseName: warehouse?.name
      }));
    }

    if (searchTerm) {
      items = items.filter(item => {
        const drug = InventoryService.getDrugById(item.drugId);
        return drug?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               drug?.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               drug?.category.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return items;
  }, [inventory, selectedWarehouse, searchTerm]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStockStatusBadge = (item: any) => {
    if (item.reorderRequired) {
      return <Badge variant="destructive">Low Stock</Badge>;
    }
    if (item.totalStock > 1000) {
      return <Badge variant="default">Good Stock</Badge>;
    }
    return <Badge variant="secondary">Moderate</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Drug Inventory</h1>
        <p className="text-muted-foreground">
          Manage and monitor drug stock levels across warehouses
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drugs by name, generic name, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Drug Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Total Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Batches</TableHead>
                <TableHead>Next Expiry</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item, index) => {
                const drug = InventoryService.getDrugById(item.drugId)!;
                const nextExpiry = item.batches.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())[0];
                const daysUntilExpiry = nextExpiry ? getDaysUntilExpiry(nextExpiry.expiryDate) : null;
                
                return (
                  <TableRow key={`${item.drugId}-${item.warehouseId}-${index}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{drug.name}</p>
                        <p className="text-sm text-muted-foreground">{drug.genericName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{drug.category}</Badge>
                    </TableCell>
                    <TableCell>{item.warehouseName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.totalStock.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Threshold: {drug.reorderThreshold}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStockStatusBadge(item)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.batches.length} batches</Badge>
                    </TableCell>
                    <TableCell>
                      {nextExpiry && (
                        <div className="flex items-center gap-2">
                          {daysUntilExpiry! <= 30 && (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                          <div>
                            <p className="text-sm">{formatDate(nextExpiry.expiryDate)}</p>
                            <p className={`text-xs ${daysUntilExpiry! <= 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {daysUntilExpiry} days
                            </p>
                          </div>
                        </div>
                      )}
                    </TableCell>
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

      {/* Batch Details Modal would go here */}
    </div>
  );
}