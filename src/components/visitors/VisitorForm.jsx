import React, { useState, useRef } from 'react';
import { Camera, UserCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
    photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
  });

  // state to track streaming status
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef(null);

  // start camera and stream video
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsStreaming(true);
        }
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    } else {
      alert("Camera not supported");
    }
  };

  // capture a snapshot from the stream
  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) {
      console.error("Video reference is null");
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    setFormData(prev => ({ ...prev, photoUrl: imageData }));
    // stop video stream
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsStreaming(false);
  };

  // stop camera without capturing a photo
  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      checkInTime: new Date().toISOString(),
      status: 'pending',
      photoUrl: formData.photoUrl,
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
                placeholder="Full Name"
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
                placeholder="Email"
              />
            </div>
          </div>
          {/* phone number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
          {/* purpose */}
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
          {/* host details */}
          <div className='flex flex-row gap-2'>
            <div className="space-y-2">
              <Label htmlFor="hostEmployee">Host Employee</Label>
              <Input
                id="hostEmployee"
                name="hostEmployee"
                required
                value={formData.hostEmployee}
                onChange={handleChange}
                placeholder="Host Employee"
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
                placeholder="Host Department"
              />
            </div>
          </div>
          {/* company name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />
          </div>

        </CardContent>
        {/* right */}
        <CardFooter className="flex flex-col gap-2">
          {/* Always render the video element and control its visibility */}
          <video
            ref={videoRef}
            className="w-40 h-40 rounded-full"
            autoPlay
            muted
            style={{ display: isStreaming ? 'block' : 'none' }}
          />
          {!isStreaming && (
            <img
              src={formData.photoUrl}
              alt="Visitor Photo"
              className="w-40 h-40 rounded-full"
            />
          )}
          <div className="flex flex-col gap-2">
            {!isStreaming ? (
              <Button type="button" variant="outline" onClick={startCamera}>
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={captureSnapshot}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
                <Button type="button" variant="outline" onClick={stopCamera}>
                  Stop Camera
                </Button>
              </>
            )}
            <Button type="submit" className="w-full">
              <UserCheck className="mr-2 h-4 w-4" />
              Register Visitor
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
