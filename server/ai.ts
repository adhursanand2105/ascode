import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface BugAnalysisResult {
  category: string;
  severity: string;
  possibleCauses: string[];
  suggestedFixes: string[];
  confidence: number;
}

export interface CodeAnalysisResult {
  qualityScore: number;
  issues: Array<{
    type: string;
    severity: string;
    line: number;
    message: string;
    suggestion: string;
  }>;
  suggestions: string[];
  metrics: {
    complexity: number;
    maintainability: number;
    testability: number;
  };
}

export async function analyzeBug(
  title: string,
  description: string,
  stackTrace?: string
): Promise<BugAnalysisResult> {
  try {
    const prompt = `
      As a senior software engineer, analyze the following bug report and provide structured insights:
      
      Title: ${title}
      Description: ${description}
      ${stackTrace ? `Stack Trace: ${stackTrace}` : ''}
      
      Please provide a JSON response with the following structure:
      {
        "category": "string (e.g., 'UI/UX', 'Performance', 'Logic', 'Security', 'Compatibility')",
        "severity": "string (e.g., 'Low', 'Medium', 'High', 'Critical')",
        "possibleCauses": ["array of possible root causes"],
        "suggestedFixes": ["array of specific fix recommendations"],
        "confidence": number (0-1, confidence in the analysis)
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert software engineer specializing in bug analysis and debugging. Provide accurate, actionable insights based on the bug report."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      category: result.category || 'Unknown',
      severity: result.severity || 'Medium',
      possibleCauses: result.possibleCauses || [],
      suggestedFixes: result.suggestedFixes || [],
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error) {
    console.error('Error analyzing bug:', error);
    throw new Error('Failed to analyze bug with AI');
  }
}

export async function analyzeCode(
  code: string,
  language: string,
  filePath: string
): Promise<CodeAnalysisResult> {
  try {
    const prompt = `
      As a senior software engineer, analyze the following ${language} code and provide structured feedback:
      
      File: ${filePath}
      Code:
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Please provide a JSON response with the following structure:
      {
        "qualityScore": number (0-100, overall code quality score),
        "issues": [
          {
            "type": "string (e.g., 'Performance', 'Maintainability', 'Security', 'Best Practices')",
            "severity": "string (e.g., 'Low', 'Medium', 'High')",
            "line": number (line number, 0 if general),
            "message": "string (description of the issue)",
            "suggestion": "string (specific fix recommendation)"
          }
        ],
        "suggestions": ["array of general improvement suggestions"],
        "metrics": {
          "complexity": number (1-10, code complexity score),
          "maintainability": number (1-10, maintainability score),
          "testability": number (1-10, testability score)
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert software engineer specializing in code review and analysis. Provide constructive, actionable feedback to improve code quality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      qualityScore: Math.max(0, Math.min(100, result.qualityScore || 50)),
      issues: result.issues || [],
      suggestions: result.suggestions || [],
      metrics: {
        complexity: Math.max(1, Math.min(10, result.metrics?.complexity || 5)),
        maintainability: Math.max(1, Math.min(10, result.metrics?.maintainability || 5)),
        testability: Math.max(1, Math.min(10, result.metrics?.testability || 5)),
      },
    };
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw new Error('Failed to analyze code with AI');
  }
}

export async function generateCodeSuggestions(
  context: string,
  language: string,
  requirements: string
): Promise<string[]> {
  try {
    const prompt = `
      As a senior software engineer, provide code improvement suggestions based on the following context:
      
      Language: ${language}
      Context: ${context}
      Requirements: ${requirements}
      
      Please provide a JSON response with the following structure:
      {
        "suggestions": ["array of specific, actionable code improvement suggestions"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert software engineer providing code improvement suggestions. Focus on practical, implementable recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.suggestions || [];
  } catch (error) {
    console.error('Error generating code suggestions:', error);
    throw new Error('Failed to generate code suggestions');
  }
}
