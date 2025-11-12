import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FileText, TrendingUp, AlertTriangle, Users, Package, Clock } from 'lucide-react';
import { InventoryService } from '../services/inventoryService';

export function Reports() {
  const [selectedHospital, setSelectedHospital] = useState<string>('all');
  
  const expiringDrugs = InventoryService.getBatchesExpiringInDays(30);
  const lowStockItems = InventoryService.getDrugsBelowThreshold();
  const topDrugs = InventoryService.getTopDrugsByConsumption(10);
  const hospitals = InventoryService.getHospitals();
  const highConsumptionHospitals = InventoryService.getHospitalsByHighestConsumption();
  const supplierPerformance = InventoryService.getSupplierDeliveryPerformance();
  const suppliersWithMaxPending = InventoryService.getSuppliersWithMaxPendingOrders();
  const consumptionByCategory = InventoryService.getConsumptionByDrugCategory();

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

  return (
    <div className="space-y-6">
      <div>
        <h1>Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive reports and insights for supply chain management
        </p>
      </div>

      <Tabs defaultValue="expiry" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="expiry">Expiry Report</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="stock">Stock Status</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
        </TabsList>

        {/* Expiry Report */}
        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Drugs Expiring Within 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Value at Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringDrugs.map((batch) => {
                    const daysLeft = getDaysUntilExpiry(batch.expiryDate);
                    const valueAtRisk = batch.remainingQuantity * batch.unitCost;
                    
                    return (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{batch.drug.name}</p>
                            <p className="text-sm text-muted-foreground">{batch.drug.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>{batch.batchNumber}</TableCell>
                        <TableCell>{batch.warehouse.name}</TableCell>
                        <TableCell>{batch.remainingQuantity.toLocaleString()}</TableCell>
                        <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                        <TableCell>
                          <Badge variant={daysLeft <= 7 ? "destructive" : daysLeft <= 14 ? "secondary" : "outline"}>
                            {daysLeft} days
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${valueAtRisk.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumption Report */}
        <TabsContent value="consumption" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top 10 Drugs by Consumption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDrugs.map((item, index) => (
                    <div key={item.drug.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.drug.name}</p>
                          <p className="text-sm text-muted-foreground">{item.drug.category}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {item.totalConsumption.toLocaleString()} units
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hospital Consumption by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(consumptionByCategory).map(([hospitalName, categories]) => (
                    <div key={hospitalName} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">{hospitalName}</h4>
                      <div className="space-y-2">
                        {Object.entries(categories).map(([category, consumption]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="text-sm">{category}</span>
                            <Badge variant="outline">{consumption.toLocaleString()}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Status Report */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Drugs Below Reorder Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Shortage</TableHead>
                    <TableHead>Action Required</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item, index) => {
                    const shortage = item.drug.reorderThreshold - item.currentStock;
                    
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.drug.name}</p>
                            <p className="text-sm text-muted-foreground">{item.drug.genericName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.drug.category}</Badge>
                        </TableCell>
                        <TableCell>{item.warehouse.name}</TableCell>
                        <TableCell>{item.currentStock.toLocaleString()}</TableCell>
                        <TableCell>{item.drug.reorderThreshold.toLocaleString()}</TableCell>
                        <TableCell className="text-destructive font-medium">
                          {shortage.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Create Order
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplier Performance */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Supplier Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Avg Delay (Days)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierPerformance.map((item) => (
                      <TableRow key={item.supplier.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.supplier.name}</p>
                            <p className="text-sm text-muted-foreground">{item.supplier.contactPerson}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.supplier.rating >= 4.5 ? "default" : item.supplier.rating >= 4.0 ? "secondary" : "destructive"}>
                            {item.supplier.rating.toFixed(1)} ⭐
                          </Badge>
                        </TableCell>
                        <TableCell>{item.averageDelay.toFixed(1)}</TableCell>
                        <TableCell>
                          <Badge variant={item.averageDelay <= 1 ? "default" : item.averageDelay <= 2 ? "secondary" : "destructive"}>
                            {item.averageDelay <= 1 ? "Excellent" : item.averageDelay <= 2 ? "Good" : "Poor"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suppliers with Maximum Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliersWithMaxPending.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">{supplier.pendingOrders} pending</Badge>
                        <p className="text-sm text-muted-foreground">{supplier.totalOrders} total orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hospital Analysis */}
        <TabsContent value="hospitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hospitals by Consumption (Last 3 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Hospital Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Bed Capacity</TableHead>
                    <TableHead>Total Consumption</TableHead>
                    <TableHead>Consumption/Bed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highConsumptionHospitals.map((hospital, index) => {
                    const consumptionPerBed = ((hospital.totalConsumption || 0) / hospital.bedCapacity).toFixed(1);
                    
                    return (
                      <TableRow key={hospital.id}>
                        <TableCell>
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{hospital.name}</p>
                            <p className="text-sm text-muted-foreground">{hospital.contactPerson}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{hospital.type}</Badge>
                        </TableCell>
                        <TableCell>{hospital.location}</TableCell>
                        <TableCell>{hospital.bedCapacity.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">
                          {(hospital.totalConsumption || 0).toLocaleString()} units
                        </TableCell>
                        <TableCell>{consumptionPerBed}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipments Report */}
        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Shipments for Paracetamol
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Shipment ID</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {InventoryService.getShipmentsByDrug('Paracetamol').map((shipment) => (
                    <TableRow key={shipment.orderId}>
                      <TableCell>{shipment.orderId}</TableCell>
                      <TableCell>{shipment.shipmentId}</TableCell>
                      <TableCell>
                        {shipment.receivedDate ? formatDate(shipment.receivedDate) : 'Pending'}
                      </TableCell>
                      <TableCell>{shipment.warehouse}</TableCell>
                      <TableCell>
                        <Badge variant={shipment.receivedDate ? "default" : "secondary"}>
                          {shipment.receivedDate ? "Delivered" : "In Transit"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}