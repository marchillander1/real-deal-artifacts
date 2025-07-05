
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FavoriteData {
  consultant_id: string;
}

interface NoteData {
  consultant_id: string;
  note_text: string;
}

export const useFavoritesAndNotes = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavoritesAndNotes();
  }, []);

  const loadFavoritesAndNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Load favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('consultant_favorites')
        .select('consultant_id')
        .eq('user_id', user.id);

      if (favoritesError) {
        console.error('Error loading favorites:', favoritesError);
      } else {
        const favoriteIds = new Set(favoritesData?.map((f: FavoriteData) => f.consultant_id) || []);
        setFavorites(favoriteIds);
      }

      // Load notes
      const { data: notesData, error: notesError } = await supabase
        .from('consultant_notes')
        .select('consultant_id, note_text')
        .eq('user_id', user.id);

      if (notesError) {
        console.error('Error loading notes:', notesError);
      } else {
        const notesMap = new Map();
        notesData?.forEach((note: NoteData) => {
          notesMap.set(note.consultant_id, note.note_text);
        });
        setNotes(notesMap);
      }
    } catch (error) {
      console.error('Error loading favorites and notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFavorites = () => {
    loadFavoritesAndNotes();
  };

  return {
    favorites,
    notes,
    isLoading,
    refreshFavorites
  };
};
