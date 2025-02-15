import React, { useState } from 'react';
import { CalendarCheck, Camera } from 'lucide-react';
import useStore from '../../store/useStore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PreApprovalForm() {
  const addPreApproval = useStore((state) => state.addPreApproval);
  const user = useStore((state) => state.user);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorEmail: '',
    visitorPhone: '',
    purpose: '',
    startTime: '',
    endTime: '',
    photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const preApproval = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      hostEmployee: user || '',
      status: 'active',
    };
    addPreApproval(preApproval);
    // Reset form
    setFormData({
      visitorName: '',
      visitorEmail: '',
      visitorPhone: '',
      purpose: '',
      startTime: '',
      endTime: '',
      photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-approve Visit</CardTitle>
        <CardDescription>Schedule a visit in advance.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className='flex flex-row flex-wrap gap-2 items-start justify-around'>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitorName">Visitor Name</Label>
            <Input
              id="visitorName"
              name="visitorName"
              required
              value={formData.visitorName}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitorEmail">Visitor Email</Label>
            <Input
              id="visitorEmail"
              name="visitorEmail"
              type="email"
              required
              value={formData.visitorEmail}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visitorPhone">Visitor Phone</Label>
            <Input
              id="visitorPhone"
              name="visitorPhone"
              type="tel"
              required
              value={formData.visitorPhone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Button type="button" variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            {formData.photoUrl && (
              <div className="h-10 w-10">
                <img
                  src={formData.photoUrl || "/placeholder.svg"}
                  alt="Visitor"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Create Pre-approval
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
