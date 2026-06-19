import { config } from 'dotenv';
config();

import '@/ai/flows/auth-security-audit-flow.ts';
import '@/ai/flows/code-vulnerability-report.ts';
import '@/ai/flows/inline-ai-code-annotations.ts';