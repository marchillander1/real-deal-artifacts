
import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  Zap,
  Shield,
  BarChart3,
  PlayCircle,
  Calendar,
  Heart,
  Brain,
  MessageSquare
} from 'lucide-react';
import Logo from '../components/Logo';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Solution</a>
              <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-800">
                <Heart className="h-4 w-4 mr-2" />
                Human-First AI Matching
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Match the
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                  Whole Person
                </span>
                not just the CV
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                MatchWise AI revolutionizes consultant matching by analyzing both technical skills 
                AND soft factors like values, communication style, and personal fit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Watch Demo
                </button>
                <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Meeting
                </button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-400 mr-2" />
                  Human-First Matching
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-400 mr-2" />
                  12-Second Analysis
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-purple-400 mr-2" />
                  GDPR Secure
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Live Human-First Demo</h3>
                  <div className="flex items-center text-green-400">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Active
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-white">Anna Lindqvist</p>
                        <p className="text-sm text-gray-400">React Developer • Empathetic • Team Player</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">95%</span>
                      <p className="text-xs text-gray-500">human match</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className="font-medium text-white">Marcus Johansson</p>
                        <p className="text-sm text-gray-400">UX Designer • Creative • Structured</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">92%</span>
                      <p className="text-xs text-gray-500">human match</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">Analyzed soft factors in 12 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              CV-Based Matching Misses the Big Picture
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditional methods focus only on technical skills and miss the soft factors that determine project success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-6">
              <div className="text-red-400 mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Only Technical Skills</h3>
              <p className="text-gray-300">Misses values, communication style, and personal fit that are crucial</p>
            </div>
            
            <div className="bg-orange-900/30 border border-orange-800 rounded-xl p-6">
              <div className="text-orange-400 mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Poor Team Chemistry</h3>
              <p className="text-gray-300">60% of project issues stem from poor personal fit, not technical shortcomings</p>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-xl p-6">
              <div className="text-yellow-400 mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">High Costs</h3>
              <p className="text-gray-300">Poor human fit costs $250K annually in restarts and delays</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Human-First AI That Truly Understands
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              MatchWise AI analyzes the whole person - both technical skills and soft factors for perfect fit
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-900/50 p-3 rounded-lg border border-pink-800">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Values & Personality
                  </h3>
                  <p className="text-gray-300">
                    AI analyzes communication style, work approach, and personal values for deep compatibility
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-800">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Cultural Fit
                  </h3>
                  <p className="text-gray-300">
                    Advanced algorithms match team dynamics, leadership style, and adaptability
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-800">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Communication Style
                  </h3>
                  <p className="text-gray-300">
                    Identifies and matches communication types for optimal team harmony and productivity
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-purple-900/50 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Upload CV & Requirements</h4>
                    <p className="text-sm text-gray-300">Define both technical and soft requirements for the project</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Human-First AI Analysis</h4>
                    <p className="text-sm text-gray-300">AI analyzes values, communication, and personality</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Perfect Human Match</h4>
                    <p className="text-sm text-gray-300">Get ranked candidates based on holistic fit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Proven ROI That Speaks for Itself
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-8 text-white text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">850+</h3>
              <p className="text-green-100 mb-1">Hours Saved Annually</p>
              <p className="text-sm text-green-200">≈ $210K in cost savings</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white text-center">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">96%</h3>
              <p className="text-blue-100 mb-1">Customer Satisfaction</p>
              <p className="text-sm text-blue-200">+36% vs manual matching</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-white text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">75x</h3>
              <p className="text-purple-100 mb-1">Faster Matching</p>
              <p className="text-sm text-purple-200">12 seconds vs 15 hours</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              What Our Customers Say
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-l-4 border-blue-500 pl-6">
                <p className="text-gray-300 mb-4 italic">
                  "MatchWise AI understands not just technical skills but also if the person fits our team. 
                  Team chemistry improved to 95% compared to previous 60%."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <div>
                    <p className="font-semibold text-white">Erik Svensson</p>
                    <p className="text-sm text-gray-400">CTO, TechCorp AB</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-gray-300 mb-4 italic">
                  "The ROI is incredible. We saved $210K the first year through better human fit 
                  and reduced project delays."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-white">Maria Lundberg</p>
                    <p className="text-sm text-gray-400">HR Manager, Innovation Labs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your company's needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-700 rounded-xl p-8 bg-gray-800">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 mb-6">Perfect for small teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$500</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Up to 10 matches/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Basic human analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Email support</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Start Free Trial
              </button>
            </div>
            
            <div className="border-2 border-blue-500 rounded-xl p-8 relative bg-gray-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-gray-400 mb-6">For growing companies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$1,500</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Up to 50 matches/month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Advanced human analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Custom integrations</span>
                </li>
              </ul>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Start Free Trial
              </button>
            </div>
            
            <div className="border border-gray-700 rounded-xl p-8 bg-gray-800">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Unlimited matches</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Custom human analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">White-label solution</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Consultant Matching?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading companies saving $210K annually with 95% human fit
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
              <PlayCircle className="h-5 w-5 mr-2" />
              Watch 2-Min Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors flex items-center justify-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book Meeting
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" className="mb-4" />
              <p className="text-gray-400 mb-4">
                Human-first AI matching that delivers 95% fit in 12 seconds.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MatchWise AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
