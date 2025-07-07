
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/pages/Index";

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Demo users for testing
  const demoUsers: User[] = [
    {
      id: "1",
      name: "Admin User",
      role: "admin",
      email: "admin@supermarket.rw"
    },
    {
      id: "2",
      name: "Cashier User",
      role: "cashier",
      email: "cashier@supermarket.rw"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple demo authentication
    const user = demoUsers.find(u => u.email === email);
    if (user && password === "password") {
      onLogin(user);
    } else {
      alert("Invalid credentials. Use admin@supermarket.rw or cashier@supermarket.rw with password 'password'");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            SuperMarket POS
          </CardTitle>
          <CardDescription>
            Point of Sale System - Rwanda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Admin: admin@supermarket.rw</div>
              <div>Cashier: cashier@supermarket.rw</div>
              <div>Password: password</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
