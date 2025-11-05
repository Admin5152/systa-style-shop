import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/types/product";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  total: number;
}

export function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  total,
}: CartModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Shopping Cart</DialogTitle>
        </DialogHeader>

        {cart.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    GHS {item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <p className="font-bold">
                    GHS {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Total:</span>
                <span className="text-primary">GHS {total.toFixed(2)}</span>
              </div>
              <Button onClick={onCheckout} className="w-full" size="lg">
                Complete Your Order
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
