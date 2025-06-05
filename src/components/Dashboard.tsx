import React, { useState } from "react";
import { Assignment, Consultant } from "../types/consultant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Users, Briefcase, TrendingUp, Clock, Star, ArrowUpRight } from "lucide-react";
import CreateAssignmentForm from "./CreateAssignmentForm";

interface DashboardProps {
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAssignmentCreated: (assignment: Assignment) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  assignments,
  onMatch,
  onFileUpload,
  onAssignmentCreated,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleMatch = (assignment: Assignment) => {
    onMatch(assignment);
  };

  // Dummy data for stats
  const totalConsultants = 156;
  const activeAssignments = assignments.length;
  const successfulMatches = 89;
  const avgMatchTime = "2.3 min";

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Konsulter</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultants}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> från förra månaden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Uppdrag</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+5</span> nya denna vecka
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lyckade Matchningar</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulMatches}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">94%</span> framgångsgrad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittlig Matchtid</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMatchTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15%</span> snabbare än målet
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Ladda upp CV
            </CardTitle>
            <CardDescription>
              Ladda upp konsult-CV för automatisk profilskapning med AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <div className="text-sm font-medium">Klicka för att ladda upp</div>
                    <div className="text-xs text-gray-500">PDF, DOC, DOCX upp till 10MB</div>
                  </div>
                </div>
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileUpload}
                  className="hidden"
                />
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Skapa Uppdrag
            </CardTitle>
            <CardDescription>
              Lägg till ett nytt uppdrag för AI-matchning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              Nytt Uppdrag
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste Aktivitet</CardTitle>
          <CardDescription>Översikt över nya matchningar och uppdateringar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Ny konsult tillagd</p>
                  <p className="text-sm text-gray-600">Anna Lindqvist - Frontend Developer</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">2 min sedan</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">AI-matchning slutförd</p>
                  <p className="text-sm text-gray-600">E-commerce Platform Redesign - 5 matches</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">15 min sedan</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Nytt uppdrag skapat</p>
                  <p className="text-sm text-gray-600">Mobile Banking App Development</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">1 timme sedan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={(assignment) => {
            onAssignmentCreated(assignment);
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
