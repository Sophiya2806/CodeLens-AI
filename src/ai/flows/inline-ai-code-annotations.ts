'use server';
/**
 * @fileOverview A Genkit flow for generating inline code annotations for vulnerabilities and code smells.
 *
 * - annotateCode - A function that handles the code annotation process.
 * - AnnotateCodeInput - The input type for the annotateCode function.
 * - AnnotateCodeOutput - The return type for the annotateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {withRetry} from '@/lib/retry';

const AnnotateCodeInputSchema = z.object({
  code: z.string().describe('The source code to be analyzed.'),
  fileName: z.string().describe('The name of the code file.'),
  language: z.string().describe('The programming language of the code (e.g., "python", "javascript", "typescript").'),
});
export type AnnotateCodeInput = z.infer<typeof AnnotateCodeInputSchema>;

const AnnotationSchema = z.object({
  lineNumber: z.number().describe('The line number where the issue is found (1-indexed).'),
  severity: z.enum(['CRITICAL', 'WARNING', 'INFO']).describe('The severity of the issue.'),
  description: z.string().describe('A description of the identified vulnerability or code smell.'),
  recommendation: z.string().describe('A recommendation for how to fix or improve the code.'),
});

const AnnotateCodeOutputSchema = z.object({
  annotations: z.array(AnnotationSchema).describe('A list of code annotations, each describing a vulnerability or code smell.'),
});
export type AnnotateCodeOutput = z.infer<typeof AnnotateCodeOutputSchema>;

export async function annotateCode(input: AnnotateCodeInput): Promise<AnnotateCodeOutput> {
  return annotateCodeFlow(input);
}

const annotateCodePrompt = ai.definePrompt({
  name: 'annotateCodePrompt',
  input: {schema: AnnotateCodeInputSchema},
  output: {schema: AnnotateCodeOutputSchema},
  prompt: `You are an expert code reviewer and security analyst. Your task is to analyze the provided {{{language}}} code from the file "{{{fileName}}}" for vulnerabilities, security risks, and code smells.

For each issue found, identify the exact line number, assign a severity (CRITICAL, WARNING, or INFO), provide a clear description of the problem, and suggest a concrete recommendation for how to fix or improve it.

Focus on common vulnerabilities such as SQL injection, XSS, hardcoded secrets, insecure authentication practices (e.g., weak JWT handling, poor session management, incorrect OAuth flows), potential bugs, and general code quality issues like cyclomatic complexity, dead code, and maintainability.

Provide your output as a JSON array of annotations, where each annotation includes 'lineNumber', 'severity', 'description', and 'recommendation'. Only output JSON.

Code to analyze:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`
`,
});

const annotateCodeFlow = ai.defineFlow(
  {
    name: 'annotateCodeFlow',
    inputSchema: AnnotateCodeInputSchema,
    outputSchema: AnnotateCodeOutputSchema,
  },
  async (input) => {
    const {output} = await withRetry(() => annotateCodePrompt(input));
    return output!;
  }
);
