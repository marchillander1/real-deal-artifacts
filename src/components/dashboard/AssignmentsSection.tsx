
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Building2,
  Brain,
  Zap,
  Plus
} from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';
import { AIMatchingResults } from './AIMatchingResults';
import { CreateAssignmentForm } from '../assignments/CreateAssignmentForm';

interface AssignmentsSectionProps {
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
  consultants: Consultant[];
}

export const AssignmentsSection: React.FC<AssignmentsSectionProps> = ({ 
  assignments, 
  onMatch, 
  consultants 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.requiredSkills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAIMatch = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowMatchResults(true);
    onMatch(assignment);
  };

  const handleCreateAssignment = (newAssignment: any) => {
    // This will be handled by the parent component's data refresh
    window.location.reload(); // Simple refresh for now
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-gray-600">Manage assignments and find the perfect consultant matches</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assignments by title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Open Assignments</p>
                <p className="text-xl font-bold">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-xl font-bold">{assignments.filter(a => a.urgency === 'High').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">AI Matches Made</p>
                <p className="text-xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Match Time</p>
                <p className="text-xl font-bold">12s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{assignment.clientLogo}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {assignment.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {assignment.remote || 'On-site'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {assignment.duration}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {assignment.budget}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-2">{assignment.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getUrgencyColor(assignment.urgency)} variant="secondary">
                    {assignment.urgency} Priority
                  </Badge>
                  <div className="text-sm text-gray-500">{assignment.teamSize}</div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {assignment.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Team Culture */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Team Culture:</p>
                <p className="text-sm text-gray-600">{assignment.teamCulture}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>Team Size: {assignment.teamSize}</span>
                </div>
                <Button 
                  onClick={() => handleAIMatch(assignment)}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  AI Match Consultants
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first assignment to get started'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Assignment
            </Button>
          )}
        </div>
      )}

      {/* Create Assignment Form */}
      {showCreateForm && (
        <CreateAssignmentForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateAssignment}
        />
      )}

      {/* AI Matching Results Modal */}
      {selectedAssignment && (
        <AIMatchingResults
          assignment={selectedAssignment}
          open={showMatchResults}
          onOpenChange={setShowMatchResults}
        />
      )}
    </div>
  );
};
