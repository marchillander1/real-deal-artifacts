
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MapPin, Star, Clock, Phone, Mail } from "lucide-react";
import ConsultantCard from "./ConsultantCard";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";

export const ConsultantsTab = () => {
  const { consultants, isLoading, error } = useSupabaseConsultants();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Laddar konsulter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Fel vid hämtning av konsulter</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Konsulter</h2>
          <p className="text-gray-600 mt-1">{consultants.length} konsulter tillgängliga</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Lägg till konsult
        </Button>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultants.map((consultant) => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>

      {consultants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Inga konsulter hittades</div>
          <p className="text-gray-400 mt-2">Lägg till konsulter för att komma igång</p>
        </div>
      )}
    </div>
  );
};
