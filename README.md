# CodeLens AI

AI-powered Code Review & Security Analysis Platform

## 🚀 Features
- AST Static Analysis Engine
- AI Vulnerability Detection (Gemini)
- Authentication Security Audit
- GitHub Repo Scanner
- Risk Scoring Dashboard
- PDF Report Generator

## 🧠 Tech Stack
Next.js, TypeScript, Tailwind CSS, Python, AST, Gemini AI

## Available
https://code-lens-a5c5pjosp-sophiya.vercel.app/


## 📊 Architecture
Frontend (Next.js + Tailwind)
        ↓
API Layer (Next.js API routes / FastAPI optional)
        ↓
Analysis Orchestrator Engine (Python + Node bridge)
        ↓
 ┌────────────────────────────────────┐
 │ 1. AST Static Analyzer (Python)     │
 │ 2. Security Rules Engine            │
 │ 3. LLM Reasoning Engine (Gemini)    │
 │ 4. Auth Security Auditor Module     │
 └────────────────────────────────────┘
        ↓
Unified Findings Engine
        ↓
Risk Scoring + Report Generator
        ↓
UI Dashboard + PDF Export
