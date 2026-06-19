
"use client"

import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar"
import { 
  FolderTree, 
  ShieldCheck, 
  Settings, 
  LayoutDashboard, 
  Github, 
  FileCode,
  Search,
  History,
  Plus
} from "lucide-react"
import { FILE_STRUCTURE } from "@/app/lib/constants"

interface AppSidebarProps {
  onFileSelect?: (file: any) => void
  currentFileName?: string
}

export function AppSidebar({ onFileSelect, currentFileName }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">CodeLens AI</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <History className="w-4 h-4" />
                  <span>Recent Scans</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between px-2 mb-1">
            <SidebarGroupLabel className="p-0">Project Files</SidebarGroupLabel>
            <Plus className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {FILE_STRUCTURE.map((file) => (
                <SidebarMenuItem key={file.id}>
                  <SidebarMenuButton 
                    isActive={currentFileName === file.name}
                    onClick={() => onFileSelect?.(file)}
                  >
                    <FileCode className={`w-4 h-4 ${file.name.endsWith('.py') ? 'text-yellow-500' : 'text-blue-500'}`} />
                    <span>{file.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Github className="w-4 h-4" />
              <span>Connect Repo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
