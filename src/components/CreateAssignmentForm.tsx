import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Assignment } from '../types/consultant';

interface CreateAssignmentFormProps {
  onAssignmentCreated: (assignment: Assignment) => void;
  onCancel: () => void;
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({
  onAssignmentCreated,
  onCancel
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    startDate: '',
    duration: '',
    workload: '',
    budget: '',
    company: '',
    industry: '',
    teamSize: '',
    remote: '',
    urgency: '',
    teamCulture: '',
    desiredCommunicationStyle: '',
    requiredValues: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.requiredSkills) {
      toast({
        title: "Obligatoriska fält saknas",
        description: "Fyll i titel, beskrivning och skills.",
        variant: "destructive"
      });
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(skill => skill),
      startDate: formData.startDate,
      duration: formData.duration,
      workload: formData.workload,
      budget: formData.budget,
      company: formData.company,
      industry: formData.industry,
      teamSize: formData.teamSize,
      remote: formData.remote,
      urgency: formData.urgency,
      clientLogo: '/placeholder.svg',
      teamCulture: formData.teamCulture,
      desiredCommunicationStyle: formData.desiredCommunicationStyle,
      requiredValues: formData.requiredValues.split(',').map(value => value.trim()).filter(value => value),
      leadershipLevel: 3,
      teamDynamics: formData.teamCulture
    };

    onAssignmentCreated(newAssignment);
    
    toast({
      title: "Uppdrag skapat",
      description: "Nytt uppdrag har skapats.",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Skapa nytt uppdrag</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titel *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="t.ex. Senior React Developer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Företag</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Företagsnamn"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Beskrivning *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detaljerad beskrivning av uppdraget..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills *</label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="React, Node.js, TypeScript (kommaseparerat)"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Culture</label>
            <select
              name="teamCulture"
              value={formData.teamCulture}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Välj teamkultur</option>
              <option value="Innovativ och snabb">Innovativ och snabb</option>
              <option value="Strukturerad och metodisk">Strukturerad och metodisk</option>
              <option value="Kreativ och flexibel">Kreativ och flexibel</option>
              <option value="Resultatfokuserad">Resultatfokuserad</option>
              <option value="Samarbetsinriktad">Samarbetsinriktad</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kommunikationsstil</label>
            <select
              name="desiredCommunicationStyle"
              value={formData.desiredCommunicationStyle}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Välj stil</option>
              <option value="Direkt och tydlig">Direkt och tydlig</option>
              <option value="Diplomatisk">Diplomatisk</option>
              <option value="Informal och öppen">Informal och öppen</option>
              <option value="Formell">Formell</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Värderingar</label>
          <input
            type="text"
            name="requiredValues"
            value={formData.requiredValues}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Innovation, Kvalitet, Teamwork (kommaseparerat)"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Startdatum</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Längd</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="t.ex. 6 månader"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workload</label>
            <select
              name="workload"
              value={formData.workload}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Välj workload</option>
              <option value="100%">100%</option>
              <option value="75%">75%</option>
              <option value="50%">50%</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 800-1200 SEK/hour"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., FinTech, HealthTech"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
            <input
              type="text"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5-10 people"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remote Work</label>
            <select
              name="remote"
              value={formData.remote}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select option</option>
              <option value="Fully Remote">Fully Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Skapa uppdrag</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Avbryt
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignmentForm;
