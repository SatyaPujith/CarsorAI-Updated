import { analyzeVehicleIssue } from './gemini-ai';
import { rewriteForSimplicity } from './chrome-rewriter';

export async function analyzeImageWithAI(imageFile: File, vehicleModel: string): Promise<{
  description: string;
  formattedIssue: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  suggestedActions: string[];
  possibleCauses: string[];
  urgencyLevel: string;
  estimatedCost: string;
}> {
  try {
    console.log('Starting image analysis for:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
    
    // Validate image file
    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please upload an image file.');
    }
    
    // Check file size (limit to 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error('Image file too large. Please upload an image smaller than 10MB.');
    }
    
    // Convert image to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(imageFile);
    });
    
    console.log('Image converted to base64, length:', base64Image.length);

    const GEMINI_API_KEY = "AIzaSyAthgw4AxjXxY-VBOOlcOOvCe1NUR27jD0";

    const prompt = `Analyze this vehicle image and respond with ONLY valid JSON in this exact format:

{
  "description": "What you see in the image",
  "formattedIssue": "${vehicleModel} - Brief issue description",
  "category": "Body",
  "severity": "medium",
  "suggestedActions": ["Get professional inspection", "Document damage", "Check insurance coverage"],
  "possibleCauses": ["Impact damage", "Collision", "Accident"],
  "urgencyLevel": "Within 1 week",
  "estimatedCost": "₹15,000 - ₹50,000"
}

Vehicle: ${vehicleModel}
Analyze the damage and provide realistic repair estimates in Indian Rupees.`;

    console.log('Making API call to Gemini...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API Response Data:', data);
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      console.error('No AI response found in:', data);
      throw new Error('No response from Gemini API');
    }

    console.log('AI Response Text:', aiResponse);

    // Parse JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in AI response. Full response:', aiResponse);
      throw new Error('Invalid JSON response from AI');
    }

    let analysis;
    try {
      analysis = JSON.parse(jsonMatch[0]);
      console.log('Successfully parsed analysis:', analysis);
    } catch (parseError) {
      console.error('Failed to parse JSON:', jsonMatch[0]);
      throw new Error('Failed to parse AI response JSON');
    }
    
    // Only apply Chrome Rewriter to descriptive text fields if they exist from AI
    // Temporarily disable Chrome Rewriter to ensure AI analysis works first
    const description = analysis.description || 'Image analysis completed';
    const formattedIssue = analysis.formattedIssue || `${vehicleModel} - Issue identified from image`;
    
    // Validate and ensure proper format
    return {
      description: description,
      formattedIssue: formattedIssue,
      category: analysis.category || 'General',
      severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'medium',
      suggestedActions: Array.isArray(analysis.suggestedActions) ? analysis.suggestedActions : [
        'Schedule inspection with authorized service center',
        'Document the issue with photos',
        'Check warranty coverage for this issue'
      ],
      possibleCauses: Array.isArray(analysis.possibleCauses) ? analysis.possibleCauses : [
        'Component wear and tear',
        'Maintenance requirement',
        'System malfunction'
      ],
      urgencyLevel: analysis.urgencyLevel || 'Within 1 week',
      estimatedCost: analysis.estimatedCost || 'Contact service center for estimate'
    };

  } catch (error) {
    console.error('Image analysis error:', error);
    
    // Enhanced fallback analysis based on common vehicle issues
    return {
      description: 'Image uploaded successfully. Professional analysis recommended for accurate diagnosis.',
      formattedIssue: `${vehicleModel} - Vehicle issue reported with visual evidence`,
      category: 'Body',
      severity: 'medium',
      suggestedActions: [
        'Visit authorized service center for detailed inspection',
        'Show this image to a qualified automotive technician',
        'Get written estimate for repair costs',
        'Check if issue is covered under warranty',
        'Document any additional symptoms or sounds'
      ],
      possibleCauses: [
        'Physical damage or wear',
        'Component malfunction',
        'Normal wear and tear',
        'Environmental factors'
      ],
      urgencyLevel: 'Within 1 week',
      estimatedCost: '₹5,000 - ₹25,000 (varies based on specific issue and parts required)'
    };
  }
}

export async function processVoiceToText(audioBlob: Blob): Promise<string> {
  // Mock voice processing - in production, integrate with speech-to-text API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTranscriptions = [
        "My car's engine is making a strange rattling noise when I start it in the morning",
        "The brake pedal feels spongy and the car takes longer to stop than usual",
        "AC is not cooling properly and making weird sounds",
        "Strange vibration in steering wheel at high speeds",
        "Engine light came on yesterday and the car feels sluggish"
      ];
      const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      resolve(randomText);
    }, 2000);
  });
}

export async function formatIssueWithAI(text: string, vehicleModel: string): Promise<{
  formattedIssue: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  suggestedActions: string[];
  possibleCauses: string[];
  urgencyLevel: string;
  estimatedCost: string;
}> {
  try {
    // Use Gemini AI for comprehensive issue analysis
    const analysis = await analyzeVehicleIssue(text, vehicleModel);
    return analysis;
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Fallback analysis
    const severity = text.toLowerCase().includes('brake') || 
                    text.toLowerCase().includes('steering') ||
                    text.toLowerCase().includes('engine') ? 'high' : 'medium';
    
    return {
      formattedIssue: `${vehicleModel} - ${text.charAt(0).toUpperCase() + text.slice(1)}`,
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