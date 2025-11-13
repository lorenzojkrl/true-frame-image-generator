"use client";

import { useSearchParams } from "next/navigation";

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");

  // TODO: Implement image generation here using the prompt

  return (
    <div className="text-center">
      <p className="text-xl">Generating images for prompt:</p>
      <p className="font-semibold mt-2">{prompt || "No prompt provided"}</p>
    </div>
  );
}
