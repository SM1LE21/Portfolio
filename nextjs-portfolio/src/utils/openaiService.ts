// src/utils/openaiService.ts
/**
 * OpenAI Service for CV Generation
 * Handles job description analysis using GPT-4
 */

interface JobAnalysis {
  job_type: string;
  required_skills: string[];
  preferred_skills: string[];
  industry: string;
  experience_level: string;
  key_technologies: string[];
  categories: string[];
  importance_weights: {
    technical_skills: number;
    experience: number;
    education: number;
    certificates: number;
  };
}

export class OpenAIService {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set OPENAI_API_KEY environment variable.');
    }
  }

  /**
   * Analyze job description using OpenAI GPT-4
   */
  async analyzeJobDescription(jobDescription: string): Promise<JobAnalysis> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY environment variable.');
    }

    const prompt = this.createAnalysisPrompt(jobDescription);

    try {
      const response = await this.callOpenAI(prompt);
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze job description. Please try again.');
    }
  }

  /**
   * Create structured prompt for job analysis
   */
  private createAnalysisPrompt(jobDescription: string): string {
    return `You are an expert AI system that analyzes job descriptions for CV matching. Analyze the following job description and extract key information in the exact JSON format specified below.

Job Description:
"${jobDescription}"

Extract the following information and respond with ONLY a valid JSON object (no additional text):

{
  "job_type": "primary job role (choose from: frontend-developer, backend-developer, fullstack-developer, ai-engineer, ml-engineer, data-scientist, ios-developer, mobile-developer, android-developer, devops-engineer, system-architect, project-engineer, software-engineer, web-developer, ui-designer, ux-designer, product-designer, embedded-developer, c#-developer, python-developer, javascript-developer, typescript-developer, react-developer, angular-developer, vue-developer, java-developer, php-developer, ruby-developer, go-developer, rust-developer, swift-developer, kotlin-developer, data-analyst, database-developer, cloud-engineer, security-engineer, qa-engineer, test-engineer, technical-support, customer-support, it-support, automation-engineer, chatbot-developer, api-developer, microservices-developer, ecommerce-developer, shopify-developer, wordpress-developer, game-developer, blockchain-developer, cybersecurity-specialist, network-engineer, systems-engineer, firmware-developer, hardware-engineer, technical-writer, product-manager, scrum-master, agile-coach)",
  "required_skills": ["array of must-have technical skills mentioned in the job posting"],
  "preferred_skills": ["array of nice-to-have skills or preferred technologies"],
  "industry": "industry sector (e.g., fintech, healthcare, ecommerce, enterprise, startup, consulting, gaming, education, government, automotive, aerospace, telecommunications, media, entertainment, non-profit, retail, manufacturing, energy, real-estate, travel, sports, fashion, food, agriculture, logistics, transportation, insurance, banking, legal, marketing, advertising, hr, recruiting, sales, customer-service, other)",
  "experience_level": "junior, mid, senior, lead, principal, or director",
  "key_technologies": ["most important technologies, frameworks, and tools mentioned"],
  "categories": ["relevant categories from: frontend, backend, fullstack, mobile, ios, android, web-development, ai, machine-learning, data-science, devops, cloud, databases, embedded, systems, low-level, enterprise, startup, ecommerce, design, ux, ui, user-research, automation, testing, qa, security, networking, hardware, firmware, blockchain, gaming, data-visualization, api-development, microservices, messaging, architecture, programming, oop, version-control, deployment, integration, support, customer-service, troubleshooting, project-management, agile, scrum, documentation, technical-writing, product-management, marketing, sales, hr, recruiting, consulting, training, research, analytics, business-intelligence, finance, accounting, legal, compliance, operations, logistics, supply-chain, manufacturing, engineering, science, mathematics, statistics, physics, chemistry, biology, medicine, healthcare, pharmaceuticals, biotechnology, agriculture, environmental, energy, utilities, construction, real-estate, transportation, automotive, aerospace, defense, government, education, non-profit, media, entertainment, sports, fashion, food, travel, hospitality, retail, wholesale, import-export, other"],
  "importance_weights": {
    "technical_skills": 0.4,
    "experience": 0.3,
    "education": 0.1,
    "certificates": 0.2
  }
}

Instructions:
1. Focus on extracting technical requirements and categorizing the role type accurately
2. Be specific with skills - extract actual technology names, not generic terms
3. Choose the most specific job_type that matches the role
4. Select 2-4 most relevant categories that best describe the role
5. Set importance_weights based on what the job description emphasizes most
6. If the job description is unclear or too generic, make reasonable inferences based on the role title and company context
7. Respond with ONLY the JSON object, no additional text or formatting`;
  }

  /**
   * Call OpenAI API with retry logic
   */
  private async callOpenAI(prompt: string, retries: number = 3): Promise<string> {
    const requestBody = {
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user' as const,
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 800,
      response_format: { type: 'json_object' as const }
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`OpenAI API error (${response.status}): ${errorData}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from OpenAI API');
        }

        return data.choices[0].message.content;
      } catch (error) {
        console.error(`OpenAI API attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Failed to get response from OpenAI after all retries');
  }

  /**
   * Parse and validate OpenAI response
   */
  private parseAnalysisResponse(response: string): JobAnalysis {
    try {
      const parsed = JSON.parse(response);
      
      // Validate required fields
      const requiredFields = [
        'job_type', 'required_skills', 'preferred_skills', 
        'industry', 'experience_level', 'key_technologies', 
        'categories', 'importance_weights'
      ];
      
      for (const field of requiredFields) {
        if (!(field in parsed)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate arrays
      if (!Array.isArray(parsed.required_skills)) parsed.required_skills = [];
      if (!Array.isArray(parsed.preferred_skills)) parsed.preferred_skills = [];
      if (!Array.isArray(parsed.key_technologies)) parsed.key_technologies = [];
      if (!Array.isArray(parsed.categories)) parsed.categories = [];

      // Validate importance weights
      if (!parsed.importance_weights || typeof parsed.importance_weights !== 'object') {
        parsed.importance_weights = {
          technical_skills: 0.4,
          experience: 0.3,
          education: 0.1,
          certificates: 0.2
        };
      }

      // Normalize weights to sum to 1
      const totalWeight = Object.values(parsed.importance_weights).reduce((sum: number, weight: any) => sum + (Number(weight) || 0), 0);
      if (totalWeight > 0) {
        Object.keys(parsed.importance_weights).forEach(key => {
          parsed.importance_weights[key] = (Number(parsed.importance_weights[key]) || 0) / totalWeight;
        });
      }

      return parsed as JobAnalysis;
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.error('Raw response:', response);
      
      // Return fallback analysis
      return this.createFallbackAnalysis();
    }
  }

  /**
   * Create fallback analysis when OpenAI parsing fails
   */
  private createFallbackAnalysis(): JobAnalysis {
    return {
      job_type: 'software-engineer',
      required_skills: [],
      preferred_skills: [],
      industry: 'tech',
      experience_level: 'mid',
      key_technologies: [],
      categories: ['software-development'],
      importance_weights: {
        technical_skills: 0.4,
        experience: 0.3,
        education: 0.1,
        certificates: 0.2
      }
    };
  }

  /**
   * Test the OpenAI connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const testPrompt = 'Respond with "OK" if you can understand this message.';
      await this.callOpenAI(testPrompt);
      return true;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models (for debugging)
   */
  async getAvailableModels(): Promise<string[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.map((model: any) => model.id).filter((id: string) => id.includes('gpt'));
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }
}

// Create singleton instance
let openaiService: OpenAIService | null = null;

export const getOpenAIService = (apiKey?: string): OpenAIService => {
  if (!openaiService) {
    openaiService = new OpenAIService(apiKey);
  }
  return openaiService;
};

export default OpenAIService; 