import React from 'react';
import { Users, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Layout({ children }) {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Visitor Management</span>
            </div>
            <div className="flex items-center">
              <span className="text-muted-foreground mr-4">Welcome, {user}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
