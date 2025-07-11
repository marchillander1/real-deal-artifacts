import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CompanyContactDisplayProps {
  consultant: any;
}

interface CompanyContact {
  email: string;
  full_name: string;
  company: string;
}

export const CompanyContactDisplay: React.FC<CompanyContactDisplayProps> = ({ consultant }) => {
  const [companyContact, setCompanyContact] = useState<CompanyContact | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanyContact = async () => {
      if (!consultant.user_id || !consultant.company_id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email, full_name, company')
          .eq('id', consultant.user_id)
          .single();

        if (error) {
          console.error('Error fetching company contact:', error);
          return;
        }

        setCompanyContact(data);
      } catch (error) {
        console.error('Error fetching company contact:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyContact();
  }, [consultant.user_id, consultant.company_id]);

  if (!consultant.company_id) {
    // Not a company consultant, show regular contact info
    return (
      <div className="space-y-3">
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-500 mr-3" />
          <span>{consultant.email}</span>
        </div>
        {consultant.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-gray-500 mr-3" />
            <span>{consultant.phone}</span>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center text-gray-500">
        <Mail className="h-4 w-4 mr-3" />
        <span>Laddar kontaktuppgifter...</span>
      </div>
    );
  }

  if (!companyContact) {
    return (
      <div className="flex items-center text-gray-500">
        <Mail className="h-4 w-4 mr-3" />
        <span>Kontaktuppgifter ej tillgängliga</span>
      </div>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Building2 className="h-5 w-5 text-blue-600 mr-2" />
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Företagskonsult
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-3">
            För att komma i kontakt med {consultant.name}, kontakta företagskontakten:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-500 mr-3" />
              <span className="font-medium">{companyContact.full_name}</span>
            </div>
            
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500 mr-3" />
              <a 
                href={`mailto:${companyContact.email}?subject=Intresse för ${consultant.name}`}
                className="text-blue-600 hover:underline"
              >
                {companyContact.email}
              </a>
            </div>
            
            {companyContact.company && (
              <div className="flex items-center">
                <Building2 className="h-4 w-4 text-gray-500 mr-3" />
                <span>{companyContact.company}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};