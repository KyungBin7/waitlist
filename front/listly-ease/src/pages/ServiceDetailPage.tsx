import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowLeft, Star, Download, Share2 } from "lucide-react";
import { WaitlistJoinForm } from "@/components/waitlist/WaitlistJoinForm";
import premiumAppImage from "@/assets/premium-app.jpg";
import betaTestingImage from "@/assets/beta-testing.jpg";
import courseImage from "@/assets/course.jpg";

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Mock data - in real implementation, this would come from API
  const services = {
    "premium-app-launch": {
      id: "1",
      slug: "premium-app-launch",
      title: "Premium App Launch",
      tagline: "Revolutionize your productivity workflow",
      description: "Join thousands waiting for our revolutionary productivity app. Be among the first to experience the future of task management with AI-powered insights, seamless collaboration, and intuitive design.",
      fullDescription: `Premium App is designed for modern professionals who demand excellence from their productivity tools. Our revolutionary approach combines artificial intelligence with intuitive design to create the most advanced task management system ever built.

Key Features:
• AI-powered task prioritization that learns from your workflow
• Real-time collaboration with team members across the globe  
• Advanced analytics and productivity insights
• Seamless integration with your favorite tools
• Beautiful, intuitive interface inspired by modern design principles

Built by a team of experienced developers and designers, Premium App represents the next evolution in productivity software. We've spent over two years researching user behavior and building a system that truly understands how you work.

Early access users will receive:
• Lifetime discount on premium features
• Direct access to our development team
• Priority customer support
• Exclusive beta testing opportunities`,
      image: premiumAppImage,
      icon: "PA",
      participantCount: 523,
      category: "Productivity",
      developer: "Minimal Studio",
      language: "EN",
      platform: "Web, iOS, Android",
      launchDate: "Q2 2024",
      screenshots: [premiumAppImage, premiumAppImage, premiumAppImage]
    },
    "beta-testing": {
      id: "2",
      slug: "beta-testing",
      title: "Beta Testing Program",
      tagline: "Shape the future of our platform",
      description: "Get exclusive early access to test new features before they're released. Help shape the future of our platform.",
      fullDescription: `Join our exclusive Beta Testing Program and become part of the development process. As a beta tester, you'll have direct influence on feature development and user experience design.

What you'll get:
• Early access to cutting-edge features
• Direct communication with our development team
• Monthly feedback sessions and surveys
• Exclusive beta tester community access
• Recognition in our final product credits

Requirements:
• Active engagement with testing scenarios
• Detailed feedback and bug reporting
• Participation in weekly testing cycles
• Basic technical knowledge preferred

Our beta testing program has been instrumental in creating user-centered products. Previous beta testers have helped us identify crucial improvements and innovative features that made our products industry-leading.`,
      image: betaTestingImage,
      icon: "BT",
      participantCount: 389,
      category: "Software",
      developer: "Tech Labs",
      language: "EN, KR",
      platform: "Web",
      launchDate: "Ongoing",
      screenshots: [betaTestingImage, betaTestingImage, betaTestingImage]
    },
    "early-access-course": {
      id: "3",
      slug: "early-access-course",
      title: "Early Access Course",
      tagline: "Master advanced techniques",
      description: "Master advanced techniques with our comprehensive online course. Limited spots available for the first cohort.",
      fullDescription: `Our Early Access Course represents months of curriculum development and expert instruction. This comprehensive program is designed for professionals looking to advance their skills and achieve mastery in their field.

Course Highlights:
• 12-week intensive program with live instruction
• Hands-on projects with real-world applications  
• One-on-one mentorship from industry experts
• Exclusive networking opportunities with peers
• Certification upon successful completion

What's Included:
• Weekly live sessions with Q&A
• Comprehensive video library and resources
• Private student community and forums
• Career guidance and job placement assistance
• Lifetime access to course materials and updates

Our instructors are industry veterans with decades of combined experience. The curriculum is constantly updated to reflect the latest trends and best practices in the field.

Early access participants receive special benefits including discounted pricing, priority support, and exclusive bonus content not available in the general release.`,
      image: courseImage,
      icon: "EC",
      participantCount: 335,
      category: "Education",
      developer: "Learn Labs",
      language: "EN",
      platform: "Web",
      launchDate: "March 2024",
      screenshots: [courseImage, courseImage, courseImage]
    }
  };

  const service = services[slug as keyof typeof services];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Service Not Found</h1>
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
          waitlistTitle={service.title}
          waitlistDescription={service.description}
          onJoin={(email) => {
            console.log("User joined:", email);
            // TODO: Implement API call
          }}
        />
      </div>
    );
  }

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
                <AvatarImage src={service.image} alt={service.title} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-primary-foreground rounded-2xl">
                  {service.icon}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">{service.title}</h1>
                <p className="text-lg text-muted-foreground mb-3">{service.tagline}</p>
                <p className="text-sm text-muted-foreground mb-4">{service.developer}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">4.8</span>
                  </div>
                  <span className="text-sm text-muted-foreground">#{service.category}</span>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Platform</span>
                    <span className="text-sm font-medium">{service.platform}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Launch</span>
                    <span className="text-sm font-medium">{service.launchDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Language</span>
                    <span className="text-sm font-medium">{service.language}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Preview</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {service.screenshots.map((screenshot, index) => (
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

        {/* Description Section */}
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

        {/* Information Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Developer</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{service.developer}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Platform</span>
                    <span className="text-sm">{service.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Launch Date</span>
                    <span className="text-sm">{service.launchDate}</span>
                  </div>
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