import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Heart, Clock, Shield, Star, TrendingUp, LogIn, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import AIMatchingPreview from '@/components/AIMatchingPreview';
import ROICalculator from '@/components/ROICalculator';
import BookMeetingButton from '@/components/BookMeetingButton';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Solution</a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/matchwiseai">
                <Button>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/cv-upload">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    CV Upload
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-500">
                <Heart className="w-3 h-3 mr-1" />
                Human-First AI Matching
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Match the
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block">
                  Whole Person
                </span>
                <span className="text-white">not just the CV</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                MatchWise AI revolutionizes consultant matching by analyzing both technical skills AND soft factors 
                like values, communication style, and personal fit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
                {user ? (
                  <Link to="/matchwiseai">
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-gray-600 text-white hover:bg-gray-800">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-gray-600 text-white hover:bg-gray-800">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-5 w-5 text-pink-400 mr-2" />
                    <span className="text-white font-medium">Human-First</span>
                  </div>
                  <span className="text-gray-400 text-sm">Matching</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-white font-medium">12-Second</span>
                  </div>
                  <span className="text-gray-400 text-sm">Analysis</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-purple-400 mr-2" />
                    <span className="text-white font-medium">GDPR</span>
                  </div>
                  <span className="text-gray-400 text-sm">Secure</span>
                </div>
              </div>
            </div>

            {/* Right side - Dashboard Preview */}
            <div className="relative">
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Logo />
                      <span className="text-white font-semibold">Platform v2.0</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">Real-time insights and performance metrics</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">Active Consultants</span>
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">👥</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">5</div>
                        <div className="text-green-400 text-xs">+12 this week</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-300 text-sm">Open Assignments</span>
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">📋</span>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">3</div>
                        <div className="text-green-400 text-xs">+5 today</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gray-700/30 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">🤖</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">AI Matching Engine</div>
                            <div className="text-gray-400 text-sm">95% accuracy • 12-second analysis</div>
                          </div>
                        </div>
                        <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="solution" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">CV-Based Matching Misses the Big Picture</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditional methods focus only on technical skills and miss the soft factors that determine project success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-6">
                <div className="text-red-400 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Only Technical Skills</h3>
                <p className="text-gray-300">
                  Misses values, communication style, and personal fit that are crucial
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-900/20 border-orange-500/50">
              <CardContent className="p-6">
                <div className="text-orange-400 mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Poor Team Chemistry</h3>
                <p className="text-gray-300">
                  60% of project issues stem from poor personal fit, not technical shortcomings
                </p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-500/50">
              <CardContent className="p-6">
                <div className="text-yellow-400 mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">High Costs</h3>
                <p className="text-gray-300">
                  Poor human fit costs $250K annually in restarts and delays
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live AI Matching Demo */}
      <section className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">See Our AI in Action</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience real-time human-first matching that analyzes the whole person in seconds
            </p>
          </div>

          <AIMatchingPreview />
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Human-First AI That Truly Understands</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              MatchWise AI analyzes the whole person - both technical skills and soft factors for perfect fit
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Values & Personality</h3>
                  <p className="text-gray-300">
                    AI analyzes communication style, work approach, and personal values for deep compatibility
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cultural Fit</h3>
                  <p className="text-gray-300">
                    Advanced algorithms match team dynamics, leadership style, and adaptability
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Communication Style</h3>
                  <p className="text-gray-300">
                    Identifies and matches communication types for optimal team harmony and productivity
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-white">Upload CV & Requirements</h4>
                      <p className="text-gray-400 text-sm">Define both technical and soft requirements for the project</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-white">Human-First AI Analysis</h4>
                      <p className="text-gray-400 text-sm">AI analyzes values, communication, and personality</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-white">Perfect Human Match</h4>
                      <p className="text-gray-400 text-sm">Get ranked candidates based on holistic fit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Match Explanation Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Our Matches Are Better</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditional CV-based matching vs. MatchWise AI's human-first approach
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Traditional Matching */}
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Traditional CV Matching</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Skills-Only Focus</h4>
                      <p className="text-gray-300 text-sm">Matches based purely on technical competencies, ignoring personality and cultural fit</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">High Failure Rate</h4>
                      <p className="text-gray-300 text-sm">40% of projects fail due to poor team chemistry and communication issues</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Time Consuming</h4>
                      <p className="text-gray-300 text-sm">15+ hours per hire with multiple interview rounds and assessments</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Expensive Mistakes</h4>
                      <p className="text-gray-300 text-sm">Poor fits cost €250K annually in project restarts and delays</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MatchWise AI */}
            <Card className="bg-green-900/20 border-green-500/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">MatchWise AI Human-First</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Holistic Analysis</h4>
                      <p className="text-gray-300 text-sm">Analyzes technical skills + personality + values + communication style for perfect fit</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">96% Success Rate</h4>
                      <p className="text-gray-300 text-sm">Superior human fit leads to better team chemistry and project outcomes</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">12-Second Analysis</h4>
                      <p className="text-gray-300 text-sm">AI processes years of experience and personality data instantly</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Massive Savings</h4>
                      <p className="text-gray-300 text-sm">Save €210K annually through better human fit and reduced failures</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Card className="bg-blue-600/20 border-blue-500 inline-block">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-white mb-2">75x Faster</div>
                <div className="text-blue-300">with 36% higher satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Calculate Your ROI</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See exactly how much MatchWise AI can save your company
            </p>
          </div>

          <ROICalculator />
        </div>
      </section>

      {/* ROI Section */}
      <section id="benefits" className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Proven ROI That Speaks for Itself</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-green-100" />
                <div className="text-4xl font-bold mb-2">850+</div>
                <div className="text-xl font-semibold mb-2">Hours Saved Annually</div>
                <div className="text-green-100">≈ $210K in cost savings</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-blue-100" />
                <div className="text-4xl font-bold mb-2">96%</div>
                <div className="text-xl font-semibold mb-2">Customer Satisfaction</div>
                <div className="text-blue-100">+36% vs manual matching</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-100" />
                <div className="text-4xl font-bold mb-2">75x</div>
                <div className="text-xl font-semibold mb-2">Faster Matching</div>
                <div className="text-purple-100">12 seconds vs 15 hours</div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonials */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">What Our Customers Say</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-l-4 border-blue-500 pl-6">
                  <p className="text-gray-300 text-lg italic mb-4">
                    "MatchWise AI understands not just technical skills but also if the person fits our team. Team chemistry improved to 95% compared to previous 60%."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">E</div>
                    <div>
                      <div className="font-semibold text-white">Erik Svensson</div>
                      <div className="text-gray-400 text-sm">CTO, TechCorp AB</div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <p className="text-gray-300 text-lg italic mb-4">
                    "The ROI is incredible. We saved $210K the first year through better human fit and reduced project delays."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                    <div>
                      <div className="font-semibold text-white">Maria Lundberg</div>
                      <div className="text-gray-400 text-sm">HR Manager, Innovation Labs</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">💰 Pricing Overview</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your company's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <Card className="bg-gray-800/50 border-gray-600">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  <h3 className="text-xl font-bold text-white">Basic Plan</h3>
                </div>
                <p className="text-gray-400 mb-6">For 1-3 users</p>
                <div className="text-3xl font-bold text-white mb-6">€99<span className="text-lg text-gray-400">/month</span></div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Full access to consultant search and filtering
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    View detailed profiles incl. soft skills and CVs
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Save favorites & download CVs
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    1 admin + 2 standard users
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Email support
                  </li>
                </ul>

                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="bg-gray-800/50 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-green-600 rounded"></div>
                  <h3 className="text-xl font-bold text-white">Team Plan</h3>
                </div>
                <p className="text-gray-400 mb-6">For 3-10 users</p>
                <div className="text-3xl font-bold text-white mb-6">€199<span className="text-lg text-gray-400">/month</span></div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Everything in Basic, plus:
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Extended user access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Role-based access control
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Priority email support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Early feature access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Export consultant lists
                  </li>
                </ul>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gray-800/50 border-red-600">
              <CardContent className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-red-600 rounded"></div>
                  <h3 className="text-xl font-bold text-white">Enterprise</h3>
                </div>
                <p className="text-gray-400 mb-6">For organizations using Free Talent Pool</p>
                <div className="text-3xl font-bold text-white mb-6">€599<span className="text-lg text-gray-400">/month</span></div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Unlimited searches in the open consultant database
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Direct access to incoming freelance CVs
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Premium visibility settings for your jobs
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Integration possibilities (API access upon request)
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    Dedicated onboarding
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    SLA-backed support
                  </li>
                </ul>

                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Consultant Matching?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading companies saving €210K annually with 96% human fit
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BookMeetingButton />
            
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Watch 2-Min Demo
            </Button>
            
            {!user && (
              <Link to="/auth">
                <Button size="lg" className="px-8 py-3 text-lg bg-white text-blue-600 hover:bg-gray-100">
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
          
          <p className="text-blue-100 mt-6 text-sm">
            🚀 Get your first perfect match in under 60 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900/80 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="text-gray-400 mt-4">
                Human-first AI matching that delivers 95% fit in 12 seconds.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 MatchWise AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
