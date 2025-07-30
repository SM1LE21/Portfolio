// src/utils/cvGenerator.ts
/**
 * AI-Powered CV Generation System
 * Analyzes job descriptions and creates tailored CVs from portfolio data
 */

interface CVMetadata {
  importance: 'high' | 'medium' | 'low';
  categories: string[];
  job_types: string[];
  always_include: boolean;
  keywords: string[];
  certificate_type?: 'major' | 'minor';
}

interface Experience {
  date: string;
  jobTitle: string;
  company: string;
  company_link?: string;
  description: string;
  skills: string[];
  cv_metadata: CVMetadata;
}

interface Certificate {
  date: string;
  jobTitle: string;
  title_link?: string;
  company: string;
  description: string;
  cv_metadata: CVMetadata;
}

interface SkillItem {
  level: 'beginner' | 'intermediate' | 'advanced';
  categories: string[];
  job_types: string[];
}

interface PortfolioData {
  name: string;
  title: string;
  description: string;
  experience: Experience[];
  certificates: Certificate[];
  education: any[];
  skills_taxonomy: {
    [category: string]: {
      [skill: string]: SkillItem;
    };
  };
  cv_generation_config: {
    max_experiences: number;
    max_major_certificates: number;
    max_minor_certificates: number;
    max_skills_per_category: number;
    preferred_skill_order: string[];
    always_include_categories: string[];
  };
}

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

interface CVContent {
  personal_info: {
    name: string;
    title: string;
    description: string;
  };
  experience: Experience[];
  certificates: Certificate[];
  education: any[];
  skills: {
    [category: string]: string[];
  };
  metadata: {
    job_analysis: JobAnalysis;
    selection_reasoning: string;
  };
}

export class CVGenerator {
  private portfolioData: PortfolioData;

  constructor(portfolioData: PortfolioData) {
    this.portfolioData = portfolioData;
  }

  /**
   * Analyzes a job description using AI and returns structured analysis
   */
  async analyzeJobDescription(jobDescription: string): Promise<JobAnalysis> {
    try {
      // Try to use OpenAI service first
      const { getOpenAIService } = await import('./openaiService');
      const openaiService = getOpenAIService();
      
      return await openaiService.analyzeJobDescription(jobDescription);
    } catch (error) {
      console.warn('OpenAI analysis failed, falling back to mock analysis:', error);
      // Fallback to mock analysis if OpenAI fails
      return this.mockAnalyzeJobDescription(jobDescription);
    }
  }

  /**
   * Mock analysis for demonstration - replace with actual OpenAI call
   */
  private mockAnalyzeJobDescription(jobDescription: string): JobAnalysis {
    // Simple keyword-based analysis for demo
    const text = jobDescription.toLowerCase();
    
    let job_type = 'software-engineer';
    let categories: string[] = ['backend'];
    
    if (text.includes('react') || text.includes('frontend') || text.includes('javascript')) {
      job_type = 'frontend-developer';
      categories = ['frontend', 'web-development'];
    } else if (text.includes('ai') || text.includes('machine learning') || text.includes('ml')) {
      job_type = 'ai-engineer';
      categories = ['ai', 'machine-learning', 'data-science'];
    } else if (text.includes('ios') || text.includes('swift') || text.includes('mobile')) {
      job_type = 'ios-developer';
      categories = ['mobile', 'ios'];
    }

    return {
      job_type,
      required_skills: this.extractSkillsFromText(text, 'required'),
      preferred_skills: this.extractSkillsFromText(text, 'preferred'),
      industry: 'tech',
      experience_level: text.includes('senior') ? 'senior' : text.includes('junior') ? 'junior' : 'mid',
      key_technologies: this.extractTechnologies(text),
      categories,
      importance_weights: {
        technical_skills: 0.4,
        experience: 0.3,
        education: 0.1,
        certificates: 0.2
      }
    };
  }

  /**
   * Generates a tailored CV based on job analysis
   */
  async generateTailoredCV(jobDescription: string): Promise<CVContent> {
    const jobAnalysis = await this.analyzeJobDescription(jobDescription);
    
    // Select experiences based on relevance and customize descriptions
    const selectedExperiences = this.selectExperiences(jobAnalysis).map(exp => ({
      ...exp,
      description: this.customizeExperienceDescription(exp, jobAnalysis)
    }));
    
    // Select certificates based on relevance and customize descriptions
    const selectedCertificates = this.selectCertificates(jobAnalysis).map(cert => ({
      ...cert,
      description: this.customizeCertificateDescription(cert, jobAnalysis)
    }));
    
    // Select skills based on job requirements
    const selectedSkills = this.selectSkills(jobAnalysis);
    
    return {
      personal_info: {
        name: this.portfolioData.name,
        title: this.customizeTitle(jobAnalysis),
        description: this.customizeDescription(jobAnalysis)
      },
      experience: selectedExperiences,
      certificates: selectedCertificates,
      education: this.portfolioData.education,
      skills: selectedSkills,
      metadata: {
        job_analysis: jobAnalysis,
        selection_reasoning: this.generateSelectionReasoning(jobAnalysis, selectedExperiences, selectedCertificates)
      }
    };
  }

  /**
   * Select most relevant experiences for the job
   */
  private selectExperiences(jobAnalysis: JobAnalysis): Experience[] {
    const { max_experiences } = this.portfolioData.cv_generation_config;
    
    // Always include experiences marked as always_include
    const alwaysInclude = this.portfolioData.experience.filter(exp => exp.cv_metadata.always_include);
    
    // Score remaining experiences
    const scored = this.portfolioData.experience
      .filter(exp => !exp.cv_metadata.always_include)
      .map(exp => ({
        experience: exp,
        score: this.scoreExperience(exp, jobAnalysis)
      }))
      .sort((a, b) => b.score - a.score);
    
    // Combine and limit to max_experiences
    const selected = [...alwaysInclude];
    const remaining = max_experiences - selected.length;
    
    if (remaining > 0) {
      selected.push(...scored.slice(0, remaining).map(s => s.experience));
    }
    
    return selected.slice(0, max_experiences);
  }

  /**
   * Score an experience against job requirements
   */
  private scoreExperience(experience: Experience, jobAnalysis: JobAnalysis): number {
    let score = 0;
    
    // Job type match
    if (experience.cv_metadata.job_types.includes(jobAnalysis.job_type)) {
      score += 3;
    }
    
    // Category overlap
    const categoryOverlap = experience.cv_metadata.categories.filter(cat => 
      jobAnalysis.categories.includes(cat)
    ).length;
    score += categoryOverlap * 2;
    
    // Skill overlap
    const skillOverlap = experience.skills.filter(skill => 
      jobAnalysis.required_skills.includes(skill.toLowerCase()) ||
      jobAnalysis.preferred_skills.includes(skill.toLowerCase())
    ).length;
    score += skillOverlap * 1.5;
    
    // Keyword match in description
    const keywordMatches = jobAnalysis.key_technologies.filter(tech =>
      experience.description.toLowerCase().includes(tech.toLowerCase())
    ).length;
    score += keywordMatches;
    
    // Importance bonus
    if (experience.cv_metadata.importance === 'high') score += 2;
    if (experience.cv_metadata.importance === 'medium') score += 1;
    
    return score;
  }

  /**
   * Select relevant certificates
   */
  private selectCertificates(jobAnalysis: JobAnalysis): Certificate[] {
    const { max_major_certificates, max_minor_certificates } = this.portfolioData.cv_generation_config;
    
    // Separate major and minor certificates
    const majorCerts = this.portfolioData.certificates.filter(cert => 
      cert.cv_metadata.certificate_type === 'major'
    );
    const minorCerts = this.portfolioData.certificates.filter(cert => 
      cert.cv_metadata.certificate_type === 'minor'
    );
    
    // Score and select major certificates
    const scoredMajor = majorCerts
      .map(cert => ({
        certificate: cert,
        score: this.scoreCertificate(cert, jobAnalysis)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, max_major_certificates);
    
    // Score and select minor certificates
    const scoredMinor = minorCerts
      .map(cert => ({
        certificate: cert,
        score: this.scoreCertificate(cert, jobAnalysis)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, max_minor_certificates);
    
    return [
      ...scoredMajor.map(s => s.certificate),
      ...scoredMinor.map(s => s.certificate)
    ];
  }

  /**
   * Score a certificate against job requirements
   */
  private scoreCertificate(certificate: Certificate, jobAnalysis: JobAnalysis): number {
    let score = 0;
    
    // Job type match
    if (certificate.cv_metadata.job_types.includes(jobAnalysis.job_type)) {
      score += 3;
    }
    
    // Category overlap
    const categoryOverlap = certificate.cv_metadata.categories.filter(cat => 
      jobAnalysis.categories.includes(cat)
    ).length;
    score += categoryOverlap * 2;
    
    // Importance bonus
    if (certificate.cv_metadata.importance === 'high') score += 2;
    if (certificate.cv_metadata.importance === 'medium') score += 1;
    
    return score;
  }

  /**
   * Select relevant skills for the CV
   */
  private selectSkills(jobAnalysis: JobAnalysis): { [category: string]: string[] } {
    const { max_skills_per_category, preferred_skill_order } = this.portfolioData.cv_generation_config;
    const selectedSkills: { [category: string]: string[] } = {};
    
    // Process each skill category
    for (const category of preferred_skill_order) {
      if (!this.portfolioData.skills_taxonomy[category]) continue;
      
      const categorySkills = this.portfolioData.skills_taxonomy[category];
      
      // Score skills in this category
      const scoredSkills = Object.entries(categorySkills)
        .map(([skill, data]) => ({
          skill,
          score: this.scoreSkill(skill, data, jobAnalysis)
        }))
        .filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, max_skills_per_category);
      
      if (scoredSkills.length > 0) {
        selectedSkills[category] = scoredSkills.map(s => s.skill);
      }
    }
    
    return selectedSkills;
  }

  /**
   * Score a skill against job requirements
   */
  private scoreSkill(skill: string, skillData: SkillItem, jobAnalysis: JobAnalysis): number {
    let score = 0;
    
    // Direct mention in required/preferred skills
    if (jobAnalysis.required_skills.includes(skill.toLowerCase())) {
      score += 5;
    } else if (jobAnalysis.preferred_skills.includes(skill.toLowerCase())) {
      score += 3;
    }
    
    // Job type match
    if (skillData.job_types.includes(jobAnalysis.job_type)) {
      score += 2;
    }
    
    // Category match
    const categoryOverlap = skillData.categories.filter(cat => 
      jobAnalysis.categories.includes(cat)
    ).length;
    score += categoryOverlap;
    
    // Level bonus
    if (skillData.level === 'advanced') score += 1;
    
    return score;
  }

  /**
   * Customize title based on job analysis
   */
  private customizeTitle(jobAnalysis: JobAnalysis): string {
    const titles: { [key: string]: string } = {
      'frontend-developer': 'Frontend Developer | React Specialist',
      'backend-developer': 'Backend Developer | Python & C# Engineer',
      'fullstack-developer': 'Full-Stack Developer | Frontend & Backend Expert',
      'ai-engineer': 'AI/ML Engineer | Python & Cloud Specialist',
      'ios-developer': 'iOS Developer | Swift & Mobile Expert',
      'project-engineer': 'Project Engineer | Software Engineering Lead'
    };
    
    return titles[jobAnalysis.job_type] || this.portfolioData.title;
  }

  /**
   * Customize description based on job analysis
   */
  private customizeDescription(jobAnalysis: JobAnalysis): string {
    // This could be enhanced with AI to generate tailored descriptions
    return this.portfolioData.description;
  }

  /**
   * Customize experience descriptions based on job requirements
   */
  private customizeExperienceDescription(experience: Experience, jobAnalysis: JobAnalysis): string {
    const originalDesc = experience.description;
    
    // Extract key sentences and phrases
    const sentences = originalDesc.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Score each sentence based on relevance to job
    const scoredSentences = sentences.map(sentence => ({
      sentence: sentence.trim(),
      score: this.scoreDescriptionSentence(sentence, experience, jobAnalysis)
    })).sort((a, b) => b.score - a.score);
    
    // Build customized description
    let customizedDesc = '';
    let targetLength = 120; // Target around 120 characters for compact display
    
    // Start with highest scoring sentences
    for (const item of scoredSentences) {
      if (customizedDesc.length + item.sentence.length < targetLength || customizedDesc.length < 60) {
        if (customizedDesc.length > 0) {
          customizedDesc += '. ';
        }
        customizedDesc += item.sentence;
      }
    }
    
    // Ensure we have at least the core information
    if (customizedDesc.length < 40) {
      // Fallback to first sentence if scoring didn't work well
      customizedDesc = sentences[0] || originalDesc;
    }
    
    // Clean up and ensure proper ending
    customizedDesc = customizedDesc.trim();
    if (!customizedDesc.match(/[.!?]$/)) {
      customizedDesc += '.';
    }
    
    return customizedDesc;
  }

  /**
   * Score a sentence from experience description based on job relevance
   */
  private scoreDescriptionSentence(sentence: string, experience: Experience, jobAnalysis: JobAnalysis): number {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    // High priority for sentences mentioning required skills
    jobAnalysis.required_skills.forEach(skill => {
      if (lowerSentence.includes(skill.toLowerCase())) {
        score += 3;
      }
    });
    
    // Medium priority for preferred skills
    jobAnalysis.preferred_skills.forEach(skill => {
      if (lowerSentence.includes(skill.toLowerCase())) {
        score += 2;
      }
    });
    
    // Check for key technologies
    jobAnalysis.key_technologies.forEach(tech => {
      if (lowerSentence.includes(tech.toLowerCase())) {
        score += 2;
      }
    });
    
    // Check for job type related keywords
    const jobTypeKeywords = this.getJobTypeKeywords(jobAnalysis.job_type);
    jobTypeKeywords.forEach(keyword => {
      if (lowerSentence.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    
    // Check for experience metadata keywords
    experience.cv_metadata.keywords.forEach(keyword => {
      if (lowerSentence.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    
    // Bonus for sentences that mention specific achievements or results
    const achievementWords = ['developed', 'built', 'implemented', 'created', 'improved', 'led', 'managed', 'designed', 'optimized'];
    achievementWords.forEach(word => {
      if (lowerSentence.includes(word)) {
        score += 1;
      }
    });
    
    return score;
  }

  /**
   * Get keywords associated with specific job types
   */
  private getJobTypeKeywords(jobType: string): string[] {
    const keywordMap: { [key: string]: string[] } = {
      'frontend-developer': ['frontend', 'ui', 'user interface', 'react', 'angular', 'vue', 'javascript', 'css', 'html', 'responsive', 'web'],
      'backend-developer': ['backend', 'server', 'api', 'database', 'microservices', 'cloud', 'python', 'java', 'c#', 'sql'],
      'fullstack-developer': ['fullstack', 'full-stack', 'frontend', 'backend', 'web development', 'applications'],
      'ai-engineer': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'data', 'models', 'algorithms', 'python', 'tensorflow'],
      'ios-developer': ['ios', 'mobile', 'swift', 'app store', 'iphone', 'ipad', 'native'],
      'project-engineer': ['project', 'engineering', 'management', 'planning', 'implementation', 'coordination'],
      'data-scientist': ['data', 'analysis', 'statistics', 'insights', 'visualization', 'python', 'r'],
      'devops-engineer': ['devops', 'deployment', 'infrastructure', 'automation', 'ci/cd', 'docker', 'kubernetes'],
    };
    
    return keywordMap[jobType] || [];
  }

  /**
   * Customize certificate descriptions based on job requirements
   */
  private customizeCertificateDescription(certificate: Certificate, jobAnalysis: JobAnalysis): string {
    const originalDesc = certificate.description;
    
    // Extract key information from original description
    const keyInfo = this.extractCertificateKeyInfo(originalDesc);
    
    // Create role-specific highlights
    const roleHighlights = this.getRoleSpecificHighlights(certificate, jobAnalysis);
    
    // Build compact, relevant description
    let customizedDesc = '';
    
    if (roleHighlights.length > 0) {
      customizedDesc += `Focused on ${roleHighlights.join(', ')}. `;
    }
    
    if (keyInfo.duration) {
      customizedDesc += `${keyInfo.duration}. `;
    }
    
    if (keyInfo.provider && keyInfo.provider !== certificate.company) {
      customizedDesc += `Issued by ${keyInfo.provider}.`;
    }
    
    // Fallback to original if customization is too short
    return customizedDesc.trim() || originalDesc;
  }

  /**
   * Extract key information from certificate description
   */
  private extractCertificateKeyInfo(description: string): {
    duration?: string;
    provider?: string;
    technologies?: string[];
  } {
    const info: any = {};
    
    // Extract duration patterns
    const durationMatch = description.match(/(\d+\s*(?:months?|weeks?|hours?))/i);
    if (durationMatch) {
      info.duration = durationMatch[1];
    }
    
    // Extract technology mentions
    const techKeywords = ['Python', 'React', 'JavaScript', 'TypeScript', 'AWS', 'Azure', 'AI', 'ML', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Swift', 'iOS', 'Android', 'SQL', 'C#', 'Angular', 'Vue', 'Node.js', 'Docker', 'Kubernetes'];
    const foundTech = techKeywords.filter(tech => 
      description.toLowerCase().includes(tech.toLowerCase())
    );
    if (foundTech.length > 0) {
      info.technologies = foundTech;
    }
    
    return info;
  }

  /**
   * Get role-specific highlights for certificate
   */
  private getRoleSpecificHighlights(certificate: Certificate, jobAnalysis: JobAnalysis): string[] {
    const highlights: string[] = [];
    
    // Match certificate categories with job requirements
    const categoryMatches = certificate.cv_metadata.categories.filter(cat => 
      jobAnalysis.categories.includes(cat)
    );
    
    // Map categories to human-readable highlights
    const categoryMap: { [key: string]: string } = {
      'ai': 'artificial intelligence and machine learning',
      'machine-learning': 'machine learning algorithms and models',
      'data-science': 'data analysis and statistical modeling',
      'frontend': 'frontend development and user interfaces',
      'backend': 'backend systems and server-side development',
      'fullstack': 'full-stack web development',
      'mobile': 'mobile application development',
      'cloud': 'cloud computing and infrastructure',
      'databases': 'database design and management',
      'devops': 'DevOps practices and automation',
      'security': 'cybersecurity and secure development',
      'enterprise': 'enterprise software development',
      'ecommerce': 'e-commerce platforms and solutions'
    };
    
    categoryMatches.forEach(cat => {
      if (categoryMap[cat]) {
        highlights.push(categoryMap[cat]);
      }
    });
    
    // Add technology-specific highlights
    if (jobAnalysis.key_technologies.length > 0) {
      const techMatches = certificate.cv_metadata.keywords.filter(keyword =>
        jobAnalysis.key_technologies.some(tech => 
          keyword.toLowerCase().includes(tech.toLowerCase())
        )
      );
      
      if (techMatches.length > 0) {
        highlights.push(`${techMatches.slice(0, 2).join(', ')} technologies`);
      }
    }
    
    return highlights.slice(0, 3); // Limit to 3 highlights
  }

  /**
   * Generate reasoning for selections made
   */
  private generateSelectionReasoning(
    jobAnalysis: JobAnalysis, 
    experiences: Experience[], 
    certificates: Certificate[]
  ): string {
    return `CV tailored for ${jobAnalysis.job_type} role. Selected ${experiences.length} most relevant experiences and ${certificates.length} certificates based on technical requirements: ${jobAnalysis.required_skills.join(', ')}.`;
  }

  // Helper methods
  private extractSkillsFromText(text: string, type: 'required' | 'preferred'): string[] {
    // Simple extraction - could be enhanced with NLP
    const skills = ['javascript', 'typescript', 'react', 'python', 'swift', 'c#', 'sql'];
    return skills.filter(skill => text.includes(skill));
  }

  private extractTechnologies(text: string): string[] {
    const technologies = ['react', 'next.js', 'python', 'swift', 'c#', 'sql', 'docker', 'aws', 'azure'];
    return technologies.filter(tech => text.includes(tech));
  }
}

export default CVGenerator; 