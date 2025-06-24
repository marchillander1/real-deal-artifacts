
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Award, 
  Target,
  Edit,
  Save,
  ArrowLeft,
  CheckCircle,
  Globe,
  Calendar,
  DollarSign
} from 'lucide-react';
import { ProfileEditDialog } from '@/components/profile/ProfileEditDialog';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { TechnicalSkillsSection } from '@/components/profile/TechnicalSkillsSection';
import { SoftSkillsSection } from '@/components/profile/SoftSkillsSection';
import { ExperienceSection } from '@/components/profile/ExperienceSection';
import { MarketAnalysisSection } from '@/components/profile/MarketAnalysisSection';
import { CareerInsightsSection } from '@/components/profile/CareerInsightsSection';

export default function MyProfile() {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get('id');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [consultant, setConsultant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (consultantId) {
      loadConsultantProfile();
    } else {
      toast({
        title: "Ingen profil hittades",
        description: "Gå tillbaka till CV-uppladdning för att skapa din profil",
        variant: "destructive",
      });
      navigate('/cv-upload');
    }
  }, [consultantId]);

  const loadConsultantProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: Load from Supabase when implementing
      // For now, use mock data
      const mockConsultant = {
        id: consultantId,
        name: "Anna Lindström",
        email: "anna.lindstrom@email.com",
        phone: "+46 70 123 45 67",
        location: "Stockholm, Sverige",
        title: "Senior Fullstack Developer",
        tagline: "Passionerad utvecklare med fokus på modern webbutveckling och användarupplevelse",
        
        // Basic stats
        experience_years: 8,
        hourly_rate: 950,
        rating: 4.8,
        projects_completed: 24,
        availability: "Tillgänglig",
        
        // Technical skills
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "PostgreSQL"],
        primary_tech_stack: ["React", "TypeScript", "Node.js"],
        secondary_tech_stack: ["Python", "AWS", "Docker"],
        certifications: ["AWS Solutions Architect", "Certified Scrum Master"],
        
        // Soft skills and personal traits
        values: ["Innovation", "Kvalitet", "Teamwork", "Kontinuerlig utveckling"],
        personality_traits: ["Analytisk", "Problemlösare", "Empatisk", "Proaktiv"],
        communication_style: "Tydlig och direkt kommunikation med fokus på samarbete",
        work_style: "Agile-fokuserad med stark problemlösningsförmåga",
        
        // Market analysis
        market_rate_current: 850,
        market_rate_optimized: 1100,
        thought_leadership_score: 85,
        
        // Career insights
        industries: ["Fintech", "E-commerce", "SaaS", "Healthtech"],
        top_values: ["Innovation", "Kvalitet", "Användarfokus"],
        
        // Visibility settings
        visibility_status: "public",
        is_published: true,
        
        // Additional metadata
        created_at: "2024-01-15",
        last_active: "Today",
        linkedin_url: "https://linkedin.com/in/annalindstrom"
      };
      
      setConsultant(mockConsultant);
    } catch (error: any) {
      console.error('❌ Error loading consultant profile:', error);
      toast({
        title: "Fel vid laddning av profil",
        description: "Kunde inte ladda din profil. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = (updatedData: any) => {
    setConsultant(prev => ({ ...prev, ...updatedData }));
    toast({
      title: "Profil uppdaterad",
      description: "Dina ändringar har sparats framgångsrikt",
    });
  };

  const handleToggleVisibility = () => {
    const newStatus = consultant.visibility_status === 'public' ? 'private' : 'public';
    setConsultant(prev => ({ ...prev, visibility_status: newStatus }));
    toast({
      title: newStatus === 'public' ? "Profil publicerad" : "Profil privat",
      description: newStatus === 'public' 
        ? "Din profil är nu synlig för potentiella klienter" 
        : "Din profil är nu endast synlig för dig",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Profil inte hittad</h2>
            <p className="text-gray-600 mb-4">Kunde inte ladda din profil</p>
            <Button onClick={() => navigate('/cv-upload')}>
              Gå tillbaka till CV-uppladdning
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Tillbaka
            </Button>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleToggleVisibility}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {consultant.visibility_status === 'public' ? 'Gör privat' : 'Publicera'}
              </Button>
              
              <Button 
                onClick={() => setIsEditDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Redigera profil
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <ProfileHeader consultant={consultant} />
          
          {/* Profile Stats */}
          <ProfileStats consultant={consultant} />
          
          {/* Technical Skills */}
          <TechnicalSkillsSection consultant={consultant} />
          
          {/* Soft Skills & Personal Traits */}
          <SoftSkillsSection consultant={consultant} />
          
          {/* Experience & Background */}
          <ExperienceSection consultant={consultant} />
          
          {/* Market Analysis */}
          <MarketAnalysisSection consultant={consultant} />
          
          {/* Career Insights */}
          <CareerInsightsSection consultant={consultant} />
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        consultant={consultant}
        onUpdate={handleUpdateProfile}
      />
    </div>
  );
}
