
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface SelfDescriptionStepProps {
  selfDescription: string;
  setSelfDescription: (description: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

const SelfDescriptionStep: React.FC<SelfDescriptionStepProps> = ({
  selfDescription,
  setSelfDescription,
  onNext,
  onSkip
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Tell us about yourself</CardTitle>
        <p className="text-slate-600">
          Add a personal description in your own words (optional)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="self-description">Personal Description</Label>
          <Textarea
            id="self-description"
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
            placeholder="Tell us about yourself, your passions, working style, or anything else you'd like to share..."
            rows={6}
            maxLength={500}
            className="mt-2"
          />
          <p className="text-xs text-slate-500 mt-1">
            {selfDescription.length}/500 characters
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onSkip} variant="outline" className="flex-1">
            Skip
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfDescriptionStep;
