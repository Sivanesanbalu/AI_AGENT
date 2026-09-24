"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Bot,
  ChevronDown,
  Plus,
  Settings,
  Store,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

type Agent = {
  id: number;
  name: string;
  description: string | null;
  agentImage: string | null;
  createdAt: string;
  userEmail: string;
};

function AppSidebar() {
  const { data } = useSession();
  const pathname = usePathname();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const getUserAgents = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/agent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      console.log("GET /api/agent response:", result);

      if (!response.ok) {
        console.error("Failed to fetch agents:", result);
        setAgents([]);
        return;
      }

      setAgents(result.agents ?? []);
    } catch (error) {
      console.error("Fetch agents error:", error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserAgents();
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r bg-white"
    >
      {/* HEADER */}
      <SidebarHeader className="px-3 pt-4">

        {/* LOGO */}
        <div className="flex items-center gap-3 px-2">

          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm">
            <Bot className="size-5" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-[15px] font-semibold tracking-tight">
              VEO
            </p>

            <p className="text-[11px] text-muted-foreground">
              AI Agent Workspace
            </p>
          </div>

        </div>

        {/* CREATE AGENT */}
        <div className="mt-4 group-data-[collapsible=icon]:hidden">

          <Link href="/workspace/create-agent">
            <Button
              className="
                h-10
                w-full
                justify-start
                gap-2
                rounded-xl
                bg-black
                text-white
                shadow-sm
                hover:bg-black/90
              "
            >
              <Plus className="size-4" />
              Create New Agent
            </Button>
          </Link>

        </div>

        {/* COLLAPSED CREATE BUTTON */}
        <div className="mt-2 hidden justify-center group-data-[collapsible=icon]:flex">

          <Link href="/workspace/create-agent">
            <Button
              size="icon"
              className="
                size-9
                rounded-xl
                bg-black
                text-white
                hover:bg-black/90
              "
            >
              <Plus className="size-4" />
            </Button>
          </Link>

        </div>

      </SidebarHeader>

      {/* AGENTS */}
      <SidebarContent className="px-2">

        <SidebarGroup className="mt-4 px-0">

          <SidebarGroupLabel
            className="
              px-2
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-muted-foreground
            "
          >
            Your Agents
          </SidebarGroupLabel>

          <SidebarGroupContent>

            <SidebarMenu className="mt-1 gap-1">

              {/* LOADING */}
              {loading ? (

                <SidebarMenuItem>

                  <SidebarMenuButton className="h-12 rounded-xl px-2.5">

                    <div className="size-8 shrink-0 animate-pulse rounded-lg bg-muted" />

                    <div className="group-data-[collapsible=icon]:hidden">

                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />

                      <div className="mt-2 h-2 w-16 animate-pulse rounded bg-muted" />

                    </div>

                  </SidebarMenuButton>

                </SidebarMenuItem>

              ) : agents.length === 0 ? (

                /* NO AGENTS */

                <SidebarMenuItem>

                  <div className="px-2 py-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                    No agents created yet.
                  </div>

                </SidebarMenuItem>

              ) : (

                /* AGENT LIST */

                agents.map((agent) => {

                  const agentPath = `/workspace/${agent.id}`;

                  const isActive =
                    pathname === agentPath ||
                    pathname.startsWith(`${agentPath}/`);

                  return (
                    <SidebarMenuItem key={agent.id}>

                      <Link
                        href={agentPath}
                        className="block w-full"
                      >

                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={agent.name}
                          className="
                            h-12
                            w-full
                            rounded-xl
                            px-2.5
                            transition-all
                            hover:bg-muted
                            data-[active=true]:bg-muted
                          "
                        >

                          {/* AVATAR */}

                          <Avatar className="size-8 shrink-0 rounded-lg">

                            <AvatarImage
                              src={agent.agentImage ?? ""}
                              alt={agent.name}
                            />

                            <AvatarFallback className="rounded-lg text-xs">

                              {agent.name
                                ? agent.name
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "AI"}

                            </AvatarFallback>

                          </Avatar>

                          {/* DETAILS */}

                          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">

                            <p className="truncate text-sm font-medium">
                              {agent.name}
                            </p>

                            <p className="truncate text-[11px] text-muted-foreground">
                              {agent.description || "AI Agent"}
                            </p>

                          </div>

                        </SidebarMenuButton>

                      </Link>

                    </SidebarMenuItem>
                  );
                })

              )}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="px-3 pb-4">

        <SidebarSeparator className="mb-3" />

        <SidebarMenu>

          {/* MARKETPLACE */}
          <SidebarMenuItem>

            <SidebarMenuButton
              tooltip="Marketplace"
              className="h-10 rounded-xl px-2.5"
            >
              <Store className="size-4" />

              <span>
                Marketplace
              </span>
            </SidebarMenuButton>

          </SidebarMenuItem>

          {/* SETTINGS */}
          <SidebarMenuItem>

            <SidebarMenuButton
              tooltip="Settings"
              className="h-10 rounded-xl px-2.5"
            >
              <Settings className="size-4" />

              <span>
                Settings
              </span>
            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

        {/* USER */}
        <div
          className="
            mt-3
            rounded-xl
            border
            bg-muted/30
            p-2
            group-data-[collapsible=icon]:border-0
            group-data-[collapsible=icon]:bg-transparent
            group-data-[collapsible=icon]:p-0
          "
        >

          <div className="flex items-center gap-2.5">

            <Avatar className="size-9 shrink-0">

              <AvatarImage
                src={data?.user?.image ?? ""}
                alt={data?.user?.name ?? ""}
              />

              <AvatarFallback>
                {data?.user?.name
                  ?.slice(0, 2)
                  .toUpperCase() || "US"}
              </AvatarFallback>

            </Avatar>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">

              <p className="truncate text-sm font-medium">
                {data?.user?.name || "User"}
              </p>

              <p className="truncate text-[11px] text-muted-foreground">
                {data?.user?.email || ""}
              </p>

            </div>

            <ChevronDown
              className="
                size-4
                text-muted-foreground
                group-data-[collapsible=icon]:hidden
              "
            />

          </div>

        </div>

      </SidebarFooter>

    </Sidebar>
  );
}

export default AppSidebar;