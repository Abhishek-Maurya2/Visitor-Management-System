import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import useStore from '../../store/useStore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginForm() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const login = useStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(credentials.username, credentials.password);
    if (!success) {
      setError('Invalid credentials. Try hostA/password or admin/password');
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Available accounts:
            <br />
            hostA/password - Host A
            <br />
            hostB/password - Host B
            <br />
            admin/password - Administrator
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
