
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, ArrowLeft, Sparkles, Target, Award, Briefcase } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from 'react-router-dom';

const CVUpload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    currentRole: '',
    skills: '',
    workPreference: '',
    availability: '',
    industries: '',
    motivation: '',
    goals: '',
    projectTypes: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    toast({
      title: "CV Uploaded Successfully!",
      description: `${file.name} has been selected.`,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter(t => t !== type)
        : [...prev.projectTypes, type]
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const extractSkillsFromCV = (skillsInput) => {
    return skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);
  };

  const generateConsultantProfile = () => {
    const skillsArray = extractSkillsFromCV(formData.skills);
    const experienceYears = formData.experience.includes('0-2') ? '2 years' :
                          formData.experience.includes('3-5') ? '4 years' :
                          formData.experience.includes('6-10') ? '8 years' :
                          formData.experience.includes('10+') ? '12 years' : '5 years';

    const rating = 4.2 + Math.random() * 0.7;
    const projects = Math.floor(Math.random() * 20) + 10;

    return {
      id: Date.now(),
      name: formData.fullName,
      skills: skillsArray.slice(0, 8), // Take first 8 skills
      experience: experienceYears,
      roles: [formData.currentRole || 'Professional'],
      location: 'Sweden', // Default location
      rate: `${800 + Math.floor(Math.random() * 600)} SEK/hour`,
      availability: formData.availability === 'immediately' ? 'Available' : 'Partially Available',
      phone: formData.phone,
      email: formData.email,
      projects: projects,
      rating: Math.round(rating * 10) / 10,
      lastActive: 'Just now',
      cv: `${formData.motivation} - Experience: ${experienceYears} in ${formData.industries || 'various industries'}. Preferred work style: ${formData.workPreference}.`,
      certifications: ['Verified Professional'],
      languages: ['Swedish', 'English'],
      industries: formData.industries ? formData.industries.split(',').map(i => i.trim()) : ['Technology'],
      projectTypes: formData.projectTypes,
      goals: formData.goals,
      fileName: selectedFile?.name,
      registrationDate: new Date().toISOString()
    };
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

    if (!formData.fullName || !formData.email || !formData.experience || !formData.skills) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate consultant profile
      const newConsultant = generateConsultantProfile();

      // Store in localStorage (in a real app, this would be sent to your backend)
      const existingConsultants = JSON.parse(localStorage.getItem('uploadedConsultants') || '[]');
      existingConsultants.push(newConsultant);
      localStorage.setItem('uploadedConsultants', JSON.stringify(existingConsultants));

      // Also store the full application data
      const existingApplications = JSON.parse(localStorage.getItem('cvApplications') || '[]');
      existingApplications.push({
        ...formData,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        timestamp: new Date().toISOString(),
        consultantId: newConsultant.id
      });
      localStorage.setItem('cvApplications', JSON.stringify(existingApplications));

      setIsSubmitted(true);
      
      toast({
        title: "Welcome to Our Network!",
        description: "Your profile has been successfully submitted and will be reviewed within 24 hours.",
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Welcome to Our Premium Network!</h1>
              <p className="text-lg text-gray-600 mb-6">
                Your profile has been successfully submitted. Our AI matching system will analyze your CV and connect you with exciting opportunities within 24 hours!
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Your CV will be processed by our AI system</li>
                <li>🎯 We'll match you with relevant opportunities</li>
                <li>📧 You'll receive notifications about potential matches</li>
                <li>🤝 Connect directly with premium clients</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Platform</span>
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedFile(null);
                  setFormData({
                    fullName: '', email: '', phone: '', experience: '', currentRole: '',
                    skills: '', workPreference: '', availability: '', industries: '',
                    motivation: '', goals: '', projectTypes: []
                  });
                }}
                className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all"
              >
                <Upload className="h-4 w-4" />
                <span>Submit Another CV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const projectTypeOptions = [
    { id: 'mvp-development', label: 'MVP Development' },
    { id: 'ai-integration', label: 'AI Integration' },
    { id: 'system-architecture', label: 'System Architecture' },
    { id: 'digital-transformation', label: 'Digital Transformation' },
    { id: 'consulting', label: 'Technical Consulting' },
    { id: 'team-leadership', label: 'Team Leadership' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ConsultMatch AI</h1>
                <p className="text-sm text-gray-500">Join Our Premium Network</p>
              </div>
            </Link>
            <Link 
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Platform</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Unlock <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Great Job Opportunities</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4">Connect with premium clients and high-quality projects</p>
          <p className="text-lg text-gray-500">Specializing in AI, Technology & Business Transformation</p>
        </div>

        {/* Motivational Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">🚀 Ready for Exciting Opportunities?</h3>
          <p className="text-lg">Join our exclusive network of professionals and get matched with premium clients looking for your expertise!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Upload Your CV
              </h2>

              {/* File Upload Zone */}
              <div 
                className={`border-3 border-dashed rounded-xl p-8 text-center mb-6 transition-all cursor-pointer ${
                  selectedFile 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
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
                    <p className="text-lg font-semibold text-green-800 mb-2">CV Uploaded Successfully!</p>
                    <p className="text-green-700">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">{formatFileSize(selectedFile.size)}</p>
                    <p className="text-sm text-gray-500 mt-2">Click to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">Drag & drop your CV here</p>
                    <p className="text-gray-600 mb-2">or click to browse</p>
                    <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX (max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-2">0-2 years (Junior)</option>
                      <option value="3-5">3-5 years (Mid-level)</option>
                      <option value="6-10">6-10 years (Senior)</option>
                      <option value="10+">10+ years (Expert/Lead)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Role/Title</label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer, Data Scientist"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Skills & Technologies *</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Python, React, AWS, Machine Learning"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter your top 5-8 skills separated by commas</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Preference *</label>
                    <select
                      name="workPreference"
                      value={formData.workPreference}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select preference</option>
                      <option value="remote">Remote Only</option>
                      <option value="hybrid">Hybrid (Remote + Office)</option>
                      <option value="onsite">On-site Only</option>
                      <option value="flexible">Flexible/Open to All</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select availability</option>
                      <option value="immediately">Available Immediately</option>
                      <option value="2weeks">2 weeks notice</option>
                      <option value="1month">1 month notice</option>
                      <option value="3months">2-3 months</option>
                      <option value="exploring">Just exploring opportunities</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Industries</label>
                  <input
                    type="text"
                    name="industries"
                    value={formData.industries}
                    onChange={handleInputChange}
                    placeholder="e.g., FinTech, HealthTech, AI/ML, E-commerce"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Industries you're most interested in working with</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Project Types</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {projectTypeOptions.map((option) => (
                      <label key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.projectTypes.includes(option.id)}
                          onChange={() => handleProjectTypeChange(option.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What motivates you most in your work? *</label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    placeholder="e.g., Solving complex technical challenges, mentoring teams, building innovative products..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Help us understand what drives your passion for technology</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Career Goals & Aspirations</label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Lead AI initiatives, start own tech company, become CTO..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Where do you see yourself in the next 2-3 years?</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    '🚀 Get Matched with Premium Opportunities'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                CV Tips for Success
              </h2>

              <div className="space-y-4">
                {[
                  { icon: '👤', title: 'Professional Summary', desc: 'Start with a compelling 3-4 line summary highlighting your key expertise.' },
                  { icon: '🛠️', title: 'Technical Skills', desc: 'List specific technologies, tools, and certifications relevant to your roles.' },
                  { icon: '📊', title: 'Quantified Achievements', desc: 'Use numbers: "Increased efficiency by 40%" or "Led team of 12 developers".' },
                  { icon: '🎯', title: 'Project Examples', desc: 'Showcase 2-3 key projects with technologies used and outcomes.' },
                  { icon: '🏢', title: 'Industry Experience', desc: 'Highlight sector-specific knowledge and domain expertise.' }
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl">{tip.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
