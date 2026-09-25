import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 text-center">
        <Link to="/" className="inline-block text-2xl font-heading font-black tracking-tight mb-6 flex items-center justify-center">
          SYSTA<span className="text-accent font-light">/</span>SYSTA
        </Link>
        <div className="flex justify-center gap-6 mb-8 font-heading text-xs tracking-widest font-bold">
          <Link to="/products" className="hover:text-accent transition-colors">SHOP</Link>
          <Link to="/contact" className="hover:text-accent transition-colors">CONTACT</Link>
          <Link to="/auth" className="hover:text-accent transition-colors">SIGN IN</Link>
        </div>
        <p className="text-xs font-heading tracking-widest text-muted-foreground uppercase">
          © 2026 SYSTA SYSTA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
