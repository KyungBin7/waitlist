import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

interface WaitlistJoinFormProps {
  waitlistTitle: string;
  waitlistDescription: string;
  onJoin?: (email: string) => Promise<void>;
}

export function WaitlistJoinForm({ 
  waitlistTitle, 
  waitlistDescription, 
  onJoin 
}: WaitlistJoinFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onJoin?.(email);
      setIsJoined(true);
    } catch (error) {
      // Error handling is done in the parent component
      console.error("Failed to join waitlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isJoined) {
    return (
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          You're on the list!
        </h3>
        <p className="text-muted-foreground mb-6">
          We'll notify you when {waitlistTitle} is ready.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsJoined(false)}
          className="text-sm"
        >
          Join Another Waitlist
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center animate-slide-up">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        {waitlistTitle}
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        {waitlistDescription}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground z-10" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 pr-4 h-16 text-lg rounded-2xl bg-background/90 backdrop-blur-sm border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60 text-left"
            required
          />
        </div>

        <Button 
          type="submit" 
          variant="hero" 
          size="xl"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join Waitlist"}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-6">
        No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  );
}