import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { BracketLabel } from "@/components/ui/BracketLabel";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          },
        });

        if (error) throw error;
        
        // Store user profile details in profiles table
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
          });
        }
        
        toast.success("Account created! You're now logged in.");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <BracketLabel className="mb-6 text-muted-foreground">
            {isLogin ? "RETURNING CUSTOMER" : "NEW ACCOUNT"}
          </BracketLabel>
          <h1 className="text-4xl font-heading font-black tracking-tighter uppercase mb-2 text-foreground">
            {isLogin ? "Sign In" : "Register"}
          </h1>
          <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground">
            Access your orders, wishlist, and cart
          </p>
        </div>

        <div className="border border-border p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-heading text-xs uppercase tracking-widest">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="JANE"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    disabled={isLoading}
                    className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary h-12 font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-heading text-xs uppercase tracking-widest">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="DOE"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    disabled={isLoading}
                    className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary h-12 font-mono uppercase"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-heading text-xs uppercase tracking-widest">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="EMAIL@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary h-12 font-mono uppercase placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-heading text-xs uppercase tracking-widest">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="rounded-none border-border focus-visible:ring-1 focus-visible:ring-primary h-12 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-none h-12 font-heading text-xs uppercase tracking-widest" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "AUTHENTICATING..." : "CREATING ACCOUNT..."}
                </>
              ) : (
                <>{isLogin ? "SIGN IN" : "CREATE ACCOUNT"}</>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-heading text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {isLogin
                ? "DON'T HAVE AN ACCOUNT? REGISTER"
                : "ALREADY HAVE AN ACCOUNT? SIGN IN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
