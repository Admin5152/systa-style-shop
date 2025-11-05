import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, cart, total, onSuccess }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        delivery_address: formData.deliveryAddress,
        items: JSON.parse(JSON.stringify(cart)),
        total_amount: total,
      };

      // Save order to database
      const { data: order, error: dbError } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke("send-order-notification", {
        body: orderData,
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
