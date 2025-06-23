
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Clock, Users, TrendingUp, Building2, Search, Filter, Upload, Plus, Eye, MessageSquare, Star, Briefcase } from 'lucide-react';
import { Input } from "@/components/ui/input";
import Navbar from './Navbar';
import { EnhancedConsultantsTab } from './EnhancedConsultantsTab';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import CreateAssignmentForm from './CreateAssignmentForm';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { AssignmentsSection } from './dashboard/AssignmentsSection';
import { Assignment } from '@/types/assignment';

interface DashboardProps {
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
  onAssignmentCreated: (newAssignment: Assignment) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assignments, onMatch, onAssignmentCreated, onFileUpload }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const { consultants: allConsultants, isLoading, error } = useSupabaseConsultantsWithDemo();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Manage your assignments and consultant network</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setIsCreateAssignmentOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <DashboardOverview 
          onCreateAssignment={() => setIsCreateAssignmentOpen(true)}
          consultants={allConsultants}
          assignments={assignments}
        />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
            <TabsTrigger value="consultants">Network Consultants ({allConsultants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Recent Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignments.slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">{assignment.company}</p>
                      </div>
                      <Badge variant={assignment.status === 'open' ? 'default' : 'secondary'}>
                        {assignment.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Network Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New consultants this week</span>
                    <span className="font-semibold">+{Math.floor(Math.random() * 10) + 1}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile views</span>
                    <span className="font-semibold">{Math.floor(Math.random() * 100) + 50}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Successful matches</span>
                    <span className="font-semibold">{Math.floor(Math.random() * 5) + 1}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsSection 
              assignments={assignments}
              onMatch={onMatch}
              consultants={allConsultants}
            />
          </TabsContent>

          <TabsContent value="consultants">
            <EnhancedConsultantsTab />
          </TabsContent>
        </Tabs>

        {/* Create Assignment Modal */}
        {isCreateAssignmentOpen && (
          <CreateAssignmentForm
            onClose={() => setIsCreateAssignmentOpen(false)}
            onCancel={() => setIsCreateAssignmentOpen(false)}
            onAssignmentCreated={onAssignmentCreated}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
