import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Package, Calendar, ArrowLeft, Truck, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  items: OrderItem[];
  total_amount: number;
  delivery_address: string;
  status?: string;
}

const getOrderStatus = (createdAt: string) => {
  const orderDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff < 2) return { label: "Processing", icon: Clock, color: "bg-yellow-500" };
  if (hoursDiff < 24) return { label: "Shipped", icon: Truck, color: "bg-blue-500" };
  return { label: "Delivered", icon: CheckCircle, color: "bg-green-500" };
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch orders for this user
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && ordersData) {
        setOrders(ordersData.map(order => ({
          ...order,
          items: order.items as unknown as OrderItem[]
        })));
      }

      setLoading(false);
    };

    fetchUserAndOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* User info section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order history */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order History
          </h2>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
                <Button
                  onClick={() => navigate("/products")}
                  className="mt-4"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getOrderStatus(order.created_at);
                const StatusIcon = status.icon;
                
                return (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(order.created_at), "PPP")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${status.color}`} />
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                        <Badge variant="secondary">
                          GHS {order.total_amount.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            GHS {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Delivered to: {order.delivery_address}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => navigate("/products")}
                    >
                      Reorder
                    </Button>
                  </CardContent>
                </Card>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
