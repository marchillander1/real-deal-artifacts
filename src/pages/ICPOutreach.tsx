import React from 'react';

const ICPOutreach = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
    
    try {
      await fetch('https://matchwise.app.n8n.cloud/webhook/icp-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('✅ Your request has been sent! Check your email shortly.');
    } catch (error) {
      alert('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">AI ICP + Outreach Generator</h2>
        <p className="mb-8 text-lg">Fill out the form to get your tailored Ideal Customer Profile and outreach strategy delivered as PDF + CSV.</p>

        <form id="icpForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Your Email:</label>
            <input 
              type="email" 
              name="recipientEmail" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Your Service / Solution:</label>
            <input 
              type="text" 
              name="service" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Target Market:</label>
            <input 
              type="text" 
              name="market" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Target Roles (CEO, CTO, etc.):</label>
            <input 
              type="text" 
              name="roles" 
              required 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Outreach Tone:</label>
            <input 
              type="text" 
              name="tone" 
              placeholder="Warm, Advisory, Direct, Premium" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Example Clients (optional):</label>
            <input 
              type="text" 
              name="exampleClients" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Preferred Report Language:</label>
            <select 
              name="outputLanguage" 
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="sv">Swedish</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ICPOutreach;