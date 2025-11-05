import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { full_name, email, phone_number, delivery_address, items, total_amount }: OrderNotificationRequest = await req.json();

    console.log("Processing order notification:", { full_name, email, total_amount });

    // Generate items list HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.name} x ${item.quantity}
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

    // Send notification to store owner
    const ownerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SYSTA SYSTA Store <onboarding@resend.dev>",
        to: ["sethagyeimensah2@gmail.com"],
        subject: `New Order from ${full_name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px;">
              New Order Received! 🎉
            </h1>
            
            <h2 style="color: #333; margin-top: 30px;">Customer Details</h2>
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Name:</td>
                <td style="padding: 8px;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;">${phone_number}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Delivery Address:</td>
                <td style="padding: 8px;">${delivery_address}</td>
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

    // Send confirmation to customer
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
            
            <p style="font-size: 16px; color: #333;">Dear ${full_name},</p>
            
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
              ${delivery_address}
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
