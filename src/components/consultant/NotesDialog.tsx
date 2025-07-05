
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { StickyNote, Save, X } from 'lucide-react';

interface NotesDialogProps {
  consultantId: string;
  consultantName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const NotesDialog: React.FC<NotesDialogProps> = ({
  consultantId,
  consultantName,
  isOpen,
  onClose
}) => {
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadNote();
    }
  }, [isOpen, consultantId]);

  const loadNote = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('consultant_notes')
        .select('note_text')
        .eq('user_id', user.id)
        .eq('consultant_id', consultantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setNote(data?.note_text || '');
    } catch (error: any) {
      console.error('Error loading note:', error);
      toast({
        title: "Error",
        description: "Failed to load note",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveNote = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save notes",
          variant: "destructive",
        });
        return;
      }

      if (note.trim()) {
        const { error } = await supabase
          .from('consultant_notes')
          .upsert({
            user_id: user.id,
            consultant_id: consultantId,
            note_text: note.trim(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        
        toast({
          title: "Note saved",
          description: "Your note has been saved successfully"
        });
      } else {
        // Delete note if empty
        const { error } = await supabase
          .from('consultant_notes')
          .delete()
          .eq('user_id', user.id)
          .eq('consultant_id', consultantId);

        if (error) throw error;
        
        toast({
          title: "Note deleted",
          description: "Empty note has been removed"
        });
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save note",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notes for {consultantName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Add your private notes about this consultant..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            disabled={isLoading}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={saveNote} disabled={isSaving}>
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
