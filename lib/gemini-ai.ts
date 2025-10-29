import { rewriteForSimplicity } from './chrome-rewriter';

const GEMINI_API_KEY = "AIzaSyBhenKndqe8PQXljU2d7rqguS316k2rID0";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function generateGeminiResponse(message: string, context?: string, userIssues?: any[]): Promise<string> {
  try {
    // Check if user is a service provider based on context
    const isServiceProvider = context?.includes('service_provider') || context?.includes('analytics');
    
    if (isServiceProvider) {
      // Service provider analytics-focused responses
      const analyticsKeywords = [
        'analytics', 'data', 'trends', 'reports', 'insights', 'metrics', 'dashboard',
        'manufacturing', 'defects', 'quality', 'issues', 'statistics', 'analysis',
        'performance', 'resolution', 'severity', 'category', 'model', 'vehicle',
        'export', 'chart', 'graph', 'visualization', 'kpi', 'benchmark'
      ];
      
      const isAnalyticsRelated = analyticsKeywords.some(keyword => 
        message.toLowerCase().includes(keyword)
      );
      
      if (!isAnalyticsRelated) {
        return "I'm specialized in helping with analytics data interpretation, trend analysis, and business insights for vehicle service operations. Please ask me about data trends, manufacturing insights, quality metrics, or report generation.";
      }
      
      const prompt = `
You are an expert analytics AI assistant for automotive service providers. You specialize in:
- Data interpretation and trend analysis
- Manufacturing defect insights
- Quality metrics evaluation
- Business intelligence recommendations
- Report generation guidance
- Performance benchmarking
- Strategic decision support

IMPORTANT: Focus only on analytics, data interpretation, and business insights related to automotive service operations.

${context ? `Context: ${context}` : ''}

User message: ${message}

Provide analytical insights, data interpretation, and strategic recommendations based on automotive service data.`;

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 20,
            topP: 0.8,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue processing your analytics request. Please try again.';
      
      // Simplify the response using Chrome Rewriter API
      const simplifiedResponse = await rewriteForSimplicity(aiResponse);
      return simplifiedResponse;
    }
    
    // Vehicle owner responses (existing logic)
    const vehicleKeywords = [
      'car', 'vehicle', 'engine', 'brake', 'tire', 'oil', 'battery', 'transmission', 'suspension',
      'steering', 'clutch', 'gear', 'fuel', 'exhaust', 'radiator', 'alternator', 'starter',
      'maintenance', 'service', 'repair', 'problem', 'issue', 'noise', 'vibration', 'leak',
      'warning', 'light', 'dashboard', 'ac', 'heating', 'cooling', 'carsor', 'motor', 'automotive',
      'mileage', 'performance', 'acceleration', 'speed', 'rpm', 'temperature', 'pressure',
      'filter', 'spark plug', 'belt', 'hose', 'fluid', 'coolant', 'antifreeze', 'windshield',
      'headlight', 'taillight', 'turn signal', 'horn', 'mirror', 'seat', 'door', 'window',
      'lock', 'key', 'remote', 'alarm', 'security', 'insurance', 'registration', 'license'
    ];

    const isVehicleRelated = vehicleKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (!isVehicleRelated) {
      return "I'm specialized in helping with vehicle-related questions and issues. Please ask me about car maintenance, troubleshooting, repairs, or any automotive concerns you might have.";
    }

    let issuesContext = '';
    if (userIssues && userIssues.length > 0) {
      issuesContext = `\n\nUser's Previous Issues:\n${userIssues.map(issue => 
        `- ${issue.description} (${issue.category}, ${issue.severity} severity, Status: ${issue.status})`
      ).join('\n')}`;
    }

    const prompt = `
- Vehicle maintenance and troubleshooting
- Repair guidance and cost estimates
- Service schedules and warranty information
- Automotive technical support
- Analysis of vehicle issues and symptoms

IMPORTANT: Only respond to vehicle and automotive-related questions. Politely decline non-automotive questions.

${context ? `Context: ${context}` : ''}${issuesContext}

User message: ${message}

Provide helpful, accurate automotive guidance. If the user is asking about their previous issues, reference them appropriately.`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I encountered an issue processing your request. Please try again.';
    
    // Simplify the response using Chrome Rewriter API
    const simplifiedResponse = await rewriteForSimplicity(aiResponse);
    return simplifiedResponse;
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'I\'m currently experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.';
  }
}

export async function analyzeVehicleIssue(description: string, vehicleModel: string): Promise<{
  formattedIssue: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  suggestedActions: string[];
  possibleCauses: string[];
  urgencyLevel: string;
  estimatedCost: string;
}> {
  try {
    const prompt = `
You are an expert automotive diagnostic AI specialist. Analyze the following vehicle issue:

Vehicle Model: ${vehicleModel}
Issue Description: ${description}

Please provide a comprehensive analysis in the following JSON format:
{
  "formattedIssue": "A clear, professional description of the issue",
  "category": "One of: Engine, Brakes, Electrical, AC/Heating, Suspension, Transmission, Body, Fuel System, Exhaust, Steering",
  "severity": "low, medium, or high based on safety and urgency",
  "suggestedActions": ["Array of 3-5 specific recommended actions"],
  "possibleCauses": ["Array of 3-4 most likely causes"],
  "urgencyLevel": "Immediate, Within 1 week, Within 1 month, or Routine maintenance",
  "estimatedCost": "Rough cost estimate range in INR"
}

Consider:
- Safety implications
- Vehicle-specific common issues
- Severity based on potential damage or safety risk
- Practical repair recommendations
- Cost-effective solutions

Respond only with valid JSON.`;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Simplify the AI response using Chrome Rewriter API
    const simplifiedFormattedIssue = await rewriteForSimplicity(analysis.formattedIssue || `${vehicleModel} - ${description}`);
    const simplifiedActions = Array.isArray(analysis.suggestedActions) 
      ? await Promise.all(analysis.suggestedActions.map((action: string) => rewriteForSimplicity(action)))
      : await Promise.all([
          'Schedule inspection with authorized service center',
          'Document any unusual sounds or behaviors',
          'Check warranty coverage for this issue'
        ].map(action => rewriteForSimplicity(action)));
    
    const simplifiedCauses = Array.isArray(analysis.possibleCauses)
      ? await Promise.all(analysis.possibleCauses.map((cause: string) => rewriteForSimplicity(cause)))
      : await Promise.all([
          'Normal wear and tear',
          'Component malfunction',
          'Maintenance required'
        ].map(cause => rewriteForSimplicity(cause)));

    return {
      formattedIssue: simplifiedFormattedIssue,
      category: analysis.category || 'General',
      severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'medium',
      suggestedActions: simplifiedActions,
      possibleCauses: simplifiedCauses,
      urgencyLevel: analysis.urgencyLevel || 'Within 1 week',
      estimatedCost: analysis.estimatedCost || 'Contact service center for estimate'
    };

  } catch (error) {
    console.error('AI analysis error:', error);

    const severity = description.toLowerCase().includes('brake') || 
                     description.toLowerCase().includes('steering') ||
                     description.toLowerCase().includes('engine') ? 'high' : 'medium';

    return {
      formattedIssue: `${vehicleModel} - ${description}`,
      category: 'General',
      severity,
      suggestedActions: [
        'Schedule inspection with authorized service center',
        'Document any unusual sounds or behaviors',
        'Check warranty coverage for this issue',
        'Avoid heavy driving until resolved'
      ],
      possibleCauses: [
        'Component wear and tear',
        'Maintenance requirement',
        'System malfunction'
      ],
      urgencyLevel: severity === 'high' ? 'Immediate' : 'Within 1 week',
      estimatedCost: 'Contact service center for estimate'
    };
  }
}
