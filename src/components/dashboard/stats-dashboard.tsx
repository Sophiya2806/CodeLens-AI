"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, AlertCircle, FileCode, Zap } from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts"

const qualityData = [
  { name: 'Maintainability', value: 75 },
  { name: 'Security', value: 42 },
  { name: 'Efficiency', value: 68 },
  { name: 'Complexity', value: 55 },
  { name: 'Test Coverage', value: 30 },
]

const vulnerabilityData = [
  { type: 'Injection', count: 4, fill: '#EF4444' },
  { type: 'Auth', count: 3, fill: '#F59E0B' },
  { type: 'Secrets', count: 1, fill: '#EF4444' },
  { type: 'Best Practice', count: 8, fill: '#3B82F6' },
]

export function StatsDashboard({ securityScore = 64 }: { securityScore?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium font-headline">Security Score</CardTitle>
          <ShieldCheck className={`h-4 w-4 ${securityScore > 80 ? 'text-green-500' : securityScore > 50 ? 'text-yellow-500' : 'text-red-500'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">{securityScore}/100</div>
          <Progress value={securityScore} className="h-2 mt-4" />
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium font-headline">Critical Issues</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">5</div>
          <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium font-headline">Code Complexity</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">Medium</div>
          <p className="text-xs text-muted-foreground mt-1">Avg cyclomatic: 12.4</p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium font-headline">Analyzed Files</CardTitle>
          <FileCode className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">12 Files</div>
          <p className="text-xs text-muted-foreground mt-1">1.4k Lines of code</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-headline">Vulnerability Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vulnerabilityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" />
              <XAxis type="number" hide />
              <YAxis dataKey="type" type="category" stroke="#9ca3af" fontSize={12} width={100} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0B0F19', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {vulnerabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-headline">Quality Heatmap</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityData}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5563" />
              <Radar
                name="Quality"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
