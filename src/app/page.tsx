"use client"

import React, { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { StatsDashboard } from "@/components/dashboard/stats-dashboard"
import { CodeViewer } from "@/components/editor/code-viewer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Download, 
  Github, 
  Upload, 
  Terminal, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileText,
  LayoutDashboard
} from "lucide-react"
import { MOCK_CODE } from "@/app/lib/constants"
import { annotateCode } from "@/ai/flows/inline-ai-code-annotations"
import { authSecurityAudit } from "@/ai/flows/auth-security-audit-flow"
import { codeVulnerabilityReport } from "@/ai/flows/code-vulnerability-report"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function CodeLensApp() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [annotations, setAnnotations] = useState<any[]>([])
  const [securityScore, setSecurityScore] = useState(64)
  const [vulnerabilitySummary, setVulnerabilitySummary] = useState<string>("")
  const [authAudit, setAuthAudit] = useState<any>(null)
  const { toast } = useToast()

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true)
    setActiveTab("editor")
    
    try {
      const [annotated, audit, report] = await Promise.all([
        annotateCode({ code: MOCK_CODE, fileName: 'app.py', language: 'python' }),
        authSecurityAudit({ codeSnippet: MOCK_CODE }),
        codeVulnerabilityReport({ codeContent: MOCK_CODE, language: 'python' })
      ])

      setAnnotations(annotated.annotations)
      setAuthAudit(audit)
      setSecurityScore(report.securityScore)
      setVulnerabilitySummary(report.summary)
      
      toast({
        title: "Analysis Complete",
        description: `Identified ${annotated.annotations.length} potential issues in app.py`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while processing the code.",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExportPDF = () => {
    toast({
      title: "Generating PDF",
      description: "Your comprehensive security report is being generated...",
    })
    setTimeout(() => {
      window.print()
    }, 1000)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-background flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="font-headline font-semibold text-lg hidden md:block">Project Alpha / app.py</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/50 rounded-lg p-1 mr-2 border border-border/40">
              <Github className="w-4 h-4 ml-2 text-muted-foreground" />
              <Input 
                className="border-none bg-transparent focus-visible:ring-0 text-xs w-48" 
                placeholder="Repository URL..." 
              />
            </div>
            <Button 
              size="sm" 
              variant="default" 
              className="gap-2 font-medium"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Sparkles className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
            <Button size="sm" variant="outline" className="gap-2" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="dashboard" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="editor" className="gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Review
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Security Audit
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                 <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1">
                   v1.2.4 (Latest Scan)
                 </Badge>
              </div>
            </div>

            <TabsContent value="dashboard" className="mt-0 flex-1">
              <ScrollArea className="h-full pr-4">
                <StatsDashboard securityScore={securityScore} />
                {vulnerabilitySummary && (
                  <div className="mt-8 p-6 bg-card/50 border border-border/50 rounded-xl">
                    <h3 className="text-lg font-headline font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Executive Summary
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {vulnerabilitySummary}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="editor" className="mt-0 flex-1 flex gap-6 overflow-hidden">
              <div className="flex-1 min-w-0">
                <CodeViewer 
                  code={MOCK_CODE} 
                  annotations={annotations} 
                  isAnalyzing={isAnalyzing} 
                />
              </div>
              
              {/* Sidebar Diagnostics */}
              <div className="w-80 flex-shrink-0 flex flex-col gap-4">
                <div className="p-4 bg-card/50 border border-border/40 rounded-xl">
                  <h3 className="text-sm font-headline font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Key Findings
                  </h3>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {annotations.length > 0 ? (
                        annotations.map((a, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border/20">
                            <div className="flex items-center gap-2 mb-1">
                               <Badge variant={a.severity === 'CRITICAL' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                                 {a.severity}
                               </Badge>
                               <span className="text-[10px] text-muted-foreground">Line {a.lineNumber}</span>
                            </div>
                            <p className="text-xs font-medium mb-1">{a.description}</p>
                            <p className="text-[10px] text-muted-foreground italic">{a.recommendation.substring(0, 60)}...</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground py-4 text-center">Run analysis to see findings</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex-1 p-4 bg-primary/5 border border-primary/20 rounded-xl relative overflow-hidden">
                  <div className="ai-pulse absolute top-2 right-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-headline font-semibold mb-2">AST Engine Status</h3>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Syntax Check</span>
                      <span className="text-green-500 font-bold">Passed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Complexity Index</span>
                      <span className="text-orange-500 font-bold">High (12.4)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Memory Leak Risk</span>
                      <span className="text-green-500 font-bold">None Detected</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 flex-1">
              <ScrollArea className="h-full pr-4">
                {authAudit ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 bg-card/50 border border-border/50 rounded-xl flex flex-col items-center text-center">
                         <h4 className="text-sm font-medium text-muted-foreground mb-2">Overall Rating</h4>
                         <Badge 
                           className={`px-4 py-1 text-lg ${
                             authAudit.overallRating === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 
                             authAudit.overallRating === 'WARNING' ? 'bg-orange-500/20 text-orange-500' : 
                             'bg-green-500/20 text-green-500'
                           }`}
                           variant="outline"
                         >
                           {authAudit.overallRating}
                         </Badge>
                      </div>
                      <div className="md:col-span-2 p-6 bg-card/50 border border-border/50 rounded-xl">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Audit Summary</h4>
                        <p className="text-sm leading-relaxed">{authAudit.summary}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-headline font-semibold text-xl flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Identified Vulnerabilities
                      </h3>
                      <div className="grid gap-4">
                        {authAudit.vulnerabilities.map((v: any, i: number) => (
                          <div key={i} className="p-6 bg-card/50 border-l-4 border-l-red-500 border border-border/50 rounded-r-xl">
                            <div className="flex items-center justify-between mb-2">
                               <h4 className="font-bold text-lg">{v.name}</h4>
                               <Badge variant="destructive">{v.severity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{v.description}</p>
                            <div className="bg-background/40 p-4 rounded-lg">
                              <span className="text-xs font-bold text-primary block mb-1">REMEDIATION:</span>
                              <p className="text-xs font-code">{v.remediation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <h3 className="font-headline font-semibold text-lg mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                        Best Practice Suggestions
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {authAudit.suggestions.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                    <ShieldCheck className="w-16 h-16 text-muted/20" />
                    <div>
                      <h3 className="text-xl font-headline font-bold">No Audit Data</h3>
                      <p className="text-muted-foreground max-w-sm">Run a full security scan to audit authentication mechanisms and session management.</p>
                    </div>
                    <Button onClick={handleRunAnalysis}>Start Security Audit</Button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
