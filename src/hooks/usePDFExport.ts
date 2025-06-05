
import { useCallback } from 'react';
import jsPDF from 'jspdf';
import { Assignment, Consultant } from '../types/consultant';

interface Match {
  consultant: Consultant;
  score: number;
  matchedSkills: string[];
  estimatedSavings: number;
  responseTime: number;
  humanFactorsScore: number;
  culturalMatch: number;
  communicationMatch: number;
  valuesAlignment: number;
}

export const usePDFExport = () => {
  const exportMatchesToPDF = useCallback(async (matches: Match[], assignment: Assignment) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('AI Matching Results', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Assignment: ${assignment.title}`, 20, 45);
    pdf.text(`Company: ${assignment.company}`, 20, 55);
    pdf.text(`Generated: ${new Date().toLocaleDateString('sv-SE')}`, 20, 65);
    
    let yPosition = 80;
    
    matches.slice(0, 3).forEach((match, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Consultant header
      pdf.setFontSize(14);
      pdf.text(`${index + 1}. ${match.consultant.name}`, 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Match Score: ${match.score}%`, 20, yPosition);
      
      // Handle rate display safely
      const rateDisplay = match.consultant.rate || 'N/A SEK/h';
      pdf.text(`Rate: ${rateDisplay}`, 100, yPosition);
      yPosition += 8;
      
      pdf.text(`Location: ${match.consultant.location}`, 20, yPosition);
      
      // Handle experience display safely  
      const experienceDisplay = match.consultant.experience || 'N/A years';
      pdf.text(`Experience: ${experienceDisplay}`, 100, yPosition);
      yPosition += 8;
      
      pdf.text(`Skills: ${match.matchedSkills.slice(0, 5).join(', ')}`, 20, yPosition);
      yPosition += 8;
      
      pdf.text(`Cultural Match: ${match.culturalMatch}%`, 20, yPosition);
      pdf.text(`Communication: ${match.communicationMatch}%`, 100, yPosition);
      yPosition += 15;
    });
    
    // Save the PDF
    pdf.save(`matching-results-${assignment.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }, []);

  const exportConsultantListToPDF = useCallback(async (consultants: Consultant[]) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Consultant Database', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`Total Consultants: ${consultants.length}`, 20, 45);
    pdf.text(`Generated: ${new Date().toLocaleDateString('sv-SE')}`, 20, 55);
    
    let yPosition = 70;
    
    consultants.slice(0, 20).forEach((consultant, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${consultant.name}`, 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Email: ${consultant.email}`, 25, yPosition);
      yPosition += 6;
      
      pdf.text(`Skills: ${consultant.skills.slice(0, 6).join(', ')}`, 25, yPosition);
      yPosition += 6;
      
      // Handle rate and location safely
      const rateDisplay = consultant.rate || 'N/A SEK/h';
      pdf.text(`Rate: ${rateDisplay}`, 25, yPosition);
      pdf.text(`Location: ${consultant.location}`, 100, yPosition);
      yPosition += 10;
    });
    
    pdf.save('consultant-database.pdf');
  }, []);

  return {
    exportMatchesToPDF,
    exportConsultantListToPDF
  };
};
