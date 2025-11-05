import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Authoritative product prices - must match frontend
const PRODUCT_PRICES = [
  { id: 1, price: 240.00 },
  { id: 2, price: 150.00 },
  { id: 3, price: 180.00 },
  { id: 4, price: 180.00 },
  { id: 5, price: 250.00 },
  { id: 6, price: 200.00 },
];

interface OrderItem {
  id: number;
  quantity: number;
  name?: string;
  price?: number;
}

interface ValidateOrderRequest {
  items: OrderItem[];
  total_amount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { items, total_amount }: ValidateOrderRequest = await req.json();

    console.log("Validating order:", { items, total_amount, user_id: user.id });

    // Recalculate total from authoritative prices
    const calculatedTotal = items.reduce((sum, item) => {
      const product = PRODUCT_PRICES.find(p => p.id === item.id);
      if (!product) {
        throw new Error(`Invalid product ID: ${item.id}`);
      }
      if (item.quantity < 1 || item.quantity > 100) {
        throw new Error(`Invalid quantity for product ${item.id}`);
      }
      return sum + (product.price * item.quantity);
    }, 0);

    // Validate total (allow 1 cent difference for floating point)
    if (Math.abs(calculatedTotal - total_amount) > 0.01) {
      console.error("Price mismatch:", { calculatedTotal, total_amount });
      return new Response(
        JSON.stringify({ 
          error: "Price validation failed",
          calculated_total: calculatedTotal,
          submitted_total: total_amount 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        calculated_total: calculatedTotal 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in validate-order function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
