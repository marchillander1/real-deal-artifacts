
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ModernNavbar } from '@/components/modern/ModernNavbar';
import { CheckCircle, Users, Star, ArrowRight, Mail, Calendar } from 'lucide-react';

const NetworkSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get('consultant');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-green-100 p-6 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            🎉 Welcome to MatchWise Network!
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Congratulations! You're now part of an exclusive network of top consultants. 
            Your profile is live and visible to premium clients looking for exactly your expertise.
          </p>

          {/* What Happens Next */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What happens next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">Check Your Email</h3>
                  <p className="text-slate-600">We've sent you a welcome email with next steps and tips to maximize your visibility.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">Profile Goes Live</h3>
                  <p className="text-slate-600">Your consultant profile is now active and visible to clients in our premium network.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">AI Matching Begins</h3>
                  <p className="text-slate-600">Our AI will start matching you with relevant assignments based on your skills and preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-slate-900 mb-1">First Matches</h3>
                  <p className="text-slate-600">Expect to see your first potential matches within 24-48 hours as new assignments are posted.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Success Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <p className="text-slate-600">of consultants get their first interview within 2 weeks</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">+40%</div>
              <p className="text-slate-600">average rate increase after joining our network</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
              <p className="text-slate-600">premium clients actively seeking consultants</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Explore MatchWise Platform
            </Link>
            
            <Link
              to={`/analysis?id=${consultantId}`}
              className="bg-white text-slate-700 border-2 border-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              View My Analysis Again
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 text-sm">
              Our team is here to support you. If you have questions about your profile, 
              matches, or how to optimize your visibility, don't hesitate to reach out at{' '}
              <a href="mailto:support@matchwise.tech" className="underline font-medium">
                support@matchwise.tech
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkSuccess;
