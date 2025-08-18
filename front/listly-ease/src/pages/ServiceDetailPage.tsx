import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowLeft, Star, Download, Share2 } from "lucide-react";
import { WaitlistJoinForm } from "@/components/waitlist/WaitlistJoinForm";
import { Skeleton } from "@/components/ui/skeleton";
import premiumAppImage from "@/assets/premium-app.jpg";
import betaTestingImage from "@/assets/beta-testing.jpg";
import courseImage from "@/assets/course.jpg";

interface ServiceDetail {
  id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
  image?: string;
  category?: string;
  tagline?: string;
  fullDescription?: string;
  icon?: string;
  participantCount: number;
  developer?: string;
  language?: string;
  platform?: string;
  launchDate?: string;
  screenshots: string[];
  rating: number;
  waitlistTitle?: string;
  waitlistDescription?: string;
}

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/public/services/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Service not found");
          } else {
            throw new Error("Failed to fetch service");
          }
          return;
        }
        
        const data = await response.json();
        setService(data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  // Default images for screenshots if none provided
  const getDefaultImage = (serviceSlug?: string) => {
    const imageMap: { [key: string]: string } = {
      "premium-app-launch": premiumAppImage,
      "beta-testing": betaTestingImage,
      "early-access-course": courseImage,
    };
    return serviceSlug && imageMap[serviceSlug] ? imageMap[serviceSlug] : premiumAppImage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="glass border-b border-border/50 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="flex gap-6 lg:flex-1">
              <Skeleton className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl" />
              <div className="flex-1">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-6 w-48 mb-3" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
            <Skeleton className="lg:w-80 h-48" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Service Not Found"}
          </h1>
          <Link to="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showJoinForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <WaitlistJoinForm 
          waitlistTitle={service.waitlistTitle || service.title}
          waitlistDescription={service.waitlistDescription || service.description}
          onJoin={(email) => {
            console.log("User joined:", email);
            // TODO: Implement API call
          }}
        />
      </div>
    );
  }

  // Use service image or default based on slug
  const serviceImage = service.image || getDefaultImage(service.slug);
  const screenshots = service.screenshots && service.screenshots.length > 0 
    ? service.screenshots 
    : [serviceImage, serviceImage, serviceImage];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Organizer Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* App Store Style Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left: App Icon & Basic Info */}
          <div className="flex flex-col lg:flex-row gap-6 lg:flex-1">
            <div className="flex gap-6">
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl shadow-xl">
                <AvatarImage src={serviceImage} alt={service.title} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
                  {service.icon || service.title.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">{service.title}</h1>
                <p className="text-lg text-muted-foreground mb-3">{service.tagline || service.description}</p>
                <p className="text-sm text-muted-foreground mb-4">{service.developer || "Independent Developer"}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(service.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">{service.rating.toFixed(1)}</span>
                  </div>
                  {service.category && (
                    <span className="text-sm text-muted-foreground">#{service.category}</span>
                  )}
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full lg:w-auto shadow-button"
                  asChild
                >
                  <Link to={`/waitlist/${service.slug}`}>
                    Join Waitlist
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Quick Stats */}
          <div className="lg:w-80">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Waitlist</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{service.participantCount.toLocaleString()}</span>
                    </div>
                  </div>
                  {service.platform && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Platform</span>
                      <span className="text-sm font-medium">{service.platform}</span>
                    </div>
                  )}
                  {service.launchDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Launch</span>
                      <span className="text-sm font-medium">{service.launchDate}</span>
                    </div>
                  )}
                  {service.language && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Language</span>
                      <span className="text-sm font-medium">{service.language}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Screenshots Section */}
        {screenshots && screenshots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Preview</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {screenshots.map((screenshot, index) => (
                <div key={index} className="flex-shrink-0 w-64 lg:w-80">
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={screenshot} 
                      alt={`${service.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        {service.fullDescription && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">About {service.title}</h2>
            <Card className="glass">
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none text-foreground">
                  <div className="whitespace-pre-line leading-relaxed">
                    {service.fullDescription}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Information Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.developer && (
              <Card className="glass">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Developer</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{service.developer}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Details</h3>
                <div className="space-y-3">
                  {service.category && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <Badge variant="secondary">{service.category}</Badge>
                    </div>
                  )}
                  {service.platform && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Platform</span>
                      <span className="text-sm">{service.platform}</span>
                    </div>
                  )}
                  {service.launchDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Launch Date</span>
                      <span className="text-sm">{service.launchDate}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="glass shadow-card-premium">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Ready to join the waitlist?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Be among the first to experience {service.title}. Join {service.participantCount.toLocaleString()} others who are already waiting.
            </p>
            <Button 
              size="lg" 
              className="shadow-button"
              asChild
            >
              <Link to={`/waitlist/${service.slug}`}>
                Join Waitlist Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ServiceDetailPage;