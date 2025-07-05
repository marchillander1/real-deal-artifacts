
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface FavoriteButtonProps {
  consultantId: string;
  isFavorite: boolean;
  onToggle: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  consultantId,
  isFavorite,
  onToggle
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage favorites",
          variant: "destructive",
        });
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('consultant_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('consultant_id', consultantId);

        if (error) throw error;
        
        toast({
          title: "Removed from favorites",
          description: "Consultant removed from your favorites"
        });
      } else {
        const { error } = await supabase
          .from('consultant_favorites')
          .insert({
            user_id: user.id,
            consultant_id: consultantId
          });

        if (error) throw error;
        
        toast({
          title: "Added to favorites",
          description: "Consultant added to your favorites"
        });
      }

      onToggle();
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update favorite",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
    </Button>
  );
};
