import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom"; // New: routing link to register
import useStore from "../../store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const login = useStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    // ...existing validation code...
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter both username and password");
      return;
    }
    try {
      login(credentials.username, credentials.password);
    } catch (error) {
      toast.error("Invalid username or password");
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          {/* Redesigned header */}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" value={credentials.username} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={credentials.password} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button type="submit" className="w-full flex items-center justify-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-primary">
                Register as Host
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
