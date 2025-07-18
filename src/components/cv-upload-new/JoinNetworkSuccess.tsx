
import React from 'react';
import { CheckCircle, Star, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinNetworkSuccessProps {
  consultantId: string;
}

export const JoinNetworkSuccess: React.FC<JoinNetworkSuccessProps> = ({
  consultantId
}) => {
  const handleExploreOpportunities = () => {
    // Navigate to the consultant's profile page
    window.location.href = '/my-profile';
  };

  const handleViewProfile = () => {
    // For now, just show an alert - later this could navigate to a profile page
    alert('Profile viewing will be available soon!');
  };

  const handleStartOver = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Welcome to the MatchWise Network! 🎉
          </CardTitle>
          <p className="text-lg opacity-90">
            Your profile has been successfully created and you're now part of our exclusive consultant network.
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Success Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <Star className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Profile Created</h3>
              <p className="text-sm text-green-700">Your consultant profile is now live and optimized</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Network Access</h3>
              <p className="text-sm text-blue-700">Connected to 500+ top companies and recruiters</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">AI Matching</h3>
              <p className="text-sm text-purple-700">Smart algorithm matches you with perfect assignments</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">What's next?</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Your profile is now visible to companies looking for consultants with your skills</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>You'll receive email notifications when matching assignments are available</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span>Browse and apply to assignments that match your expertise and interests</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleExploreOpportunities}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Explore Opportunities
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button
              onClick={handleViewProfile}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:bg-slate-50 transition-all duration-200"
            >
              View My Profile
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              <strong>Profile ID:</strong> {consultantId.substring(0, 8)}... • 
              <strong> Network Status:</strong> Active • 
              <strong> Visibility:</strong> Public to verified companies
            </p>
          </div>

          {/* Start Over Option */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartOver}
              className="text-sm text-slate-500 hover:text-slate-700 underline transition-colors duration-200"
            >
              Want to analyze another CV? Start over
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
