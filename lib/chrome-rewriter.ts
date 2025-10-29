// Chrome Rewriter API integration for simplifying AI responses
export async function simplifyTextWithChromeRewriter(text: string): Promise<string> {
  try {
    // Check if Chrome Rewriter API is available
    if (typeof window !== 'undefined' && 'ai' in window && 'rewriter' in (window as any).ai) {
      const rewriter = await (window as any).ai.rewriter.create({
        tone: 'casual',
        format: 'plain-text',
        length: 'shorter'
      });

      const simplifiedText = await rewriter.rewrite(text);
      rewriter.destroy();
      
      return simplifiedText || text;
    }
    
    // Fallback: return original text if API not available
    return text;
  } catch (error) {
    console.warn('Chrome Rewriter API not available, using original text:', error);
    return text;
  }
}

// Server-side fallback for Chrome Rewriter API
export async function simplifyTextServerSide(text: string): Promise<string> {
  try {
    // Simple text simplification rules as fallback
    let simplified = text
      // Replace technical terms with simpler alternatives
      .replace(/diagnostic/gi, 'check')
      .replace(/malfunction/gi, 'problem')
      .replace(/component/gi, 'part')
      .replace(/inspection/gi, 'look at')
      .replace(/maintenance/gi, 'care')
      .replace(/immediately/gi, 'right away')
      .replace(/approximately/gi, 'about')
      .replace(/vehicle/gi, 'car')
      .replace(/automobile/gi, 'car')
      // Simplify sentence structure
      .replace(/It is recommended that you/gi, 'You should')
      .replace(/It is advisable to/gi, 'You should')
      .replace(/Please ensure that/gi, 'Make sure')
      .replace(/In order to/gi, 'To')
      // Remove redundant phrases
      .replace(/\s+/g, ' ')
      .trim();

    return simplified;
  } catch (error) {
    console.warn('Text simplification failed:', error);
    return text;
  }
}

// Main function that tries Chrome API first, then falls back to server-side
export async function rewriteForSimplicity(text: string): Promise<string> {
  // Try Chrome Rewriter API first (client-side)
  if (typeof window !== 'undefined') {
    const chromeResult = await simplifyTextWithChromeRewriter(text);
    if (chromeResult !== text) {
      return chromeResult;
    }
  }
  
  // Fallback to server-side simplification
  return await simplifyTextServerSide(text);
}