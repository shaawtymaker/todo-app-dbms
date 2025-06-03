import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InteractiveBackground } from "@/components/Background";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log("LoginPage rendered, auth state:", { isAuthenticated, isLoading });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("Already authenticated, redirecting to home");
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting login form");
      await login(email, password);
      // The redirection is handled in the login function in AuthContext
    } catch (error) {
      console.error("Login form submission error:", error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="relative flex flex-col min-h-screen bg-background p-4">
      <InteractiveBackground />
      <div className="relative z-10 flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex items-center justify-center flex-1">
        <Card className="w-full max-w-md backdrop-blur-sm bg-black/40 border-white/30 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">Welcome back</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium drop-shadow">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 border-white/40 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/60"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white font-medium drop-shadow">Password</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-white/90 hover:text-white hover:underline drop-shadow"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/40 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/60"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-white/25 hover:bg-white/35 text-white border-white/40 backdrop-blur-sm font-medium shadow-lg" 
                disabled={isSubmitting || isLoading}
                variant="outline"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
              <div className="text-center text-sm text-white/90 drop-shadow">
                Don't have an account?{" "}
                <Link to="/register" className="text-white hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
