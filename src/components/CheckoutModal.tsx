import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { orderSchema, escapeHtml } from "@/lib/validation";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, cart, total, onSuccess }: CheckoutModalProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      onClose();
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate form data
      const validationResult = orderSchema.safeParse({
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        delivery_address: formData.deliveryAddress,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        setIsSubmitting(false);
        return;
      }

      // Validate order total server-side
      const { data: validationData, error: validationError } = await supabase.functions.invoke(
        "validate-order",
        {
          body: {
            items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
            total_amount: total,
          },
        }
      );

      if (validationError || !validationData?.valid) {
        toast.error("Order validation failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Prepare sanitized order data
      const orderData = {
        user_id: user.id,
        full_name: escapeHtml(validationResult.data.full_name),
        email: validationResult.data.email,
        phone_number: validationResult.data.phone_number,
        delivery_address: escapeHtml(validationResult.data.delivery_address),
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: validationData.calculated_total,
      };

      // Save order to database
      const { error: dbError } = await supabase
        .from("orders")
        .insert([orderData]);

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke("send-order-notification", {
        body: {
          full_name: orderData.full_name,
          email: orderData.email,
          phone_number: orderData.phone_number,
          delivery_address: orderData.delivery_address,
          items: orderData.items,
          total_amount: orderData.total_amount,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
        toast.warning("Order placed but email notification failed");
      }

      toast.success("Order placed successfully! Check your email for confirmation.");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        deliveryAddress: "",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Summary</DialogTitle>
        </DialogHeader>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              Please <button onClick={() => { onClose(); navigate("/auth"); }} className="underline font-semibold">sign in</button> to place an order.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span className="font-semibold">GHS {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span className="text-primary">GHS {total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="0597868871"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address *</Label>
            <Textarea
              id="deliveryAddress"
              required
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              placeholder="Enter your complete delivery address"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
