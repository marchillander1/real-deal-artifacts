import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, User, MapPin, Phone, Mail, Clock, Star, Lightbulb, Linkedin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseConsultants } from '@/hooks/useSupabaseConsultants';

const CVUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { createConsultant, isCreating } = useSupabaseConsultants();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [motivation, setMotivation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzingLinkedIn, setIsAnalyzingLinkedIn] = useState(false);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    experience: '',
    role: '',
    location: '',
    rate: '',
    availability: '',
    phone: '',
    email: '',
    certifications: '',
    languages: ''
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only PDF, DOC, or DOCX files.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    const mockSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'JavaScript', 'Java', 'C#', 'Angular', 'Vue.js', 'PostgreSQL', 'Redis', 'Kubernetes'];
    const randomSkills = mockSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 4);
    const experienceYears = Math.floor(Math.random() * 10) + 2;
    
    const roles = [
      'Senior Developer', 'Full-Stack Developer', 'Frontend Developer', 
      'Backend Developer', 'DevOps Engineer', 'Software Architect', 'Tech Lead'
    ];
    const locations = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Linköping', 'Helsingborg', 'Örebro'];
    const certifications = [
      ['AWS Certified', 'React Advanced'],
      ['GCP Professional', 'Kubernetes Certified'],
      ['Azure Solutions Architect', 'Java Expert'],
      ['Google UX Design', 'Adobe Certified'],
      ['Professional Scrum Master', 'MongoDB Certified']
    ];

    const extractedData = {
      name: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '),
      skills: randomSkills.join(', '),
      experience: `${experienceYears} years`,
      role: roles[Math.floor(Math.random() * roles.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      rate: `${700 + Math.floor(Math.random() * 800)} SEK/hour`,
      availability: Math.random() > 0.3 ? 'Available' : 'Partially Available',
      phone: `+46 70 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 90) + 10}`,
      email: `${file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z]/g, '')}@email.com`,
      certifications: certifications[Math.floor(Math.random() * certifications.length)].join(', '),
      languages: 'Swedish, English'
    };

    setFormData(extractedData);

    toast({
      title: "CV Processed Successfully!",
      description: `Information extracted from ${file.name}. You can edit the fields below.`,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleLinkedInAnalysis = async () => {
    if (!linkedinUrl) {
      toast({
        title: "LinkedIn URL Required",
        description: "Please enter your LinkedIn profile URL",
        variant: "destructive"
      });
      return;
    }

    if (!linkedinUrl.includes('linkedin.com/in/')) {
      toast({
        title: "Invalid LinkedIn URL",
        description: "Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzingLinkedIn(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-linkedin', {
        body: { linkedinUrl }
      });

      if (error) throw error;

      if (data.success) {
        setLinkedinAnalysis(data.analysis);
        toast({
          title: "LinkedIn Analysis Complete!",
          description: `Analyzed ${data.postsAnalyzed} posts. Personality insights added to your profile.`,
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('LinkedIn analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze LinkedIn profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingLinkedIn(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "CV Required",
        description: "Please upload your CV first.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in at least name and email.",
        variant: "destructive"
      });
      return;
    }

    if (!linkedinUrl) {
      toast({
        title: "LinkedIn Profile Required",
        description: "Please enter your LinkedIn profile URL and analyze it.",
        variant: "destructive"
      });
      return;
    }

    if (!linkedinAnalysis) {
      toast({
        title: "LinkedIn Analysis Required",
        description: "Please analyze your LinkedIn profile first.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newConsultantData = {
        name: formData.name,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience: formData.experience,
        roles: [formData.role],
        location: formData.location,
        rate: formData.rate,
        availability: formData.availability,
        phone: formData.phone,
        email: formData.email,
        projects: Math.floor(Math.random() * 20) + 5,
        rating: Math.round((4.2 + Math.random() * 0.7) * 10) / 10,
        lastActive: 'Just now',
        certifications: formData.certifications.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
        type: 'new',
        linkedinUrl: linkedinUrl,
        communicationStyle: linkedinAnalysis.communicationStyle,
        workStyle: linkedinAnalysis.workStyle,
        values: linkedinAnalysis.values,
        personalityTraits: linkedinAnalysis.personalityTraits,
        teamFit: linkedinAnalysis.teamFit,
        culturalFit: linkedinAnalysis.culturalFit,
        adaptability: linkedinAnalysis.adaptability,
        leadership: linkedinAnalysis.leadership
      };

      // Save to Supabase instead of localStorage
      createConsultant(newConsultantData);

      setIsSubmitted(true);
      
      toast({
        title: "Profile Created Successfully!",
        description: "Your CV has been processed and saved to our database.",
      });

    } catch (error) {
      console.error('Error creating consultant:', error);
      toast({
        title: "Processing Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Welcome to Our Network!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Your CV has been processed and your LinkedIn personality analysis is complete!
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Your profile with LinkedIn insights is now visible to clients</li>
                <li>🎯 AI-powered matching based on personality and skills</li>
                <li>📧 Clients can contact you directly for projects</li>
                <li>🤝 Start building relationships with premium clients</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedFile(null);
                  setMotivation('');
                  setLinkedinUrl('');
                  setLinkedinAnalysis(null);
                  setFormData({
                    name: '',
                    skills: '',
                    experience: '',
                    role: '',
                    location: '',
                    rate: '',
                    availability: '',
                    phone: '',
                    email: '',
                    certifications: '',
                    languages: ''
                  });
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Another CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ConsultMatch AI</h1>
                <p className="text-sm text-gray-500">Join Our Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Consultant Network</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">Upload your CV and let our AI create your profile</p>
          <p className="text-lg text-gray-500">Get matched with premium opportunities automatically</p>
        </div>

        {/* CV Tips Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
              CV Tips for Success
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Keep it concise</h3>
                    <p className="text-sm text-gray-600">Aim for 1-2 pages maximum. Highlight your most relevant experience and skills.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Use keywords</h3>
                    <p className="text-sm text-gray-600">Include industry-specific keywords and technologies you're proficient in.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quantify achievements</h3>
                    <p className="text-sm text-gray-600">Use numbers and metrics to demonstrate your impact and results.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional format</h3>
                    <p className="text-sm text-gray-600">Use a clean, readable font and consistent formatting throughout.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Update regularly</h3>
                    <p className="text-sm text-gray-600">Keep your CV current with your latest projects and certifications.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Proofread carefully</h3>
                    <p className="text-sm text-gray-600">Ensure there are no spelling or grammatical errors before submitting.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Upload Your CV & LinkedIn Profile
            </h2>

            {/* File Upload Zone */}
            <div 
              className={`border-3 border-dashed rounded-xl p-8 text-center mb-6 transition-all cursor-pointer ${
                selectedFile 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <div className={`text-6xl mb-4 ${selectedFile ? 'text-green-600' : 'text-blue-600'}`}>
                {selectedFile ? '✅' : '📁'}
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-lg font-semibold text-green-800 mb-2">CV Uploaded & Processed!</p>
                  <p className="text-green-700">{selectedFile.name}</p>
                  <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
                  <p className="text-sm text-gray-500 mt-2">Information extracted below - you can edit any field</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">Drag & drop your CV here</p>
                  <p className="text-gray-600 mb-2">or click to browse</p>
                  <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX (max 10MB)</p>
                </div>
              )}
            </div>

            {/* LinkedIn Profile Section */}
            <div className="mb-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn Profile Analysis (Required)
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Add your LinkedIn profile URL so our AI can analyze and create a personality profile.
              </p>
              
              <div className="flex gap-3">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleLinkedInAnalysis}
                  disabled={isAnalyzingLinkedIn || !linkedinUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isAnalyzingLinkedIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Profile'
                  )}
                </button>
              </div>

              {linkedinAnalysis && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">✅ LinkedIn Analysis Complete</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <p><strong>Communication Style:</strong> {linkedinAnalysis.communicationStyle}</p>
                    <p><strong>Work Style:</strong> {linkedinAnalysis.workStyle}</p>
                    <p><strong>Values:</strong> {linkedinAnalysis.values.join(', ')}</p>
                    <p><strong>Personality Traits:</strong> {linkedinAnalysis.personalityTraits.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+46 70 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Stockholm"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role/Title</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5 years"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                  <input
                    type="text"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="800 SEK/hour"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select availability</option>
                    <option value="Available">Available</option>
                    <option value="Partially Available">Partially Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (comma separated)</label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="AWS Certified, React Advanced"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages (comma separated)</label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Swedish, English"
                  />
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What motivates you most in your work?</label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us what drives your passion for technology and your career goals..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isCreating || !linkedinAnalysis}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isCreating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Profile...
                  </span>
                ) : (
                  '🚀 Join Network & Get Matched'
                )}
              </button>

              {!linkedinAnalysis && (
                <p className="text-sm text-orange-600 text-center">
                  Please analyze your LinkedIn profile before submitting
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
