/**
 * @fileOverview A utility for retrying asynchronous operations with exponential backoff.
 */

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 2000
): Promise<T> {
  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a retryable error (503 Service Unavailable or 429 Too Many Requests)
      const isRetryable = 
        error?.message?.includes('503') || 
        error?.message?.includes('429') ||
        error?.message?.includes('Service Unavailable') ||
        error?.message?.includes('high demand');

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      console.warn(`AI service busy (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  throw lastError;
}
