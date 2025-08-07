import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { waitlistService, CreateServiceRequest } from "@/services/waitlist.service";
import { useToast } from "@/hooks/use-toast";

interface ServiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServiceForm({ onSuccess, onCancel }: ServiceFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateServiceRequest>({
    name: "",
    description: "",
    slug: "",
    waitlistTitle: "",
    waitlistDescription: "",
    waitlistBackground: "#ffffff",
    image: "",
    category: "",
  });

  const handleInputChange = (field: keyof CreateServiceRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };
  const categoryOptions = [
    "Productivity",
    "Software",
    "Education",
    "Health & Fitness",
    "Business",
    "Entertainment",
    "Social",
    "Finance",
    "Travel",
    "Food & Drink",
    "General"
  ];

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Service name is required");
      return false;
    }
    
    if (!formData.slug.trim()) {
      setError("Slug is required");
      return false;
    }

    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setError("Slug must contain only lowercase letters, numbers, and hyphens");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const service = await waitlistService.createService(formData);
      
      toast({
        title: "Success",
        description: `Service "${service.name}" created successfully!`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Service</CardTitle>
        <CardDescription>
          Set up a new waitlist service for your project or offering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Premium App Launch"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Service Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your service"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Service Image URL</Label>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Add an image URL to display on the main page
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              type="text"
              placeholder="premium-app-launch"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-sm text-muted-foreground">
              This will be used in your public waitlist URL: /waitlist/{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waitlistTitle">Waitlist Page Title</Label>
            <Input
              id="waitlistTitle"
              type="text"
              placeholder="Join the waitlist for early access"
              value={formData.waitlistTitle}
              onChange={(e) => handleInputChange('waitlistTitle', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waitlistDescription">Waitlist Page Description</Label>
            <Textarea
              id="waitlistDescription"
              placeholder="Describe what users will get by joining your waitlist"
              value={formData.waitlistDescription}
              onChange={(e) => handleInputChange('waitlistDescription', e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waitlistBackground">Background Color</Label>
            <Input
              id="waitlistBackground"
              type="color"
              value={formData.waitlistBackground}
              onChange={(e) => handleInputChange('waitlistBackground', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Service
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}