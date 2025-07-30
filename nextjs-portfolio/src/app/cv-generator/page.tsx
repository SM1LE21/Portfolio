'use client';

import React, { useState } from 'react';
import CVTemplate from '../../components/CVTemplate';
import CVGenerator from '../../utils/cvGenerator';
import PDFGenerator from '../../utils/pdfGenerator';
import data from '../../data/data.json';
import '../../components/CVTemplate.css';

interface CVContent {
  personal_info: {
    name: string;
    title: string;
    description: string;
  };
  experience: any[];
  certificates: any[];
  education: any[];
  skills: {
    [category: string]: string[];
  };
  metadata: {
    job_analysis: any;
    selection_reasoning: string;
  };
}

const CVGeneratorPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [cvContent, setCvContent] = useState<CVContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Example job descriptions for demo
  const exampleJobs = [
    {
      title: "Frontend Developer",
      company: "Tech Startup",
      description: "We're looking for a skilled Frontend Developer to join our team. You'll work with React, TypeScript, and modern web technologies to build user-facing applications. Experience with Next.js, Tailwind CSS, and responsive design is highly valued."
    },
    {
      title: "AI Engineer", 
      company: "AI Company",
      description: "Seeking an AI Engineer to develop machine learning models and AI-powered applications. Strong background in Python, TensorFlow, PyTorch, and experience with cloud platforms like AWS or Azure. Knowledge of deep learning, natural language processing, and computer vision preferred."
    },
    {
      title: "iOS Developer",
      company: "Mobile App Company", 
      description: "Join our mobile development team as an iOS Developer. You'll create native iOS applications using Swift and SwiftUI. Experience with App Store deployment, Core Data, and modern iOS frameworks is essential."
    }
  ];

  const contactInfo = data.cv_contact_info;
  const languages = data.cv_languages as Array<{
    name: string;
    level: 'native' | 'fluent' | 'proficient' | 'intermediate' | 'basic';
  }>;
  const profileImage = data.cv_profile_image;

  const handleGenerateCV = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // For demo purposes, we'll use the existing data structure
      // In production, you'd enhance data.json with the metadata structure
      const cvGenerator = new CVGenerator(data as any);
      const generatedContent = await cvGenerator.generateTailoredCV(jobDescription);
      setCvContent(generatedContent);
    } catch (err) {
      setError('Failed to generate CV. Please try again.');
      console.error('CV generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cvContent) return;

    setIsGeneratingPDF(true);
    try {
      const jobTitleForFile = jobTitle || cvContent.metadata.job_analysis.job_type;
      const companyForFile = company || 'Application';
      
      await PDFGenerator.downloadTailoredCV(jobTitleForFile, companyForFile);
    } catch (err) {
      setError('Failed to generate PDF. Please try the browser print function.');
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const loadExample = (example: typeof exampleJobs[0]) => {
    setJobDescription(example.description);
    setJobTitle(example.title);
    setCompany(example.company);
  };

  return (
    <div className="cv-generator-page">
      <div className="cv-generator-container">
        <header className="cv-generator-header">
          <h1>AI-Powered CV Generator</h1>
          <p>Generate tailored CVs based on job descriptions using AI</p>
        </header>

        <div className="cv-generator-content">
          <div className="cv-input-section">
            <div className="input-form">
              <h2>Job Information</h2>
              
              <div className="form-group">
                <label htmlFor="job-title">Job Title (Optional)</label>
                <input
                  id="job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company (Optional)</label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Tech Startup Inc."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="job-description">Job Description *</label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="form-textarea"
                />
              </div>

              <div className="example-jobs">
                <h3>Try an Example</h3>
                <div className="example-buttons">
                  {exampleJobs.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(example)}
                      className="example-button"
                    >
                      {example.title} at {example.company}
                    </button>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleGenerateCV}
                  disabled={isGenerating || !jobDescription.trim()}
                  className="generate-button primary"
                >
                  {isGenerating ? 'Generating...' : 'Generate Tailored CV'}
                </button>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>

            {cvContent && (
              <div className="cv-actions">
                <h3>Generated CV Actions</h3>
                <div className="action-buttons">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="download-button"
                  >
                    {isGeneratingPDF ? 'Generating PDF...' : 'Download as PDF'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="print-button"
                  >
                    Print CV
                  </button>
                </div>

                {cvContent.metadata && (
                  <div className="cv-metadata">
                    <h4>Selection Summary</h4>
                    <p>{cvContent.metadata.selection_reasoning}</p>
                    <div className="job-analysis">
                      <p><strong>Detected Job Type:</strong> {cvContent.metadata.job_analysis.job_type}</p>
                      <p><strong>Key Skills:</strong> {cvContent.metadata.job_analysis.required_skills?.join(', ') || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="cv-preview-section">
            {cvContent ? (
              <div className="cv-preview">
                <h2>Generated CV Preview</h2>
                <div className="cv-container">
                  <CVTemplate
                    cvContent={cvContent}
                    contactInfo={contactInfo}
                    languages={languages}
                    profileImage={profileImage}
                  />
                </div>
              </div>
            ) : (
              <div className="cv-placeholder">
                <div className="placeholder-content">
                  <h2>CV Preview</h2>
                                     <p>Enter a job description and click &quot;Generate Tailored CV&quot; to see your customized CV here.</p>
                  <div className="placeholder-features">
                    <h3>Features:</h3>
                    <ul>
                      <li>✨ AI-powered content selection</li>
                      <li>🎯 Job-specific skill matching</li>
                      <li>📄 Professional PDF export</li>
                      <li>🔧 Dynamic experience prioritization</li>
                      <li>🏆 Smart certificate selection</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cv-generator-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .cv-generator-container {
          max-width: 1600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .cv-generator-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }

        .cv-generator-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          font-weight: 700;
        }

        .cv-generator-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
        }

        .cv-generator-content {
          display: grid;
          grid-template-columns: 400px 1fr;
          min-height: calc(100vh - 200px);
        }

        .cv-input-section {
          background: #f8f9fa;
          padding: 30px;
          border-right: 1px solid #e9ecef;
          overflow-y: auto;
        }

        .input-form h2 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 1.5rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .example-jobs {
          margin: 30px 0;
          padding: 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .example-jobs h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 1.1rem;
        }

        .example-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .example-button {
          padding: 10px 15px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          text-align: left;
          transition: all 0.2s;
        }

        .example-button:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .generate-button,
        .download-button,
        .print-button {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .generate-button.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .generate-button.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .download-button {
          background: #28a745;
          color: white;
        }

        .download-button:hover:not(:disabled) {
          background: #218838;
        }

        .print-button {
          background: #6c757d;
          color: white;
        }

        .print-button:hover {
          background: #5a6268;
        }

        .cv-actions {
          margin-top: 30px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .cv-actions h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .cv-metadata {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          font-size: 13px;
        }

        .cv-metadata h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .job-analysis {
          margin-top: 10px;
        }

        .job-analysis p {
          margin: 5px 0;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 6px;
          margin-top: 15px;
          font-size: 14px;
        }

        .cv-preview-section {
          background: white;
          padding: 30px;
          overflow-y: auto;
        }

        .cv-preview h2 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .cv-container {
          display: flex;
          justify-content: center;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .cv-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 400px;
        }

        .placeholder-content {
          text-align: center;
          max-width: 400px;
        }

        .placeholder-content h2 {
          margin: 0 0 15px 0;
          color: #6c757d;
        }

        .placeholder-content p {
          color: #6c757d;
          margin-bottom: 20px;
        }

        .placeholder-features {
          text-align: left;
        }

        .placeholder-features h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .placeholder-features ul {
          color: #6c757d;
          padding-left: 20px;
        }

        .placeholder-features li {
          margin: 5px 0;
        }

        @media (max-width: 1200px) {
          .cv-generator-content {
            grid-template-columns: 1fr;
          }
          
          .cv-input-section {
            border-right: none;
            border-bottom: 1px solid #e9ecef;
          }
        }

        @media print {
          .cv-generator-page {
            background: white;
            padding: 0;
          }
          
          .cv-input-section {
            display: none;
          }
          
          .cv-generator-content {
            grid-template-columns: 1fr;
          }
          
          .cv-preview-section {
            padding: 0;
          }
          
          .cv-container {
            background: white;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CVGeneratorPage; 