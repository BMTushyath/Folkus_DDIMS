
import React, { useState } from 'react';
import { analyzeWithGemini, translateText } from '../services/geminiService';
import { SparklesIcon, ExclamationTriangleIcon } from './IconComponents';

interface AnalysisResult {
  riskLevel: string;
  summary: string;
  analysis: string;
  recommendation: string;
}

const parseAnalysis = (text: string): AnalysisResult => {
    const getSectionContent = (startTag: string, endTag: string | null, text: string): string => {
        const startIndex = text.toLowerCase().indexOf(startTag.toLowerCase());
        if (startIndex === -1) return '';
        
        const contentStartIndex = startIndex + startTag.length;
        let endIndex;
        if (endTag) {
            endIndex = text.toLowerCase().indexOf(endTag.toLowerCase(), contentStartIndex);
            if (endIndex === -1) endIndex = text.length;
        } else {
            endIndex = text.length;
        }
        
        return text.substring(contentStartIndex, endIndex).trim();
    };

    const riskLevel = getSectionContent('Risk Level:', 'Summary:', text);
    const summary = getSectionContent('Summary:', 'Analysis:', text);
    const analysis = getSectionContent('Analysis:', 'Recommendation:', text);
    const recommendation = getSectionContent('Recommendation:', null, text);

    return {
        riskLevel: riskLevel || 'UNKNOWN',
        summary: summary || 'No summary provided.',
        analysis: analysis || 'No analysis provided.',
        recommendation: recommendation || 'No recommendation provided.',
    };
};


const RiskWarningBanner: React.FC<{ riskLevel: string }> = ({ riskLevel }) => {
  const upperCaseRisk = riskLevel.toUpperCase();
  const isHighRisk = upperCaseRisk.includes('CRITICAL') || upperCaseRisk.includes('HIGH');
  if (!isHighRisk) return null;

  const riskStyles: Record<string, {bg: string, border: string, text: string, icon: string}> = {
    'CRITICAL': { bg: 'bg-red-900/50', border: 'border-red-500', text: 'text-red-300', icon: 'text-red-400' },
    'HIGH': { bg: 'bg-orange-900/50', border: 'border-orange-500', text: 'text-orange-300', icon: 'text-orange-400' },
  };
  
  const currentRisk = upperCaseRisk.includes('CRITICAL') ? 'CRITICAL' : 'HIGH';
  const styles = riskStyles[currentRisk];

  return (
    <div className={`mt-8 p-4 border-l-4 ${styles.border} ${styles.bg} rounded-r-lg flex items-start`} role="alert">
      <ExclamationTriangleIcon className={`w-8 h-8 mr-4 flex-shrink-0 ${styles.icon}`} />
      <div>
        <h3 className={`text-lg font-bold text-text-primary`}>Potential Threat Detected: {riskLevel}</h3>
        <p className={`mt-1 text-sm ${styles.text}`}>
          Our AI analysis has identified a significant security risk. Please review the details below carefully and follow the recommendations to protect your identity.
        </p>
      </div>
    </div>
  );
};


export const SecurityAudit: React.FC = () => {
  const [query, setQuery] = useState('');
  const [originalResult, setOriginalResult] = useState<AnalysisResult | null>(null);
  const [displayResult, setDisplayResult] = useState<AnalysisResult | null>(null);
  const [originalReportText, setOriginalReportText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');

  const handleAudit = async () => {
    if (!query.trim()) {
      setError('Please describe a credential or transaction to audit.');
      return;
    }
    setError('');
    setIsLoading(true);
    setOriginalResult(null);
    setDisplayResult(null);
    setOriginalReportText('');
    setTargetLanguage('en');

    try {
      const analysisText = await analyzeWithGemini(query);
      const analysisResult = parseAnalysis(analysisText);
      setOriginalResult(analysisResult);
      setDisplayResult(analysisResult);
      setOriginalReportText(analysisText);
    } catch (err) {
      setError('Failed to get analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setTargetLanguage(lang);

    if (lang === 'en') {
      setDisplayResult(originalResult);
      return;
    }

    if (!originalReportText) return;

    setIsTranslating(true);
    setError('');
    try {
      const translatedText = await translateText(originalReportText, lang);
      const translatedResult = parseAnalysis(translatedText);
      setDisplayResult(translatedResult);
    } catch (err) {
      setError('Failed to translate the report. Please try again.');
      console.error(err);
      setTargetLanguage('en'); // Revert on failure
    } finally {
      setIsTranslating(false);
    }
  };

  const result = displayResult;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">AI Security Audit</h2>
      <p className="text-text-secondary mb-6">
        Describe a credential, transaction, or a message you've received. Our AI-powered expert will analyze it for potential security risks, privacy leaks, or phishing attempts.
      </p>

      <div className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'Received an email asking me to verify my identity by sharing my passport details on a website...'"
          className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
          disabled={isLoading}
        />
        <button
          onClick={handleAudit}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Analyze with AI
            </>
          )}
        </button>
      </div>
      {error && <p className="text-red-400 mt-4">{error}</p>}
      
      {result && (
        <>
          <RiskWarningBanner riskLevel={result.riskLevel} />
          <div className="mt-6 p-6 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Analysis Report</h3>
                <div>
                  <label htmlFor="language-select" className="sr-only">Translate Report</label>
                  <select
                    id="language-select"
                    value={isTranslating ? 'translating' : targetLanguage}
                    onChange={handleTranslate}
                    disabled={isTranslating}
                    className="bg-gray-900 border border-gray-700 rounded-md shadow-sm py-1.5 px-3 text-text-secondary focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-colors disabled:opacity-70"
                  >
                    {isTranslating ? (
                      <option value="translating">Translating...</option>
                    ) : (
                      <>
                        <option value="en">English (Original)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                        <option value="kn">Kannada</option>
                        <option value="te">Telugu</option>
                        <option value="hi">Hindi</option>
                        <option value="bho">Bhojpuri</option>
                        <option value="mr">Marathi</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className={`space-y-5 transition-opacity duration-300 ${isTranslating ? 'opacity-50' : 'opacity-100'}`}>
                  <div>
                      <h4 className="font-bold text-brand-light">Risk Level</h4>
                      <p className="text-text-secondary">{result.riskLevel}</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-brand-light">Summary</h4>
                      <p className="text-text-secondary">{result.summary}</p>
                  </div>
                  <div>
                      <h4 className="font-bold text-brand-light">Analysis</h4>
                      <ul className="list-disc list-inside text-text-secondary space-y-1 pl-1">
                          {result.analysis.split('\n').map((item, index) => {
                            const trimmedItem = item.trim();
                            if (!trimmedItem) return null;
                            const cleanItem = trimmedItem.replace(/^[\s*-]\s*/, '');
                            return <li key={index}>{cleanItem}</li>;
                          })}
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-brand-light">Recommendation</h4>
                      <p className="text-text-secondary whitespace-pre-wrap">{result.recommendation}</p>
                  </div>
              </div>
          </div>
        </>
      )}
    </div>
  );
};