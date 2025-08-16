"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/sidebar-nav"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="p-4 sm:p-6 lg:p-8 flex-1"
        >
          {children}
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  )
}
