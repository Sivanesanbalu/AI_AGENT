import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authOptions } from "../auth/[...nextauth]/route";
import { AgentConfig, db } from "@/db";

/**
 * CREATE AGENT
 * POST /api/agent
 */
export async function POST(req: NextRequest) {
  try {
    const {
      name,
      description,
      agentImage,
    } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Agent name is required" },
        { status: 400 }
      );
    }

    const newAgentConfig = await db
      .insert(AgentConfig)
      .values({
        name: name.trim(),
        description: description?.trim() || null,
        agentImage: agentImage || null,
        userEmail: session.user.email,
      })
      .returning();

    console.log(
      "Agent created successfully:",
      newAgentConfig[0]
    );

    return NextResponse.json(
      {
        message: "Agent configuration saved successfully",
        agentConfig: newAgentConfig[0],
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create agent error:", error);

    return NextResponse.json(
      {
        error: "Failed to create agent",
      },
      { status: 500 }
    );
  }
}


/**
 * GET ALL AGENTS FOR LOGGED-IN USER
 * GET /api/agent
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const agentConfigs = await db
      .select()
      .from(AgentConfig)
      .where(
        eq(
          AgentConfig.userEmail,
          session.user.email
        )
      );

    console.log(
      "User agents:",
      agentConfigs
    );

    return NextResponse.json(
      {
        agents: agentConfigs,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get agents error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch agents",
      },
      { status: 500 }
    );
  }
}