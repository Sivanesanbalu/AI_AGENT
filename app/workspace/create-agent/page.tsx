"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Shuffle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
const avatars = [
  "https://api.dicebear.com/9.x/shapes/svg?seed=agent-1",
  "https://api.dicebear.com/9.x/shapes/svg?seed=agent-2",
  "https://api.dicebear.com/9.x/shapes/svg?seed=agent-3",
  "https://api.dicebear.com/9.x/shapes/svg?seed=agent-4",
  "https://api.dicebear.com/9.x/shapes/svg?seed=agent-5",
];

function CreateAgentPage() {
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [created, setCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const shuffleAvatar = () => {
    setAvatarIndex((current) => (current + 1) % avatars.length);
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: instructions.trim(),
          agentImage: avatars[avatarIndex],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to create agent:", data);
        return;
      }

      console.log("Agent created successfully:", data);

      setCreated(true);
    } catch (error) {
      console.error("Create agent error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="mx-auto w-full max-w-5xl px-8 pb-6 pt-7">
        <Link
          href="/workspace"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Workspace
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Create New Agent
          </h1>

          <p className="mt-1.5 text-base text-muted-foreground">
            Customize your agent and give it a clear purpose.
          </p>
        </div>

        <form onSubmit={handleCreateAgent}>
          {/* Avatar */}
          <div className="mb-7 flex flex-col items-center">
            <div className="flex size-28 items-center justify-center rounded-full bg-blue-50 p-3">
              <img
                src={avatars[avatarIndex]}
                alt="Agent avatar"
                className="size-22 rounded-full"
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={shuffleAvatar}
              className="mt-3 h-9 gap-2 rounded-lg px-4"
            >
              <Shuffle className="size-4" />
              Shuffle avatar
            </Button>
          </div>

          {/* Form fields */}
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Agent Name */}
            <div className="space-y-2">
              <Label
                htmlFor="agent-name"
                className="text-sm font-semibold"
              >
                Agent name
              </Label>

              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter agent name"
                className="h-11 rounded-lg border-gray-200 px-4 text-sm shadow-none focus-visible:ring-1"
                required
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="instructions"
                  className="text-sm font-semibold"
                >
                  Instructions / Description
                </Label>

                <span className="text-xs text-muted-foreground">
                  Optional
                </span>
              </div>

              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => {
                  if (e.target.value.length <= 1000) {
                    setInstructions(e.target.value);
                  }
                }}
                placeholder="Describe what this agent should do, its personality, goals, or special instructions..."
                className="min-h-[130px] resize-none rounded-lg border-gray-200 p-4 text-sm shadow-none focus-visible:ring-1"
                maxLength={1000}
              />

              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {instructions.length} / 1000
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-1">
              <Link href="/workspace">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-lg px-6"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={!name.trim() || isLoading}
                className="h-10 gap-2 rounded-lg bg-blue-600 px-7 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {created ? (
                  <>
                    <Check className="size-4" />
                    Agent Created
                  </>
                ) : (
                  <>
                    <Plus className="size-4" />
                    {isLoading ? "Creating..." : "Create Agent"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAgentPage;