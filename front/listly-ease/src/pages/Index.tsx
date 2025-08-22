import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, ArrowRight, ExternalLink, Eye, LayoutDashboard, LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { waitlistService } from "@/services/waitlist.service";
import heroBackground from "@/assets/hero-bg.jpg";
import premiumAppImage from "@/assets/premium-app.jpg";
import betaTestingImage from "@/assets/beta-testing.jpg";
import courseImage from "@/assets/course.jpg";

interface WaitlistItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  participantCount: number;
  category: string;
}

interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    id: 'technology',
    name: 'Technology & Software',
    icon: '',
    subcategories: ['Software/SaaS', 'Web/App Development', 'Hardware', 'Productivity Tools', 'Developer Tools', 'AI/Machine Learning']
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: '',
    subcategories: ['E-commerce', 'Marketing/Advertising', 'Fintech', 'CRM', 'Payment Services', 'Investment']
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Services',
    icon: '',
    subcategories: ['Health/Wellness', 'Food & Beverage', 'Fashion/Beauty', 'Fitness', 'Food Delivery', 'Personal Styling']
  },
  {
    id: 'culture',
    name: 'Culture & Entertainment',
    icon: '',
    subcategories: ['Art/Design', 'Gaming', 'Media/Content', 'Streaming', 'Comics/Novels', 'NFT']
  },
  {
    id: 'education',
    name: 'Education & Community',
    icon: '',
    subcategories: ['Education', 'Community', 'Events', 'Online Classes', 'Language Learning', 'Workshops']
  }
];

const Index = () => {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const [waitlists, setWaitlists] = useState<WaitlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [animationKey, setAnimationKey] = useState(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await waitlistService.getAllPublicServices();
        const mappedServices: WaitlistItem[] = services.map(service => ({
          id: service.id,
          slug: service.slug,
          name: service.name,
          description: service.description || '',
          image: service.image || premiumAppImage, // fallback to default image
          participantCount: service.participantCount,
          category: service.category || 'General'
        }));
        setWaitlists(mappedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to empty array on error
        setWaitlists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get subcategories for selected main category
  const availableSubCategories = useMemo(() => {
    if (selectedMainCategory === 'all') {
      const allSubs = CATEGORY_CONFIG.flatMap(cat => cat.subcategories);
      const uniqueSubs = Array.from(new Set(allSubs));
      return ['all', ...uniqueSubs.sort()];
    }
    
    const selectedCategoryConfig = CATEGORY_CONFIG.find(cat => cat.id === selectedMainCategory);
    return selectedCategoryConfig 
      ? ['all', ...selectedCategoryConfig.subcategories]
      : ['all'];
  }, [selectedMainCategory]);

  // Filter waitlists based on search query and selected categories
  const filteredWaitlists = useMemo(() => {
    return waitlists.filter(waitlist => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        waitlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        waitlist.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Main category filter
      let matchesMainCategory = true;
      if (selectedMainCategory !== 'all') {
        const categoryConfig = CATEGORY_CONFIG.find(cat => cat.id === selectedMainCategory);
        matchesMainCategory = categoryConfig ? 
          categoryConfig.subcategories.includes(waitlist.category) : false;
      }
      
      // Sub category filter
      const matchesSubCategory = selectedSubCategory === 'all' || 
        waitlist.category === selectedSubCategory;
      
      return matchesSearch && matchesMainCategory && matchesSubCategory;
    });
  }, [waitlists, selectedMainCategory, selectedSubCategory, searchQuery]);

  // Trigger animation when filters change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedMainCategory, selectedSubCategory, searchQuery]);

  // Reset subcategory when main category changes
  useEffect(() => {
    setSelectedSubCategory('all');
  }, [selectedMainCategory]);

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
              {authLoading ? (
                // Show loading state while checking auth
                <div className="h-9 w-32 bg-muted/50 rounded animate-pulse" />
              ) : isAuthenticated ? (
                // Show authenticated user options
                <>
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.email?.split('@')[0]}
                  </span>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                // Show login/signup options for unauthenticated users
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Organizer Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Create Waitlist</Link>
                  </Button>
                </>
              )}
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

          {/* Enhanced Search Bar with Better Visibility */}
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-white/90 dark:bg-background/90 backdrop-blur-xl rounded-2xl border border-primary/20 shadow-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-5 w-5 z-10" />
                <Input
                  type="text"
                  placeholder="Search for amazing waitlists..."
                  value={searchInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchInput(value);
                    
                    // Clear previous timeout
                    if (debounceTimeoutRef.current) {
                      clearTimeout(debounceTimeoutRef.current);
                    }
                    
                    // Set new timeout for search query update
                    debounceTimeoutRef.current = setTimeout(() => {
                      setSearchQuery(value);
                    }, 300);
                  }}
                  className="w-full pl-12 pr-4 py-4 h-14 text-base bg-transparent border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60 font-medium"
                />
                {(searchQuery || searchInput) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchInput('');
                      if (debounceTimeoutRef.current) {
                        clearTimeout(debounceTimeoutRef.current);
                      }
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Category Tabs */}
          <div className="flex justify-center mb-8 animate-fade-in overflow-x-auto">
            <div className="flex bg-white/90 dark:bg-card/90 rounded-2xl p-1 shadow-lg backdrop-blur-sm border border-border/30 min-w-fit">
              <button
                onClick={() => setSelectedMainCategory('all')}
                className={`
                  px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300
                  ${selectedMainCategory === 'all'
                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-white/50 dark:hover:bg-card/50'
                  }
                `}
              >
                All Categories
              </button>
              {CATEGORY_CONFIG.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedMainCategory(category.id)}
                  className={`
                    px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap
                    ${selectedMainCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-md'
                      : 'text-foreground hover:bg-white/50 dark:hover:bg-card/50'
                    }
                  `}
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                    animation: 'slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}
                >
                  <span className="hidden sm:inline">{category.name}</span>
                  <span className="sm:hidden">{category.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub Category Filter Buttons */}
          <div 
            key={`subcategories-${selectedMainCategory}`}
            className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in"
          >
            {availableSubCategories.map((subcategory, index) => (
              <button
                key={subcategory}
                onClick={() => setSelectedSubCategory(subcategory)}
                className={`
                  relative px-5 py-2 rounded-full font-medium text-sm
                  transition-all duration-300 transform hover:scale-105
                  ${selectedSubCategory === subcategory 
                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/30 scale-105' 
                    : 'bg-white/80 dark:bg-card/80 text-foreground hover:bg-white dark:hover:bg-card border border-border/30 hover:border-primary/30 hover:shadow-md'
                  }
                `}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animation: 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  opacity: 0
                }}
              >
                <span className="relative z-10">
                  {subcategory === 'all' ? 'All' : subcategory}
                </span>
              </button>
            ))}
          </div>

          {/* Results Count */}
          {(searchQuery || selectedMainCategory !== 'all' || selectedSubCategory !== 'all') && (
            <div className="text-center mb-6 text-muted-foreground">
              Found {filteredWaitlists.length} {filteredWaitlists.length === 1 ? 'waitlist' : 'waitlists'}
              {selectedMainCategory !== 'all' && ` in ${CATEGORY_CONFIG.find(cat => cat.id === selectedMainCategory)?.name || selectedMainCategory}`}
              {selectedSubCategory !== 'all' && ` - ${selectedSubCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          )}

          {/* Fluid Grid with Morphing Transitions */}
          {filteredWaitlists.length > 0 ? (
            <div 
              key={animationKey}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredWaitlists.map((waitlist, index) => (
                <Card 
                  key={waitlist.id}
                  className="waitlist-card relative glass shadow-card-premium hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
                  style={{
                    animationDelay: `${index * 140}ms`,
                    animation: `cardElegantFade 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    opacity: 0,
                    transform: 'scale(0.95)'
                  }}
                >
                  <Link to={`/service/${waitlist.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={waitlist.image} 
                        alt={waitlist.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-3 right-3 transform transition-all duration-300 group-hover:scale-110">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xs font-semibold rounded-full backdrop-blur-md shadow-lg">
                          {waitlist.category}
                        </span>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {waitlist.name}
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
          ) : (
            <div className="text-center py-12">
              <Card className="glass shadow-glass inline-block">
                <CardContent className="py-8 px-12">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No waitlists found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? `No results for "${searchQuery}"` : 'No waitlists in this category'}
                  </p>
                  {(searchQuery || selectedMainCategory !== 'all' || selectedSubCategory !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchInput('');
                        setSelectedMainCategory('all');
                        setSelectedSubCategory('all');
                        if (debounceTimeoutRef.current) {
                          clearTimeout(debounceTimeoutRef.current);
                        }
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Call to Action for Organizers */}
          {!authLoading && (
            <div className="mt-16 text-center animate-slide-up">
              <Card className="glass shadow-glass inline-block">
                <CardContent className="py-8 px-12">
                  {isAuthenticated ? (
                    // Show dashboard CTA for authenticated users
                    <>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        Manage your waitlists
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Go to your dashboard to create and manage your waitlist services
                      </p>
                      <Button variant="outline" size="lg" asChild>
                        <Link to="/dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Go to Dashboard
                        </Link>
                      </Button>
                    </>
                  ) : (
                    // Show signup CTA for unauthenticated users
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
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
