
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { ProductManagement } from "@/components/ProductManagement";
import { PointOfSale } from "@/components/PointOfSale";
import { Inventory } from "@/components/Inventory";
import { Reports } from "@/components/Reports";
import { LoginForm } from "@/components/LoginForm";

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier';
  email: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  lowStockThreshold: number;
}

export interface Sale {
  id: string;
  products: { product: Product; quantity: number }[];
  total: number;
  vat: number;
  cashier: string;
  date: Date;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Inyama y\'inka (Beef)',
      barcode: '1234567890123',
      price: 3500,
      stock: 25,
      category: 'Meat',
      lowStockThreshold: 5
    },
    {
      id: '2',
      name: 'Amata (Milk)',
      barcode: '2345678901234',
      price: 800,
      stock: 50,
      category: 'Dairy',
      lowStockThreshold: 10
    },
    {
      id: '3',
      name: 'Ubwoba (Bread)',
      barcode: '3456789012345',
      price: 500,
      stock: 3,
      category: 'Bakery',
      lowStockThreshold: 5
    }
  ]);
  const [sales, setSales] = useState<Sale[]>([]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const processSale = (saleData: Omit<Sale, 'id'>) => {
    const newSale = {
      ...saleData,
      id: Date.now().toString()
    };
    
    // Update stock levels
    saleData.products.forEach(({ product, quantity }) => {
      updateProduct(product.id, { stock: product.stock - quantity });
    });
    
    setSales([...sales, newSale]);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard products={products} sales={sales} />;
      case 'products':
        return (
          <ProductManagement
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            userRole={currentUser.role}
          />
        );
      case 'pos':
        return (
          <PointOfSale
            products={products}
            onSale={processSale}
            cashier={currentUser.name}
          />
        );
      case 'inventory':
        return <Inventory products={products} />;
      case 'reports':
        return <Reports sales={sales} />;
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        userRole={currentUser.role}
        userName={currentUser.name}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;
