import React from 'react';

export default function AIPowerBriefing() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    await fetch('https://matchwise.app.n8n.cloud/webhook/icp-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('✅ Your request has been sent! Check your email shortly.');
  };

  return (
    <div>
      <h2>AI ICP + Outreach Generator</h2>
      <p>Fill out the form to get your tailored Ideal Customer Profile and outreach strategy delivered as PDF + CSV.</p>

      <form id="icpForm" onSubmit={handleSubmit}>
        <label>Your Email:</label><br />
        <input type="email" name="recipientEmail" required /><br /><br />

        <label>Your Service / Solution:</label><br />
        <input type="text" name="service" required /><br /><br />

        <label>Target Market:</label><br />
        <input type="text" name="market" required /><br /><br />

        <label>Target Roles (CEO, CTO, etc.):</label><br />
        <input type="text" name="roles" required /><br /><br />

        <label>Outreach Tone:</label><br />
        <input type="text" name="tone" placeholder="Warm, Advisory, Direct, Premium" /><br /><br />

        <label>Example Clients (optional):</label><br />
        <input type="text" name="exampleClients" /><br /><br />

        <label>Preferred Report Language:</label><br />
        <select name="outputLanguage">
          <option value="en">English</option>
          <option value="sv">Swedish</option>
        </select><br /><br />

        <button type="submit">Generate Report</button>
      </form>
    </div>
  );
}