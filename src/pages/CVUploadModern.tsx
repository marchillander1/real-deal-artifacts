
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CVUploadModern = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main cv-upload page
    navigate('/cv-upload', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to CV Upload...</p>
      </div>
    </div>
  );
};

export default CVUploadModern;
