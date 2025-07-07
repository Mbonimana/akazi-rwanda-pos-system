
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  Home,
  Warehouse
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  userRole: 'admin' | 'cashier';
  userName: string;
  onLogout: () => void;
}

export const Sidebar = ({ 
  activeView, 
  onViewChange, 
  userRole, 
  userName, 
  onLogout 
}: SidebarProps) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      roles: ['admin', 'cashier']
    },
    {
      id: 'pos',
      label: 'Point of Sale',
      icon: ShoppingCart,
      roles: ['admin', 'cashier']
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      roles: ['admin']
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Warehouse,
      roles: ['admin', 'cashier']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-white shadow-lg border-r">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">SuperMarket POS</h1>
        <p className="text-sm text-gray-500 mt-1">Rwanda</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                activeView === item.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Separator className="mx-4" />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
