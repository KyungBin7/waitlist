import { SignupForm } from "@/components/auth/SignupForm";
import heroBackground from "@/assets/hero-bg.jpg";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Minimal Waitlist
          </h1>
          <p className="text-muted-foreground">
            Beautiful waitlists, simplified
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
}