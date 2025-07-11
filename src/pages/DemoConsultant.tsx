import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Upload, 
  Download,
  Brain,
  Star,
  Tag,
  Plus,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function DemoConsultant() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);
  const [isPublished, setIsPublished] = useState(true);
  
  // Form state based on the demo consultant data
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    personal_tagline: '',
    rate_preference: '',
    availability: 'Tillgänglig',
    skills: [] as string[],
    certifications: [] as string[]
  });

  // Input states for adding skills/certifications
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    loadDemoConsultant();
  }, []);

  const loadDemoConsultant = async () => {
    try {
      setIsLoading(true);
      
      // Load demo consultant
      const { data: consultantData } = await supabase
        .from('consultants')
        .select('*')
        .eq('type', 'demo-consultant')
        .single();

      if (consultantData) {
        setConsultant(consultantData);
        setFormData({
          full_name: consultantData.name || '',
          email: consultantData.email || '',
          phone: consultantData.phone || '',
          personal_tagline: consultantData.tagline || '',
          rate_preference: consultantData.hourly_rate?.toString() || '',
          availability: consultantData.availability || 'Tillgänglig',
          skills: consultantData.skills || [],
          certifications: consultantData.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading demo consultant:', error);
      toast({
        title: "Demo data ej tillgänglig",
        description: "Kunde inte ladda demo-konsulten.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Demo Mode",
      description: "I demo-läget sparas inga ändringar permanent.",
    });
  };

  const handleToggleVisibility = () => {
    setIsPublished(!isPublished);
    toast({
      title: isPublished ? "Profil dold (Demo)" : "Profil publicerad (Demo)",
      description: isPublished 
        ? "I riktig användning skulle din profil nu vara dold" 
        : "I riktig användning skulle din profil nu vara synlig i MatchWise-nätverket",
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="md" variant="full" />
            <Badge className="bg-blue-600/20 text-blue-600 border-blue-500/30">
              Demo - Konsult Vy
            </Badge>
          </div>
          <h1 className="text-xl font-semibold">Min Profil (Demo)</h1>
          <Link to="/">
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till Startsidan
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Demo Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👋</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Demo: Konsult Profil</h3>
                  <p className="text-sm text-blue-700">
                    Detta är hur konsult-vyn ser ut efter CV-uppladdning och AI-analys. Alla ändringar är temporära i demo-läget.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Info Block */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profilinformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Fullständigt namn</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Ditt fullständiga namn"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">E-post</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="din@email.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Telefonnummer</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+46 70 123 45 67"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Tillgänglighet</label>
                  <Input
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="Tillgänglig"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Personlig tagline (max 150 tecken)</label>
                <Textarea
                  value={formData.personal_tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, personal_tagline: e.target.value }))}
                  placeholder="Beskriv dig själv kort..."
                  maxLength={150}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.personal_tagline.length}/150 tecken
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Kompetenser & Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Dina kompetenser</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Lägg till kompetens..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Certifieringar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Dina certifieringar</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {cert}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Lägg till certifiering..."
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate & Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pris & Tillgänglighet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium mb-1 block">Önskad timtaxa (SEK)</label>
                <Input
                  type="number"
                  value={formData.rate_preference}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate_preference: e.target.value }))}
                  placeholder="950"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibility Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPublished ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                Synlighet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Visa min profil publikt i MatchWise-nätverket</h3>
                  <p className="text-sm text-gray-600">
                    När aktiverad kommer din profil att synas för potentiella klienter
                  </p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={handleToggleVisibility}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis & Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-analys & Insikter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Topvärden</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {consultant?.top_values?.map((value: string, index: number) => (
                      <Badge key={index} variant="secondary">{value}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Personlighetsdrag</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {consultant?.personality_traits?.map((trait: string, index: number) => (
                      <Badge key={index} variant="outline">{trait}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {consultant?.communication_style && (
                <div>
                  <p className="text-sm font-medium">Kommunikationsstil</p>
                  <p className="text-sm text-gray-600 mt-1">{consultant.communication_style}</p>
                </div>
              )}
              
              {consultant?.thought_leadership_score && (
                <div>
                  <p className="text-sm font-medium">Thought Leadership-poäng</p>
                  <p className="text-lg font-semibold text-blue-600">{consultant.thought_leadership_score}/100</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full" disabled>
                Visa fullständig AI-analys (Demo)
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ladda upp nytt CV & LinkedIn (Demo)
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  className="w-full"
                >
                  Spara ändringar (Demo)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-4 border">
            <p>
              Din data lagras säkert och är endast synlig för dig och MatchWise-administratörer 
              om du inte väljer att publicera den. Du kan uppdatera eller ta bort dina data när som helst.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}