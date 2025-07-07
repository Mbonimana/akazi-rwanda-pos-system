
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sale } from "@/pages/Index";
import { BarChart3, TrendingUp, Calendar, Download } from "lucide-react";

interface ReportsProps {
  sales: Sale[];
}

export const Reports = ({ sales }: ReportsProps) => {
  const [reportPeriod, setReportPeriod] = useState("today");
  
  const formatCurrency = (amount: number) => {
    return `RWF ${amount.toLocaleString()}`;
  };

  const getFilteredSales = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      
      switch (reportPeriod) {
        case 'today':
          return saleDate >= today;
        case 'week':
          return saleDate >= weekAgo;
        case 'month':
          return saleDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalVAT = filteredSales.reduce((sum, sale) => sum + sale.vat, 0);
  const totalTransactions = filteredSales.length;
  const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const getTopProducts = () => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    filteredSales.forEach(sale => {
      sale.products.forEach(({ product, quantity }) => {
        if (!productSales[product.id]) {
          productSales[product.id] = { name: product.name, quantity: 0, revenue: 0 };
        }
        productSales[product.id].quantity += quantity;
        productSales[product.id].revenue += product.price * quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  const getCashierPerformance = () => {
    const cashierSales: { [key: string]: { sales: number; revenue: number } } = {};
    
    filteredSales.forEach(sale => {
      if (!cashierSales[sale.cashier]) {
        cashierSales[sale.cashier] = { sales: 0, revenue: 0 };
      }
      cashierSales[sale.cashier].sales += 1;
      cashierSales[sale.cashier].revenue += sale.total;
    });

    return Object.entries(cashierSales).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.revenue - a.revenue);
  };

  const cashierPerformance = getCashierPerformance();

  const getDailySales = () => {
    const dailySales: { [key: string]: number } = {};
    
    filteredSales.forEach(sale => {
      const dateKey = new Date(sale.date).toDateString();
      if (!dailySales[dateKey]) {
        dailySales[dateKey] = 0;
      }
      dailySales[dateKey] += sale.total;
    });

    return Object.entries(dailySales)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7); // Last 7 days
  };

  const dailySales = getDailySales();

  const getPeriodLabel = () => {
    switch (reportPeriod) {
      case 'today': return "Today's";
      case 'week': return "This Week's";
      case 'month': return "This Month's";
      default: return "All Time";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600">Analyze your business performance</p>
        </div>
        
        <div className="flex gap-4">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {getPeriodLabel()} earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {getPeriodLabel()} sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageTransaction)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VAT Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVAT)}</div>
            <p className="text-xs text-muted-foreground">
              18% tax collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cashier Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Cashier Performance</CardTitle>
            <CardDescription>Sales performance by cashier</CardDescription>
          </CardHeader>
          <CardContent>
            {cashierPerformance.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            ) : (
              <div className="space-y-4">
                {cashierPerformance.map((cashier) => (
                  <div key={cashier.name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cashier.name}</p>
                      <p className="text-sm text-gray-600">{cashier.sales} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(cashier.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Sales Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>Revenue over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dailySales.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            ) : (
              <div className="space-y-3">
                {dailySales.map(([date, revenue]) => (
                  <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                    <span className="font-bold">{formatCurrency(revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales in the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSales.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Sale ID</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Cashier</th>
                    <th className="text-right p-2">Items</th>
                    <th className="text-right p-2">VAT</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.slice(-10).reverse().map(sale => (
                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-sm">#{sale.id}</td>
                      <td className="p-2">{new Date(sale.date).toLocaleString()}</td>
                      <td className="p-2">{sale.cashier}</td>
                      <td className="p-2 text-right">{sale.products.length}</td>
                      <td className="p-2 text-right">{formatCurrency(sale.vat)}</td>
                      <td className="p-2 text-right font-bold">{formatCurrency(sale.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
