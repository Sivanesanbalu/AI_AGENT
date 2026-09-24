import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/custom/workspace/AppSidebar";

function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="min-w-0 flex-1 overflow-x-hidden bg-white">
        {children}
      </main>
    </SidebarProvider>
  );
}

export default WorkspaceLayout;