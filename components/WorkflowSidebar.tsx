"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-select";
import { Workflow } from "@/app/generate/types";

interface WorkflowSidebarProps {
  workflows: Workflow[];
  selectedWorkflowId?: number;
  onWorkflowSelect: (workflow: Workflow) => void;
}

export function WorkflowSidebar({
  workflows,
  selectedWorkflowId,
  onWorkflowSelect,
}: WorkflowSidebarProps) {
  return (
    <aside className="w-[245px] h-screen bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto">
      <h3 className="text-white font-semibold mb-4 text-sm">Your Workflows</h3>
      <Button variant="outline" className="w-full hover:bg-zinc-300">
        <PlusIcon /> New Workflow
      </Button>
      <Separator className="my-8" />
      {workflows.map((workflow) => (
        <button
          key={workflow.id}
          onClick={() => onWorkflowSelect(workflow)}
          className={`w-full text-left text-white p-2 mb-2 text-sm overflow-hidden text-ellipsis whitespace-nowrap hover:bg-zinc-700 rounded-md transition-colors ${
            selectedWorkflowId === workflow.id
              ? "bg-zinc-700 border-l-2 border-blue-500"
              : ""
          }`}
        >
          {workflow.title}
        </button>
      ))}
    </aside>
  );
}
