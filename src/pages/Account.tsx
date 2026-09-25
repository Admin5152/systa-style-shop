import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BracketLabel } from "@/components/ui/BracketLabel";
import { Package, MapPin, User, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Account() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState<any>({ first_name: '', last_name: '', phone: '' });
  const [orders, setOrders] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfileAndOrders(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfileAndOrders(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfileAndOrders = async (userId: string) => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
      } else {
        // If profile doesn't exist, try to create one
        await supabase.from('profiles').insert({ id: userId });
      }

      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone
        })
        .eq('id', session.user.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-12 pt-28">
        <div className="mb-12">
          <BracketLabel className="text-black/50 mb-4">MY ACCOUNT</BracketLabel>
          <h1 className="font-heading font-black text-4xl md:text-6xl tracking-tighter uppercase text-black">
            Welcome Back
          </h1>
          <p className="font-mono text-sm text-black/60 mt-4">
            Manage your orders, profile, and shipping details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Profile & Settings */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 border border-black/10 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-5 w-5" />
                <h2 className="font-heading font-bold uppercase tracking-widest text-lg">Profile Details</h2>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest uppercase mb-2 text-black/60">First Name</label>
                    <Input 
                      value={profile.first_name || ''} 
                      onChange={e => setProfile({...profile, first_name: e.target.value})}
                      className="rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-heading tracking-widest uppercase mb-2 text-black/60">Last Name</label>
                    <Input 
                      value={profile.last_name || ''} 
                      onChange={e => setProfile({...profile, last_name: e.target.value})}
                      className="rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black h-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest uppercase mb-2 text-black/60">Email Address (Cannot change)</label>
                  <Input 
                    value={session.user.email} 
                    disabled
                    className="rounded-none border-black/20 bg-black/5 h-12 text-black/60"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-widest uppercase mb-2 text-black/60">Phone Number</label>
                  <Input 
                    value={profile.phone || ''} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    placeholder="+233 55 123 4567"
                    className="rounded-none border-black/20 focus-visible:ring-1 focus-visible:ring-black h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isUpdating}
                  className="w-full rounded-none font-heading uppercase tracking-widest text-xs h-12 bg-black text-white hover:bg-black/80"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Changes
                </Button>
              </form>
            </div>
            
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="w-full rounded-none font-heading uppercase tracking-widest text-xs h-12 border-black/20 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 border border-black/10 shadow-sm min-h-[500px]">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5" />
                  <h2 className="font-heading font-bold uppercase tracking-widest text-lg">Order History</h2>
                </div>
                <span className="font-mono text-xs bg-black text-white px-2 py-1">{orders.length} Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <Package className="h-12 w-12 text-black/20 mb-4" />
                  <h3 className="font-heading font-bold uppercase tracking-widest text-sm mb-2">No Orders Yet</h3>
                  <p className="font-mono text-xs text-black/50 max-w-sm">
                    When you purchase a dress, your order details and shipping status will appear here.
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="mt-6 rounded-none font-heading uppercase tracking-widest text-xs px-8 bg-black hover:bg-black/80 text-white"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-black/10 p-6 flex flex-col md:flex-row gap-6 justify-between hover:border-black/30 transition-colors">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-heading font-bold text-lg uppercase">Order #{order.id.substring(0, 8)}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold font-mono uppercase tracking-widest ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-black/60 space-y-1">
                          <p>Placed: {new Date(order.created_at).toLocaleDateString()}</p>
                          <p>Items: {order.items ? order.items.length : 0}</p>
                          <p className="mt-2 text-black">Total: <span className="font-bold">${order.total_amount}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between items-start md:items-end">
                        <div className="text-left md:text-right font-mono text-xs text-black/60 max-w-xs">
                          <p className="font-bold text-black font-heading tracking-widest uppercase mb-1">Delivery Address</p>
                          <p className="break-words">{order.delivery_address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
