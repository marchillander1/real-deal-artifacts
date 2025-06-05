
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

  // Check if this is the most popular plan (Team Plan at 199 EUR)
  const isPopular = planName === "Team Plan" && price === 199;

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
        title: "Payment Error",
        description: "Could not start payment process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <Card className={`w-full max-w-sm h-full ${isPopular ? 'border-green-500 border-2' : ''}`}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{planName}</CardTitle>
          <div className="text-3xl font-bold text-blue-600">
            €{price}<span className="text-base font-normal text-gray-600">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            className={`w-full ${isPopular ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Buy Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
