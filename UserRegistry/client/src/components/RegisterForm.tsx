import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Shield, User, Store } from "lucide-react";
import { authApi, type AuthResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  onRegister: (response: AuthResponse) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (name.length < 20 || name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters";
    }

    if (address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters";
    }

    if (password.length < 8 || password.length > 16) {
      newErrors.password = "Password must be between 8 and 16 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await authApi.register({ name, email, address, password, role });
        toast({
          title: "Registration successful",
          description: "Your account has been created!",
        });
        onRegister(response);
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message || "Unable to create account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const roleOptions = [
    { value: "admin", label: "System Administrator", icon: Shield, description: "Manage stores, users, and view analytics" },
    { value: "user", label: "Normal User", icon: User, description: "Browse stores and submit ratings" },
    { value: "owner", label: "Store Owner", icon: Store, description: "Manage your store and view customer ratings" },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
        </div>
        <CardDescription>Fill in your details to get started</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger data-testid="select-role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {role && (
              <p className="text-xs text-muted-foreground">
                {roleOptions.find((o) => o.value === role)?.description}
              </p>
            )}
            {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name (20-60 characters)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-name"
            />
            <p className="text-xs text-muted-foreground">{name.length}/60 characters</p>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your address (max 400 characters)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              data-testid="input-address"
            />
            <p className="text-xs text-muted-foreground">{address.length}/400 characters</p>
            {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="8-16 characters with uppercase and special character"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="input-password"
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" data-testid="button-register" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
              data-testid="link-login"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
