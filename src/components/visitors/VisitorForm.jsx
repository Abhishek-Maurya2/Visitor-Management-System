import React, { useState } from 'react';
import { Camera, UserCheck } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VisitorForm({ onSubmit }) {
  // form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    purpose: '',
    hostEmployee: '',
    hostDepartment: '',
    companyName: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      checkInTime: new Date().toISOString(),
      status: 'pending',
      photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register Visitor</CardTitle>
        <CardDescription>Enter visitor details to register them.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className='flex flex-row flex-wrap items-start gap-2 justify-around'>
        {/* left */}
        <CardContent className="space-y-4">
          {/* name and email */}
          <div className='flex flex-row gap-2'>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Select name="purpose" onValueChange={(value) => handleChange({ target: { name: 'purpose', value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-row gap-2'>
            <div className="space-y-2">
              <Label htmlFor="hostEmployee">Host Employee</Label>
              <Input
                id="hostEmployee"
                name="hostEmployee"
                required
                value={formData.hostEmployee}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostDepartment">Host Department</Label>
              <Input
                id="hostDepartment"
                name="hostDepartment"
                required
                value={formData.hostDepartment}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

        </CardContent>
        {/* right */}
        <CardFooter className="flex flex-col gap-2">

          <Button type="button" variant="outline">
            <Camera className="mr-2 h-4 w-4" />
            Capture Photo
          </Button>

          <Button type="submit" className="w-full">
            <UserCheck className="mr-2 h-4 w-4" />
            Register Visitor
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
