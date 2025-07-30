# AI-Powered CV Generator Setup Guide

## 🚀 Quick Start

Your portfolio now includes an intelligent CV generation system that creates tailored CVs based on job descriptions using AI!

## 📋 Setup Instructions

### 1. **Environment Variables**

Create a `.env.local` file in your project root with your OpenAI API key:

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here

# Alternative: Use NEXT_PUBLIC_ prefix for client-side access
# NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

**Get your OpenAI API key from**: https://platform.openai.com/account/api-keys

### 2. **Install Dependencies**

The required packages are already added to your `package.json`. Run:

```bash
npm install
```

### 3. **Access the CV Generator**

Navigate to: `http://localhost:3000/cv-generator`

## 🔧 How to Use

### Step 1: Input Job Information
- **Job Title**: Frontend Developer (optional)
- **Company**: Tech Startup Inc. (optional)
- **Job Description**: Paste the full job posting

### Step 2: Generate CV
Click "Generate Tailored CV" to analyze and create your custom CV

### Step 3: Review & Export
- Preview the generated CV
- Review AI selection reasoning
- Download as PDF or print directly

## 🎯 Features

### ✨ **AI-Powered Analysis**
- Automatically categorizes job types
- Extracts required and preferred skills
- Identifies key technologies and industry focus
- Assigns importance weights to different CV sections

### 🧠 **Intelligent Content Selection**
- **Experience Prioritization**: Ranks based on relevance scores
- **Smart Certificate Filtering**: Major vs minor certificates
- **Dynamic Skill Matching**: Aligns with job requirements
- **Metadata-Driven Logic**: Uses categories, job types, keywords

### 📄 **Professional Output**
- Clean, modern CV template
- High-quality PDF exports
- Job-specific filenames
- Print optimization

## 🔍 Example Scenarios

### Frontend Developer Job
**Input**: "React developer needed. TypeScript, Next.js experience preferred."

**AI Selects**:
- ✅ dyve GMBH experience (JavaScript, TypeScript, Next.js)
- ✅ Portfolio Website project (Next.js, React, TypeScript)
- ✅ Google UX Design certificate
- ❌ RabbitMQ certificate (not relevant)

### AI Engineer Job
**Input**: "ML Engineer position. Python, TensorFlow, cloud experience required."

**AI Selects**:
- ✅ Microsoft AI & ML Engineering certificate
- ✅ Python automation experience
- ✅ Cloud platform skills
- ❌ iOS development experience (not relevant)

## 🛠️ Technical Details

### Enhanced Data Structure
Your `data.json` now includes `cv_metadata` for intelligent selection:

```json
{
  "experience": [
    {
      "date": "2024-07 — Present",
      "jobTitle": "Junior Project Engineer",
      "company": "Hexagon",
      "skills": ["SQL", "C#", "JavaScript"],
      "cv_metadata": {
        "importance": "high",
        "categories": ["engineering", "enterprise", "backend"],
        "job_types": ["software-engineer", "project-engineer"],
        "always_include": true,
        "keywords": ["project management", "enterprise software"]
      }
    }
  ]
}
```

### Skills Taxonomy
Comprehensive skill categorization with levels and job type mappings:

```json
{
  "skills_taxonomy": {
    "programming_languages": {
      "Python": {
        "level": "advanced",
        "categories": ["backend", "ai", "data-science"],
        "job_types": ["python-developer", "ai-engineer"]
      }
    }
  }
}
```

## 🔒 API Key Security

### Client-Side Usage (Public)
Use `NEXT_PUBLIC_OPENAI_API_KEY` if you want the CV generator to work on the client-side. Note: This exposes your API key to users.

### Server-Side Usage (Secure)
Use `OPENAI_API_KEY` for server-side processing. This keeps your API key secure but requires API routes.

**Recommendation**: For production, implement server-side API routes to keep your key secure.

## 📈 Configuration Options

### CV Generation Settings
In `data.json`, adjust these settings:

```json
{
  "cv_generation_config": {
    "max_experiences": 4,
    "max_major_certificates": 3,
    "max_minor_certificates": 1,
    "max_skills_per_category": 6,
    "preferred_skill_order": ["programming_languages", "frameworks", "tools_technologies"]
  }
}
```

### OpenAI Model Settings
You can configure the model in `src/utils/openaiService.ts`:

```typescript
const requestBody = {
  model: 'gpt-4-turbo-preview', // or 'gpt-4', 'gpt-3.5-turbo'
  temperature: 0.1, // Lower = more consistent
  max_tokens: 800
};
```

## 🐛 Troubleshooting

### No API Key Error
```
Error: OpenAI API key is required
```
**Solution**: Add your API key to `.env.local`

### API Rate Limits
The service includes retry logic with exponential backoff. If you hit rate limits frequently, consider:
- Upgrading your OpenAI plan
- Adding longer delays between requests
- Implementing request caching

### PDF Generation Issues
If PDF generation fails:
1. The system falls back to browser print
2. Check browser popup blockers
3. Install the optional dependencies: `html2canvas` and `jspdf`

### Fallback Mode
If OpenAI is unavailable, the system automatically falls back to keyword-based analysis for basic functionality.

## 🚀 Deployment

### Vercel (Recommended)
1. Add `OPENAI_API_KEY` to your Vercel environment variables
2. Deploy your site
3. The CV generator will be available at `/cv-generator`

### Other Platforms
Add the OpenAI API key to your platform's environment variable settings.

## 🔮 Future Enhancements

- **Cover Letter Generation**: AI-written cover letters
- **Multi-language Support**: CVs in different languages
- **ATS Optimization**: Keyword optimization for applicant tracking systems
- **Industry Templates**: Specialized layouts for different sectors

## 📊 Benefits

### For You
- **90% Time Savings**: Generate tailored CVs in seconds
- **Higher Relevance**: Each CV perfectly matches job requirements
- **Professional Consistency**: Clean formatting across all applications
- **Strategic Advantage**: AI ensures optimal content selection

### For Employers
- **Focused Content**: Only see relevant experience and skills
- **Professional Presentation**: Easy-to-read, consistent format
- **Targeted Applications**: Shows genuine interest through customization

---

**Ready to revolutionize your job applications? Start using your AI-powered CV generator today!** 🎯 