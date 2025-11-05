import { z } from "zod";

// Order validation schema
export const orderSchema = z.object({
  full_name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone_number: z.string()
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters"),
  delivery_address: z.string()
    .trim()
    .min(10, "Delivery address must be at least 10 characters")
    .max(500, "Delivery address must be less than 500 characters"),
});

// Helper to escape HTML for email safety
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
