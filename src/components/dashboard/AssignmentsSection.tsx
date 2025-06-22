
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, Building, Users, Clock, Target, AlertCircle } from 'lucide-react';
import { Assignment, Consultant } from '@/types/consultant';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { calculateMatch } from '@/utils/aiMatchingEngine';
import CreateAssignmentForm from '@/components/CreateAssignmentForm';

export const AssignmentsSection: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { consultants } = useSupabaseConsultantsWithDemo();

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.requiredSkills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreateAssignment = async (newAssignment: Assignment) => {
    try {
      // Call the create-assignment edge function
      const response = await fetch('/supabase/functions/create-assignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
          company: newAssignment.company,
          industry: newAssignment.industry,
          requiredSkills: newAssignment.requiredSkills,
          duration: newAssignment.duration,
          workload: newAssignment.workload,
          budgetMin: parseInt(newAssignment.budget.split('-')[0]?.replace(/\D/g, '') || '0'),
          budgetMax: parseInt(newAssignment.budget.split('-')[1]?.replace(/\D/g, '') || '0'),
          budgetCurrency: 'SEK',
          teamSize: newAssignment.teamSize,
          remote: newAssignment.remote,
          urgency: newAssignment.urgency,
          clientLogo: '🏢',
          desiredCommunicationStyle: newAssignment.desiredCommunicationStyle,
          teamCulture: newAssignment.teamCulture,
          requiredValues: newAssignment.requiredValues,
          teamDynamics: newAssignment.teamDynamics,
          startDate: newAssignment.startDate,
          leadershipLevel: newAssignment.leadershipLevel || 3
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }

      const result = await response.json();
      
      if (result.success) {
        // Add to local state
        setAssignments(prev => [...prev, { ...newAssignment, id: result.assignment.id }]);
        setShowCreateForm(false);

        // Check for skill matches and send alerts
        await checkForSkillMatches(newAssignment);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const checkForSkillMatches = async (assignment: Assignment) => {
    // Find consultants that match required skills
    const matchingConsultants = consultants.filter(consultant => 
      assignment.requiredSkills.some(skill => 
        consultant.skills.some(cSkill => 
          cSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );

    // Send skill alerts for each matching consultant
    for (const consultant of matchingConsultants) {
      const matchingSkills = assignment.requiredSkills.filter(skill =>
        consultant.skills.some(cSkill => 
          cSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

      try {
        await fetch('/supabase/functions/send-skill-alert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consultant,
            matchingSkills,
            subscriberEmail: 'admin@matchwise.ai' // This would come from skill alert subscriptions
          }),
        });
      } catch (error) {
        console.error('Error sending skill alert:', error);
      }
    }
  };

  const getMatches = (assignment: Assignment): { consultant: Consultant; matchScore: number }[] => {
    return consultants
      .map(consultant => ({
        consultant,
        matchScore: calculateMatch(consultant, assignment).totalMatchScore
      }))
      .filter(match => match.matchScore > 60)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-gray-600">Manage and match assignments with consultants</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search assignments by title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Assignments Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredAssignments.map((assignment) => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment} 
            matches={getMatches(assignment)}
          />
        ))}
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600 mb-4">Create your first assignment to start matching with consultants</p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create First Assignment
          </Button>
        </div>
      )}

      {/* Create Assignment Form */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={handleCreateAssignment}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

interface AssignmentCardProps {
  assignment: Assignment;
  matches: { consultant: Consultant; matchScore: number }[];
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment, matches }) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{assignment.clientLogo}</span>
              <div>
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                <p className="text-sm text-gray-600">{assignment.company}</p>
              </div>
            </div>
          </div>
          <Badge className={getUrgencyColor(assignment.urgency)}>
            {assignment.urgency}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 text-sm line-clamp-2">{assignment.description}</p>
        
        {/* Skills */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Required Skills</p>
          <div className="flex flex-wrap gap-1">
            {assignment.requiredSkills.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {assignment.requiredSkills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{assignment.requiredSkills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Assignment Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{assignment.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Workload:</span>
            <span className="font-medium">{assignment.workload}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Team:</span>
            <span className="font-medium">{assignment.teamSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3 text-gray-500" />
            <span className="text-gray-600">Remote:</span>
            <span className="font-medium">{assignment.remote}</span>
          </div>
        </div>

        {/* Top Matches */}
        {matches.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Top Matches ({matches.length})
              </span>
            </div>
            <div className="space-y-2">
              {matches.slice(0, 2).map((match, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{match.consultant.name}</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {match.matchScore}% match
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">No strong matches found</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          {matches.length > 0 && (
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              View Matches ({matches.length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
