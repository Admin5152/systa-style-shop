import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderNotificationRequest {
  full_name: string;
  email: string;
  phone_number: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
}

// HTML escape function to prevent XSS/HTML injection
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Input validation
function validateInput(data: OrderNotificationRequest): { valid: boolean; error?: string } {
  // Validate required fields
  if (!data.full_name || typeof data.full_name !== 'string' || data.full_name.trim().length === 0) {
    return { valid: false, error: 'Full name is required' };
  }
  if (data.full_name.length > 100) {
    return { valid: false, error: 'Full name must be less than 100 characters' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
    return { valid: false, error: 'Valid email is required' };
  }
  if (data.email.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }

  // Validate phone number
  if (!data.phone_number || typeof data.phone_number !== 'string' || data.phone_number.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }
  if (data.phone_number.length > 20) {
    return { valid: false, error: 'Phone number must be less than 20 characters' };
  }

  // Validate delivery address
  if (!data.delivery_address || typeof data.delivery_address !== 'string' || data.delivery_address.trim().length === 0) {
    return { valid: false, error: 'Delivery address is required' };
  }
  if (data.delivery_address.length > 500) {
    return { valid: false, error: 'Delivery address must be less than 500 characters' };
  }

  // Validate items array
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return { valid: false, error: 'At least one item is required' };
  }
  if (data.items.length > 50) {
    return { valid: false, error: 'Too many items in order' };
  }

  for (const item of data.items) {
    if (!item.name || typeof item.name !== 'string' || item.name.length > 200) {
      return { valid: false, error: 'Invalid item name' };
    }
    if (typeof item.price !== 'number' || item.price < 0 || item.price > 1000000) {
      return { valid: false, error: 'Invalid item price' };
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 100) {
      return { valid: false, error: 'Invalid item quantity' };
    }
  }

  // Validate total amount
  if (typeof data.total_amount !== 'number' || data.total_amount < 0 || data.total_amount > 10000000) {
    return { valid: false, error: 'Invalid total amount' };
  }

  return { valid: true };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing authorization header' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const userId = user.id;
    console.log("Authenticated user:", userId);

    // Parse and validate request body
    const requestData: OrderNotificationRequest = await req.json();
    
    const validation = validateInput(requestData);
    if (!validation.valid) {
      console.error("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { full_name, email, phone_number, delivery_address, items, total_amount } = requestData;

    console.log("Processing order notification for authenticated user:", userId, { full_name, email: escapeHtml(email), total_amount });

    // Generate items list HTML with escaped values
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${escapeHtml(item.name)} x ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          GHS ${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    // Send notification to store owner with escaped values
    const ownerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SYSTA SYSTA Store <onboarding@resend.dev>",
        to: ["sethagyeimensah2@gmail.com"],
        subject: `New Order from ${escapeHtml(full_name)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px;">
              New Order Received! 🎉
            </h1>
            
            <h2 style="color: #333; margin-top: 30px;">Customer Details</h2>
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Name:</td>
                <td style="padding: 8px;">${escapeHtml(full_name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${escapeHtml(email)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;">${escapeHtml(phone_number)}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Delivery Address:</td>
                <td style="padding: 8px;">${escapeHtml(delivery_address)}</td>
              </tr>
            </table>

            <h2 style="color: #333; margin-top: 30px;">Order Items</h2>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3e8ff;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #7c3aed; color: white; font-weight: bold;">
                  <td style="padding: 15px;">Total Amount</td>
                  <td style="padding: 15px; text-align: right;">GHS ${total_amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <p style="color: #666; margin-top: 30px;">
              Please contact the customer to confirm delivery details.
            </p>
          </div>
        `,
      }),
    });

    const ownerData = await ownerEmailResponse.json();
    console.log("Owner notification sent:", ownerData);

    // Send confirmation to customer with escaped values
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SYSTA SYSTA <onboarding@resend.dev>",
        to: [email],
        subject: "Order Confirmation - SYSTA SYSTA",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px;">
              Thank You for Your Order! 💜
            </h1>
            
            <p style="font-size: 16px; color: #333;">Dear ${escapeHtml(full_name)},</p>
            
            <p style="font-size: 16px; color: #333;">
              We've received your order and will contact you shortly to confirm delivery details.
            </p>

            <h2 style="color: #333; margin-top: 30px;">Your Order</h2>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3e8ff;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #7c3aed; color: white; font-weight: bold;">
                  <td style="padding: 15px;">Total Amount</td>
                  <td style="padding: 15px; text-align: right;">GHS ${total_amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <h2 style="color: #333; margin-top: 30px;">Delivery Address</h2>
            <p style="padding: 15px; background-color: #f9fafb; border-left: 4px solid #7c3aed;">
              ${escapeHtml(delivery_address)}
            </p>

            <p style="color: #666; margin-top: 30px;">
              If you have any questions, please contact us at veagyeimensah@gmail.com or call 0597868871.
            </p>

            <p style="color: #7c3aed; font-weight: bold; margin-top: 30px;">
              #SYSTASYSTA #BuubuVibes #EffortlessElegance
            </p>
          </div>
        `,
      }),
    });

    const customerData = await customerEmailResponse.json();
    console.log("Customer confirmation sent:", customerData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        ownerEmail: ownerData,
        customerEmail: customerData 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-order-notification function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
