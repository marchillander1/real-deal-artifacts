
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StripeCheckoutProps {
  planName: string;
  price: number;
  features: string[];
  priceId?: string;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  planName,
  price,
  features,
  priceId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, planName, price }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Fel vid betalning",
        description: "Kunde inte starta betalningsprocessen. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{planName}</CardTitle>
        <div className="text-3xl font-bold text-blue-600">
          {price} SEK<span className="text-base font-normal text-gray-600">/månad</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Behandlar...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Välj {planName}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
