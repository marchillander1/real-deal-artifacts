
import React, { useState } from "react";
import { Assignment } from "../types/consultant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Users, Briefcase, TrendingUp, Clock } from "lucide-react";
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

  // Dummy data for stats
  const totalConsultants = 156;
  const activeAssignments = assignments.length;
  const successfulMatches = 89;
  const avgMatchTime = "2.3 min";

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Consultants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalConsultants}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Active Assignments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeAssignments}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+5</span> new this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Successful Matches</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{successfulMatches}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">94%</span> success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Average Match Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgMatchTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15%</span> faster than target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Upload className="h-5 w-5" />
              Upload CV
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Upload consultant CVs for automatic AI profile creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Click to upload</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX up to 10MB</div>
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

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Briefcase className="h-5 w-5" />
              Create Assignment
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Add a new assignment for AI matching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="w-full"
            >
              New Assignment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Recent Activity</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Overview of new matches and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">New consultant added</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Anna Lindqvist - Frontend Developer</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">2 min ago</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">AI matching completed</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">E-commerce Platform Redesign - 5 matches</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">15 min ago</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">New assignment created</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Banking App Development</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
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
