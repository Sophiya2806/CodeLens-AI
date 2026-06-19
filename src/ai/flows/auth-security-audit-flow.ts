'use server';
/**
 * @fileOverview Provides a specialized AI-powered security audit for authentication mechanisms.
 *
 * - authSecurityAudit - A function that initiates the authentication security audit process.
 * - AuthSecurityAuditInput - The input type for the authSecurityAudit function.
 * - AuthSecurityAuditOutput - The return type for the authSecurityAudit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuthSecurityAuditInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet related to authentication mechanisms (e.g., JWT handling, session management, OAuth flows) to be audited.'),
  context: z.string().optional().describe('Optional additional context about the code or application architecture to aid in the audit.'),
});
export type AuthSecurityAuditInput = z.infer<typeof AuthSecurityAuditInputSchema>;

const AuthSecurityAuditOutputSchema = z.object({
  overallRating: z.enum(['CRITICAL', 'WARNING', 'SAFE']).describe('An overall security rating for the authentication mechanism based on the audit.'),
  summary: z.string().describe('A high-level summary of the authentication security audit findings.'),
  vulnerabilities: z.array(
    z.object({
      name: z.string().describe('The name or type of the identified vulnerability.'),
      severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL']).describe('The severity level of the vulnerability.'),
      description: z.string().describe('A detailed explanation of the vulnerability and how it impacts security.'),
      remediation: z.string().describe('Specific steps or recommendations to remediate the identified vulnerability.'),
    })
  ).describe('A list of specific security vulnerabilities found.'),
  suggestions: z.array(
    z.string().describe('General security suggestions for improving the robustness of the authentication system.')
  ).describe('General best practice suggestions for authentication security.'),
});
export type AuthSecurityAuditOutput = z.infer<typeof AuthSecurityAuditOutputSchema>;

export async function authSecurityAudit(input: AuthSecurityAuditInput): Promise<AuthSecurityAuditOutput> {
  return authSecurityAuditFlow(input);
}

const authSecurityAuditPrompt = ai.definePrompt({
  name: 'authSecurityAuditPrompt',
  input: {schema: AuthSecurityAuditInputSchema},
  output: {schema: AuthSecurityAuditOutputSchema},
  prompt: `You are an expert authentication security auditor. Your task is to meticulously review the provided code snippet focusing on authentication mechanisms such as JWT handling, session management, or OAuth flows.

Analyze the code for common vulnerabilities, misconfigurations, and potential security weaknesses. Provide a comprehensive audit, including an overall security rating, a high-level summary, a detailed list of specific vulnerabilities found (if any), and general best-practice suggestions for improving authentication security.

Consider the following context and code:

Code Snippet:
"""
{{{codeSnippet}}}
"""

{{#if context}}
Additional Context:
"""
{{{context}}}
"""
{{/if}}

Based on your analysis, provide a structured JSON output adhering strictly to the following schema:

- overallRating: 'CRITICAL', 'WARNING', or 'SAFE'
- summary: A high-level overview of your findings.
- vulnerabilities: An array of objects, each containing:
  - name: The name of the vulnerability (e.g., "Insecure JWT Secret", "Session Fixation", "Weak Password Hashing").
  - severity: 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', or 'INFORMATIONAL'.
  - description: A detailed explanation of the vulnerability.
  - remediation: Concrete steps to fix the vulnerability.
- suggestions: An array of general security best practices or improvements.

Ensure that all fields in the output schema are populated appropriately. If no vulnerabilities are found, the 'vulnerabilities' array should be empty, and the overallRating should be 'SAFE' or 'WARNING' with relevant suggestions.`,
});

const authSecurityAuditFlow = ai.defineFlow(
  {
    name: 'authSecurityAuditFlow',
    inputSchema: AuthSecurityAuditInputSchema,
    outputSchema: AuthSecurityAuditOutputSchema,
  },
  async (input) => {
    const {output} = await authSecurityAuditPrompt(input);
    return output!;
  }
);
