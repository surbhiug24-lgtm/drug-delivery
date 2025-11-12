import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DrugInventory } from './components/DrugInventory';
import { WarehouseManagement } from './components/WarehouseManagement';
import { Reports } from './components/Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <DrugInventory />;
      case 'warehouses':
        return <WarehouseManagement />;
      case 'reports':
        return <Reports />;
      case 'suppliers':
        return (
          <div className="space-y-6">
            <div>
              <h1>Supplier Management</h1>
              <p className="text-muted-foreground">Manage supplier relationships and performance metrics</p>
            </div>
            <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
              <p className="text-muted-foreground">Supplier management interface coming soon...</p>
            </div>
          </div>
        );
      case 'hospitals':
        return (
          <div className="space-y-6">
            <div>
              <h1>Hospital Management</h1>
              <p className="text-muted-foreground">Monitor hospital consumption and distribution</p>
            </div>
            <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
              <p className="text-muted-foreground">Hospital management interface coming soon...</p>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-6">
            <div>
              <h1>Audit Trail</h1>
              <p className="text-muted-foreground">Track all system changes and transactions</p>
            </div>
            <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
              <p className="text-muted-foreground">Audit trail interface coming soon...</p>
            </div>
          </div>
        );
      case 'alerts':
        return (
          <div className="space-y-6">
            <div>
              <h1>System Alerts</h1>
              <p className="text-muted-foreground">Monitor critical alerts and notifications</p>
            </div>
            <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
              <p className="text-muted-foreground">Alert management interface coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="size-full flex bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}