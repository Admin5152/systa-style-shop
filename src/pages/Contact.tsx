import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Instagram, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Get in touch with us for orders, inquiries, or custom requests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a
                href="mailto:veagyeimensah@gmail.com"
                className="text-primary hover:underline"
              >
                veagyeimensah@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Instagram</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a
                href="https://instagram.com/Systa_systa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @Systa_systa
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Phone</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a href="tel:0597868871" className="text-primary hover:underline">
                0597868871
              </a>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p className="mb-2">Monday - Saturday: 9:00 AM - 7:00 PM</p>
            <p>Sunday: By Appointment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
