"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShieldAlert, Info } from "lucide-react"

interface Annotation {
  lineNumber: number
  severity: 'CRITICAL' | 'WARNING' | 'INFO'
  description: string
  recommendation: string
}

interface CodeViewerProps {
  code: string
  annotations: Annotation[]
  isAnalyzing: boolean
}

export function CodeViewer({ code, annotations, isAnalyzing }: CodeViewerProps) {
  const lines = code.split('\n')
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null)

  const getAnnotationForLine = (lineNum: number) => {
    return annotations.find(a => a.lineNumber === lineNum)
  }

  return (
    <div className="relative w-full h-full font-code text-sm overflow-auto code-editor-bg rounded-lg border border-border/40 shadow-2xl">
      {isAnalyzing && <div className="scan-line" />}
      
      <div className="flex w-full">
        {/* Line Numbers */}
        <div className="w-12 flex-shrink-0 bg-background/50 border-r border-border/40 text-muted-foreground text-right pr-3 py-4 select-none">
          {lines.map((_, i) => (
            <div key={i} className="h-6">{i + 1}</div>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 py-4 px-6 min-w-max relative">
          {lines.map((line, i) => {
            const annotation = getAnnotationForLine(i + 1)
            const severityColor = annotation?.severity === 'CRITICAL' 
              ? 'bg-red-500/10 border-l-2 border-red-500' 
              : annotation?.severity === 'WARNING'
              ? 'bg-orange-500/10 border-l-2 border-orange-500'
              : annotation?.severity === 'INFO'
              ? 'bg-blue-500/10 border-l-2 border-blue-500'
              : ''

            return (
              <div 
                key={i} 
                className={`group relative h-6 px-2 flex items-center transition-colors hover:bg-white/5 ${severityColor}`}
                onMouseEnter={() => annotation && setActiveAnnotation(annotation)}
                onMouseLeave={() => setActiveAnnotation(null)}
              >
                <span className="whitespace-pre">{line || ' '}</span>
                
                {annotation && (
                  <div className="absolute left-[-42px] z-20">
                     {annotation.severity === 'CRITICAL' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                     {annotation.severity === 'WARNING' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                     {annotation.severity === 'INFO' && <Info className="w-4 h-4 text-blue-400" />}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Suggestion */}
      {activeAnnotation && (
        <div className="fixed bottom-8 right-8 w-80 p-4 bg-card border border-border shadow-2xl rounded-xl z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={activeAnnotation.severity === 'CRITICAL' ? 'destructive' : activeAnnotation.severity === 'WARNING' ? 'secondary' : 'outline'}>
              {activeAnnotation.severity}
            </Badge>
            <span className="text-xs text-muted-foreground">Line {activeAnnotation.lineNumber}</span>
          </div>
          <h4 className="font-semibold text-sm mb-1">{activeAnnotation.description}</h4>
          <p className="text-xs text-muted-foreground mb-3">{activeAnnotation.recommendation}</p>
        </div>
      )}
    </div>
  )
}
