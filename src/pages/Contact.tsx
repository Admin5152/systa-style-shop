import { Mail, Instagram, Phone } from "lucide-react";
import { BracketLabel } from "@/components/ui/BracketLabel";

export default function Contact() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-20">
          <BracketLabel className="mb-6 text-muted-foreground">GET IN TOUCH</BracketLabel>
          <h1 className="text-6xl md:text-7xl font-heading font-black tracking-tighter mb-4 text-foreground uppercase">
            Contact
          </h1>
          <p className="text-muted-foreground font-heading text-xs tracking-widest uppercase">
            Orders, inquiries, or custom requests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-y border-border">
          <div className="border-b md:border-b-0 md:border-r border-border p-12 text-center group hover:bg-foreground hover:text-background transition-colors duration-300">
            <div className="mx-auto mb-6 h-12 w-12 flex items-center justify-center">
              <Mail className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h2 className="font-heading font-black text-2xl tracking-tighter mb-4">EMAIL</h2>
            <a
              href="mailto:veagyeimensah@gmail.com"
              className="font-heading text-xs tracking-widest uppercase hover:text-accent transition-colors block"
            >
              veagyeimensah@gmail.com
            </a>
          </div>

          <div className="border-b md:border-b-0 md:border-r border-border p-12 text-center group hover:bg-foreground hover:text-background transition-colors duration-300">
            <div className="mx-auto mb-6 h-12 w-12 flex items-center justify-center">
              <Instagram className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h2 className="font-heading font-black text-2xl tracking-tighter mb-4">SOCIAL</h2>
            <a
              href="https://www.instagram.com/systa_systa_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-xs tracking-widest uppercase hover:text-accent transition-colors block"
            >
              @SYSTA_SYSTA_
            </a>
          </div>

          <div className="p-12 text-center group hover:bg-foreground hover:text-background transition-colors duration-300">
            <div className="mx-auto mb-6 h-12 w-12 flex items-center justify-center">
              <Phone className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h2 className="font-heading font-black text-2xl tracking-tighter mb-4">PHONE</h2>
            <a href="tel:0597868871" className="font-heading text-xs tracking-widest uppercase hover:text-accent transition-colors block">
              +233 59 786 8871
            </a>
          </div>
        </div>

        <div className="mt-24 text-center max-w-xl mx-auto border border-border p-12 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-4">
            <BracketLabel>HOURS</BracketLabel>
          </div>
          <h2 className="font-heading font-black text-3xl tracking-tighter mb-8 uppercase">Business Hours</h2>
          <div className="font-heading text-xs tracking-widest uppercase space-y-4 text-muted-foreground">
            <p className="flex justify-between border-b border-border border-dashed pb-2">
              <span>MONDAY - SATURDAY</span>
              <span className="text-foreground">9:00 AM - 7:00 PM</span>
            </p>
            <p className="flex justify-between border-b border-border border-dashed pb-2">
              <span>SUNDAY</span>
              <span className="text-foreground">BY APPOINTMENT</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
