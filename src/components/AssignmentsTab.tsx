
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, MapPin, DollarSign } from 'lucide-react';

export const AssignmentsTab: React.FC = () => {
  // Mock data for assignments
  const assignments = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp AB',
      location: 'Stockholm',
      duration: '6 months',
      rate: '950 SEK/hour',
      status: 'Active',
      description: 'Looking for an experienced React developer for a large-scale web application.',
      skills: ['React', 'TypeScript', 'Node.js'],
      posted: '2024-01-15'
    },
    {
      id: 2,
      title: 'Full-stack Developer',
      company: 'Innovation Labs',
      location: 'Göteborg',
      duration: '3 months',
      rate: '850 SEK/hour',
      status: 'Pending',
      description: 'Full-stack developer needed for fintech application development.',
      skills: ['JavaScript', 'Python', 'AWS'],
      posted: '2024-01-12'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          <p className="text-gray-600">Manage and track all assignments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-sm text-gray-600">Active Assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <p className="text-sm text-gray-600">Pending Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">28</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">850</div>
            <p className="text-sm text-gray-600">Avg. Rate/hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <p className="text-gray-600 font-medium">{assignment.company}</p>
                </div>
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{assignment.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{assignment.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{assignment.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{assignment.rate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {assignment.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Posted: {new Date(assignment.posted).toLocaleDateString('sv-SE')}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Find Matches
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
