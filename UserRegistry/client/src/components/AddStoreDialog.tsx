import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddStoreDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (store: { name: string; email: string; address: string; password: string }) => void;
}

export default function AddStoreDialog({ open, onClose, onAdd }: AddStoreDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, email, address, password });
    setName("");
    setEmail("");
    setAddress("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Store</DialogTitle>
          <DialogDescription>
            Register a new store on the platform
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="Store name (20-60 characters)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-store-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Email</Label>
              <Input
                id="storeEmail"
                type="email"
                placeholder="store@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea
                id="storeAddress"
                placeholder="Full store address (max 400 characters)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                data-testid="input-address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storePassword">Password</Label>
              <Input
                id="storePassword"
                type="password"
                placeholder="8-16 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit">
              Add Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
