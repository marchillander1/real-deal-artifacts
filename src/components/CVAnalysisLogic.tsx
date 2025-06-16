
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const performCVAnalysis = async (
  file: File,
  setIsAnalyzing: (value: boolean) => void,
  setAnalysisProgress: (value: number) => void,
  setAnalysisResults: (value: any) => void,
  setFullName: (value: string) => void,
  setEmail: (value: string) => void,
  setPhoneNumber: (value: string) => void,
  setLinkedinUrl: (value: string) => void,
  linkedinUrl?: string
) => {
  console.log('🚀 Starting comprehensive CV and LinkedIn analysis for file:', file.name);
  
  setIsAnalyzing(true);
  setAnalysisProgress(10);
  
  try {
    toast.info('📄 Bearbetar CV-filen...');
    
    // Create FormData to send file properly
    const formData = new FormData();
    formData.append('file', file);
    
    setAnalysisProgress(30);
    console.log('✅ File prepared for analysis, calling parse-cv function...');
    
    // Call CV analysis function
    toast.info('🧠 AI analyserar CV...');
    const { data: cvData, error: cvError } = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (cvError) {
      console.error('❌ CV analysis failed:', cvError);
      throw new Error(`CV-analys misslyckades: ${cvError.message}`);
    }

    console.log('✅ CV analysis completed:', cvData);
    setAnalysisProgress(50);
    
    // Auto-fill form fields with better validation and formatting
    if (cvData?.analysis?.personalInfo) {
      const info = cvData.analysis.personalInfo;
      
      if (info.name && info.name.trim() && info.name !== 'Unknown') {
        setFullName(info.name.trim());
        console.log('📝 Auto-filled name:', info.name);
        toast.success(`✅ Hittade namn: ${info.name}`);
      }
      
      if (info.email && info.email.includes('@') && info.email !== 'Unknown') {
        setEmail(info.email.trim());
        console.log('📝 Auto-filled email:', info.email);
        toast.success(`✅ Hittade email: ${info.email}`);
      }
      
      if (info.phone && info.phone.trim() && info.phone !== 'Unknown' && info.phone.length > 5) {
        // Clean up phone number format
        const cleanedPhone = info.phone.replace(/[^\d+\-\s]/g, '').trim();
        setPhoneNumber(cleanedPhone);
        console.log('📝 Auto-filled phone:', cleanedPhone);
        toast.success(`✅ Hittade telefon: ${cleanedPhone}`);
      }
      
      if (info.linkedinProfile && info.linkedinProfile.trim() && info.linkedinProfile !== 'Unknown') {
        let linkedinProfile = info.linkedinProfile.trim();
        
        // Ensure proper LinkedIn URL format
        if (!linkedinProfile.startsWith('http')) {
          if (linkedinProfile.startsWith('linkedin.com/in/')) {
            linkedinProfile = `https://${linkedinProfile}`;
          } else if (linkedinProfile.startsWith('/in/')) {
            linkedinProfile = `https://linkedin.com${linkedinProfile}`;
          } else if (!linkedinProfile.includes('linkedin.com')) {
            linkedinProfile = `https://linkedin.com/in/${linkedinProfile}`;
          } else {
            linkedinProfile = `https://${linkedinProfile}`;
          }
        }
        
        setLinkedinUrl(linkedinProfile);
        console.log('📝 Auto-filled LinkedIn:', linkedinProfile);
        toast.success(`✅ Hittade LinkedIn: ${linkedinProfile}`);
      }
    }

    setAnalysisProgress(60);

    // LinkedIn Analysis if URL provided
    let linkedinAnalysis = null;
    const finalLinkedInUrl = linkedinUrl || cvData?.analysis?.personalInfo?.linkedinProfile;
    
    if (finalLinkedInUrl && finalLinkedInUrl.includes('linkedin.com')) {
      try {
        toast.info('🔗 Analyserar LinkedIn-profil...');
        console.log('🔗 Starting LinkedIn analysis for:', finalLinkedInUrl);
        
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: finalLinkedInUrl }
        });
        
        if (linkedinError) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinError);
          toast.warning('LinkedIn-analys misslyckades, men CV-analys lyckades');
          // Create fallback LinkedIn analysis
          linkedinAnalysis = createFallbackLinkedInAnalysis();
        } else {
          linkedinAnalysis = linkedinData?.analysis || createFallbackLinkedInAnalysis();
          console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
          toast.success('🎉 LinkedIn-analys klar!');
        }
      } catch (linkedinErr) {
        console.warn('⚠️ LinkedIn analysis error:', linkedinErr);
        toast.warning('LinkedIn-analys stötte på ett problem, använder fallback-analys');
        linkedinAnalysis = createFallbackLinkedInAnalysis();
      }
    } else {
      // If no LinkedIn URL, create basic fallback
      linkedinAnalysis = createFallbackLinkedInAnalysis();
      toast.info('ℹ️ Ingen LinkedIn-profil hittades, använder grundläggande analys');
    }

    setAnalysisProgress(80);
    
    // Generate improvement tips
    const improvementTips = generateImprovementTips(cvData?.analysis, linkedinAnalysis);
    
    // Set final results with improvement tips
    const finalResults = {
      cvAnalysis: cvData?.analysis || null,
      linkedinAnalysis: linkedinAnalysis,
      improvementTips: improvementTips,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Complete analysis finished:', finalResults);
    setAnalysisResults(finalResults);
    setAnalysisProgress(100);
    
    toast.success('🎉 Komplett CV-analys klar!');

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analys misslyckades';
    toast.error(`Analys misslyckades: ${errorMessage}`);
    
    // Provide a basic fallback result so the form can still be submitted
    const fallbackResults = {
      cvAnalysis: {
        personalInfo: {
          name: 'Analysering misslyckades',
          email: 'Analysering misslyckades',
          phone: 'Analysering misslyckades'
        },
        professionalSummary: {
          yearsOfExperience: 'Okänd',
          seniorityLevel: 'Mid-level',
          currentRole: 'Konsult'
        },
        marketPositioning: {
          hourlyRateEstimate: {
            min: 800,
            max: 1200,
            recommended: 1000,
            currency: 'SEK'
          }
        }
      },
      linkedinAnalysis: createFallbackLinkedInAnalysis(),
      improvementTips: {
        cvTips: [],
        linkedinTips: [],
        overallStrategy: []
      },
      timestamp: new Date().toISOString()
    };
    
    setAnalysisResults(fallbackResults);
  } finally {
    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  }
};

const createFallbackLinkedInAnalysis = () => {
  return {
    communicationStyle: 'Professionell och tydlig',
    leadershipStyle: 'Kollaborativ',
    problemSolving: 'Analytisk',
    teamCollaboration: 'Stark teamspelare',
    innovation: 4,
    businessAcumen: 'God affärsförståelse',
    culturalFit: 4,
    leadership: 3,
    adaptability: 4
  };
};

const generateImprovementTips = (cvAnalysis: any, linkedinAnalysis: any) => {
  const tips = {
    cvTips: [],
    linkedinTips: [],
    overallStrategy: []
  };

  // CV Improvement Tips - More specific and actionable
  if (cvAnalysis) {
    // Technical Skills Section
    if (!cvAnalysis.technicalSkillsAnalysis?.programmingLanguages?.expert?.length) {
      tips.cvTips.push({
        category: 'Tekniska färdigheter',
        tip: 'Lägg till en dedikerad "Tekniska färdigheter"-sektion med tydliga färdighetsnivåer (Expert, Skicklig, Bekant).',
        priority: 'Hög',
        action: 'Skapa sektioner: "Expert: [språk]", "Skicklig: [ramverk]", "Verktyg: [programvara/plattformar]"'
      });
    }

    // Professional Summary
    if (!cvAnalysis.professionalSummary?.yearsOfExperience || cvAnalysis.professionalSummary.yearsOfExperience === 'Unknown') {
      tips.cvTips.push({
        category: 'Professionell sammanfattning',
        tip: 'Lägg till en 3-4 raders professionell sammanfattning som beskriver din erfarenhet och expertis.',
        priority: 'Hög',
        action: 'Skriv: "Erfaren [X-årig] [roll] specialiserad på [teknologier]. Bevisad track record inom [nyckelframgångar]. Tillgänglig för konsultuppdrag inom [fokusområden]."'
      });
    }

    // Work Experience
    if (!cvAnalysis.workExperience?.length || cvAnalysis.workExperience.length < 3) {
      tips.cvTips.push({
        category: 'Arbetslivserfarenhet',
        tip: 'Utvidga din arbetslivserfarenhet med specifika framgångar, använda teknologier och mätbara resultat.',
        priority: 'Hög',
        action: 'För varje roll, lägg till: Använda teknologier, Nyckelframgångar med siffror, Teamstorlek om du lett människor'
      });
    }

    // Missing certifications
    if (!cvAnalysis.education?.certifications?.length) {
      tips.cvTips.push({
        category: 'Certifieringar',
        tip: 'Lägg till en "Certifieringar"-sektion för att visa kontinuerlig kompetensutveckling.',
        priority: 'Medium',
        action: 'Inkludera: Professionella certifieringar (AWS, Azure, GCP), Ramverkscertifieringar, Branschcertifieringar'
      });
    }
  }

  // LinkedIn Improvement Tips
  if (linkedinAnalysis) {
    if (linkedinAnalysis.culturalFit < 4) {
      tips.linkedinTips.push({
        category: 'Professionell närvaro',
        tip: 'Dela mer innehåll om din arbetsfilosofi och professionella värderingar.',
        priority: 'Medium',
        action: 'Posta veckovis om: Framgångsrika projekt, Teamsamarbete, Professionella insikter, Branchtrender'
      });
    }

    if (linkedinAnalysis.leadership < 4) {
      tips.linkedinTips.push({
        category: 'Ledarskapsinnehåll',
        tip: 'Visa ledarskapsexempel genom inlägg om mentorskap och tekniska beslut.',
        priority: 'Hög',
        action: 'Dela berättelser om: Ledning av tekniska projekt, Mentorskap, Arkitekturbeslut, Problemlösning'
      });
    }
  } else {
    tips.linkedinTips.push({
      category: 'LinkedIn-profil',
      tip: 'Se till att din LinkedIn-profil är offentlig och komplett.',
      priority: 'Hög',
      action: 'Uppdatera: Professionell rubrik, Detaljerad arbetserfarenhet, Färdighetssektion, Offentliga profilinställningar'
    });
  }

  // Overall Strategy Tips
  tips.overallStrategy.push({
    category: 'Konsekvent varumärke',
    tip: 'Se till att ditt CV och LinkedIn berättar samma professionella historia.',
    priority: 'Hög',
    action: 'Anpassa: Jobbtitlar och datum, Färdigheter och teknologier, Professionell sammanfattning, Nyckelframgångar'
  });

  tips.overallStrategy.push({
    category: 'Konsultpositionering',
    tip: 'Positionera dig tydligt som konsult genom att betona projektbaserat arbete.',
    priority: 'Hög',
    action: 'Framhäv: Konsulterfarenhet, Kundresultat, Specialiserade färdigheter, Tillgänglighet för uppdrag'
  });

  console.log('📋 Generated detailed improvement tips:', tips);
  return tips;
};
