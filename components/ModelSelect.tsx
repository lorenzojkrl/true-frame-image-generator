import { Card, CardContent } from "@/components/ui/card";
import { imageHelpers } from "@/lib/image-helpers";
import {
  FireworksIcon,
  OpenAIIcon,
  ReplicateIcon,
  VertexIcon,
} from "@/lib/logos";
import { ProviderKey } from "@/lib/provider-config";
import { cn } from "@/lib/utils";

import { ProviderTiming } from "@/lib/image-types";

import { ImageDisplay } from "./ImageDisplay";

interface ModelSelectProps {
  label: string;
  models: string[];
  value: string;
  providerKey: ProviderKey;
  onChange: (value: string, providerKey: ProviderKey) => void;
  iconPath: string;
  color: string;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  image: string | null | undefined;
  timing?: ProviderTiming;
  failed?: boolean;
  modelId: string;
}

const PROVIDER_ICONS = {
  openai: OpenAIIcon,
  replicate: ReplicateIcon,
  vertex: VertexIcon,
  fireworks: FireworksIcon,
  gemini: VertexIcon,
} as const;

const PROVIDER_LINKS = {
  openai: "openai",
  // replicate: "replicate",
  // vertex: "google-vertex",
  // fireworks: "fireworks",
  gemini: "gemini",
} as const;

export function ModelSelect({
  label,
  models,
  value,
  providerKey,
  onChange,
  enabled = true,
  image,
  timing,
  failed,
  modelId,
}: ModelSelectProps) {
  const Icon = PROVIDER_ICONS[providerKey];

  return (
    <Card
      className={cn(
        `w-full max-w-[600px] transition-opacity`,
        enabled ? "" : "opacity-50"
      )}
    >
      <CardContent className="pt-6 h-full">
        <ImageDisplay
          modelId={modelId}
          provider={providerKey}
          image={image}
          timing={timing}
          failed={failed}
        />
      </CardContent>
    </Card>
  );
}
