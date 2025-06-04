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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !passwordConfirmation) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== passwordConfirmation) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password, passwordConfirmation);
      // The redirection is handled in the register function in AuthContext
    } catch (error) {
      console.error("Registration failed:", error);
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
        <Card className="w-full max-w-md animate-slide-up backdrop-blur-sm bg-black/40 border-white/30 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-lg">Create an account</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium drop-shadow">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/20 border-white/40 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/60"
                />
              </div>
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
                <Label htmlFor="password" className="text-white font-medium drop-shadow">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/20 border-white/40 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation" className="text-white font-medium drop-shadow">Confirm Password</Label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="bg-white/20 border-white/40 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/25 focus:border-white/60"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-white/25 hover:bg-white/35 text-white border-white/40 backdrop-blur-sm font-medium shadow-lg" 
                disabled={isSubmitting}
                variant="outline"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
              <div className="text-center text-sm text-white/90 drop-shadow">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:underline font-medium">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
