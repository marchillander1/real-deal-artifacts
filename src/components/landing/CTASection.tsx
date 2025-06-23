
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Sparkles } from 'lucide-react';
import BookMeetingButton from '../BookMeetingButton';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Upload className="h-16 w-16 mb-4" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to unlock your freelance potential?
          </h2>
          
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join hundreds of IT consultants who've already discovered their true market value and growth opportunities with our AI-powered analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/cv-upload"
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Upload className="h-5 w-5" />
              <span>Upload CV & Get Analysis</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <BookMeetingButton />
          </div>
          
          <div className="mt-8 text-blue-100">
            <p className="text-sm">
              ✅ Free analysis • ✅ No commitment • ✅ Results in minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
