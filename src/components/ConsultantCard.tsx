
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Eye } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantCardProps {
  consultant: Consultant;
  onViewAnalysis?: (consultant: Consultant) => void;
}

export const ConsultantCard: React.FC<ConsultantCardProps> = ({ 
  consultant, 
  onViewAnalysis 
}) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{consultant.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="h-3 w-3" />
              <span>{consultant.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{consultant.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Teknisk expertis</h4>
          <div className="flex flex-wrap gap-1">
            {consultant.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {consultant.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{consultant.skills.length - 4} fler
              </Badge>
            )}
          </div>
        </div>

        {/* Experience & Rate */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Erfarenhet:</span>
            <p className="font-medium">{consultant.experience}</p>
          </div>
          <div>
            <span className="text-gray-600">Timpris:</span>
            <p className="font-medium">{consultant.rate}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">{consultant.availability}</span>
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-2">
          {onViewAnalysis && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onViewAnalysis(consultant)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visa fullständig analys
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
