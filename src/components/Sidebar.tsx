import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  Building2, 
  Users, 
  FileText, 
  TruckIcon, 
  AlertTriangle,
  Settings,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Drug Inventory',
      icon: Package,
      badge: null
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: Building2,
      badge: null
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      icon: TruckIcon,
      badge: null
    },
    {
      id: 'hospitals',
      label: 'Hospitals',
      icon: Users,
      badge: null
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      badge: null
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: Activity,
      badge: null
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: 8
    }
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Drug Inventory System</h2>
        <p className="text-sm text-muted-foreground">Supply Chain Management</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isActive ? '' : 'text-muted-foreground'}`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="destructive" className="ml-2">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}