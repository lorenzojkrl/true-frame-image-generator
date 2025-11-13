"use client";

import { Suggestion } from "@/lib/suggestions";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface PromptSuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({
  suggestions,
  onSelect,
}: PromptSuggestionsProps) {
  return (
    <div className="flex items-center justify-between space-x-2 mt-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion.prompt)}
          className={cn(
            "flex items-center justify-between px-2 rounded-lg py-1 bg-background text-sm hover:opacity-70 group transition-opacity duration-200",
            index > 2 ? "hidden md:flex" : index > 1 ? "hidden sm:flex" : ""
          )}
        >
          <span>
            <span className="text-black text-xs sm:text-sm">
              {suggestion.text.toLowerCase()}
            </span>
          </span>
          <ArrowUpRight className="ml-1 h-2 w-2 sm:h-3 sm:w-3 text-zinc-500 group-hover:opacity-70" />
        </button>
      ))}
    </div>
  );
}
