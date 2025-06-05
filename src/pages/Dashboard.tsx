
import React, { useState } from "react";
import { Assignment, Consultant } from "../types/consultant";
import DashboardComponent from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";

export default function Dashboard() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);

  const handleMatch = (assignment: Assignment) => {
    console.log("Matching assignment:", assignment);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File upload:", event.target.files);
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DashboardComponent
          assignments={assignments}
          onMatch={handleMatch}
          onFileUpload={handleFileUpload}
          onAssignmentCreated={handleAssignmentCreated}
        />
      </div>
    </div>
  );
}
