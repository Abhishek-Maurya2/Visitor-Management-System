import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useStore from "@/store/useStore";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        department: "",
        password: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const { register } = useStore();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation check
        if (!formData.name || !formData.email || !formData.contact || !formData.department || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }
        register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Register as Host</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input id="contact" name="contact" type="text" value={formData.contact} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" name="department" type="text" value={formData.department} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image">Profile Image</Label>
                            <Input id="image" name="image" type="file" onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center space-y-4">
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
