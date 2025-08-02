import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowRight, ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { waitlistService } from "@/services/waitlist.service";
import heroBackground from "@/assets/hero-bg.jpg";
import premiumAppImage from "@/assets/premium-app.jpg";
import betaTestingImage from "@/assets/beta-testing.jpg";
import courseImage from "@/assets/course.jpg";

interface WaitlistItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  participantCount: number;
  category: string;
}

const Index = () => {
  const [waitlists, setWaitlists] = useState<WaitlistItem[]>([
    {
      id: "1",
      slug: "premium-app-launch",
      title: "Premium App Launch",
      description: "Join thousands waiting for our revolutionary productivity app. Be among the first to experience the future of task management.",
      image: premiumAppImage,
      participantCount: 0,
      category: "Productivity"
    },
    {
      id: "2", 
      slug: "beta-testing",
      title: "Beta Testing Program",
      description: "Get exclusive early access to test new features before they're released. Help shape the future of our platform.",
      image: betaTestingImage,
      participantCount: 0,
      category: "Software"
    },
    {
      id: "3",
      slug: "early-access-course",
      title: "Early Access Course",
      description: "Master advanced techniques with our comprehensive online course. Limited spots available for the first cohort.",
      image: courseImage,
      participantCount: 0,
      category: "Education"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantCounts = async () => {
      try {
        const updatedWaitlists = await Promise.all(
          waitlists.map(async (waitlist) => {
            try {
              const countData = await waitlistService.getParticipantCount(waitlist.slug);
              return {
                ...waitlist,
                participantCount: countData.currentParticipants
              };
            } catch (error) {
              console.error(`Error fetching count for ${waitlist.slug}:`, error);
              return waitlist; // Return original if error
            }
          })
        );
        setWaitlists(updatedWaitlists);
      } catch (error) {
        console.error('Error fetching participant counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantCounts();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-sm" />
      
      {/* Navigation */}
      <nav className="relative z-10 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-foreground">
                Minimal Waitlist
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Organizer Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Create Waitlist</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Amazing
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Upcoming Projects
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join waitlists for the most exciting new products and services. Be the first to know when they launch.
            </p>
          </div>

          {/* Waitlists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {waitlists.map((waitlist, index) => (
              <Card 
                key={waitlist.id}
                className="glass shadow-card-premium animate-fade-in hover:shadow-glass transition-all duration-300 hover:-translate-y-2 group overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Link to={`/service/${waitlist.slug}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={waitlist.image} 
                      alt={waitlist.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-primary/80 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                        {waitlist.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {waitlist.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {waitlist.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {loading ? 'Loading...' : `${waitlist.participantCount.toLocaleString()} joined`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
                
                <CardContent className="pt-0 pb-6">
                  <Button 
                    className="w-full" 
                    size="lg"
                    asChild
                  >
                    <Link to={`/waitlist/${waitlist.slug}`}>
                      Join Waitlist
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action for Organizers */}
          <div className="mt-16 text-center animate-slide-up">
            <Card className="glass shadow-glass inline-block">
              <CardContent className="py-8 px-12">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Want to create your own waitlist?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Build anticipation for your product with beautiful waitlist pages
                </p>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/signup">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Start Building
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Minimal Waitlist. Discover and join amazing upcoming projects.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
