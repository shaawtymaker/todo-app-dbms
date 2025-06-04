<<<<<<< HEAD
import { useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> b7fcf0ff7a087704982f7f82af65c82a3312fcd1
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { InteractiveBackground } from "@/components/Background";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <InteractiveBackground />
<<<<<<< HEAD
      
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card/20 border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
=======
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
>>>>>>> b7fcf0ff7a087704982f7f82af65c82a3312fcd1
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
