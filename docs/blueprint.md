# **App Name**: CodeLens AI

## Core Features:

- Intelligent Code Ingestion: Securely upload .py or .zip files or import GitHub repositories via URL to parse multi-file project structures.
- AST Static Analysis Engine: Python-based analysis of abstract syntax trees to detect cyclomatic complexity, dead code, and maintainability metrics.
- Security Rule Engine: Pattern-matching engine to detect common vulnerabilities such as SQL injection, XSS, and hardcoded secrets.
- AI Vulnerability Detection Tool: Uses the Gemini LLM as a reasoning tool to analyze code logic, identify code smells, and output structured security risk assessments.
- Authentication Security Audit Tool: A specialized reasoning tool designed to audit JWT handling, session management, and OAuth flows for security weaknesses.
- Annotated Code Review UI: A VS Code-like interface featuring an interactive code viewer with line-by-line AI-generated highlights and severity coding.
- Risk Rating Dashboard: Visual dashboard displaying security scores, quality heatmaps, and radar charts for high-level risk assessment.
- Professional PDF Report Generator: Generates and exports comprehensive executive summaries and detailed remediation steps in a shareable PDF format.

## Style Guidelines:

- Primary theme: Dark IDE background (#0B0F19) with a Primary Blue (#3B82F6) for active elements.
- Status-based color system: Critical risks in Red (#EF4444), Warnings in Orange (#F59E0B), and Safe metrics in Green (#22C55E).
- Headlines use 'Space Grotesk' for a tech-forward feel; Body text uses 'Inter' for high density clarity.
- Monospaced code font: 'Source Code Pro' for all programming snippets and diagnostic outputs.
- IDE-style dashboard layout featuring sidebar navigation for files, a large central code pane, and a right-side diagnostics panel.
- Horizontal scanning bar effect during code analysis and smooth highlight transitions for line annotations.
- Subtle pulsing 'AI reasoning' loading effects when processing complex security audits.
- Geometric, wireframe icons that represent abstract syntax tree structures and security nodes.