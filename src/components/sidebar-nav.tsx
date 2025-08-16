"use client"

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter
} from "@/components/ui/sidebar"
import { BrainCircuit, FileText, ListChecks, Bot, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { UserNav } from "./user-nav"
import { signOut } from "next-auth/react"

export function SidebarNav() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard", label: "Summarize", icon: FileText },
    { href: "/dashboard/optimize", label: "Optimize Task", icon: ListChecks },
    { href: "/dashboard/assistant", label: "Assistant", icon: Bot },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-8 text-foreground" />
          <span className="text-xl font-semibold text-foreground">summarAIze</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  )
}
