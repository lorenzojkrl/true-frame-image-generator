import { Card, CardContent } from "@/components/ui/card";
import { OpenAIIcon, VertexIcon } from "@/lib/logos";
import { ProviderKey } from "@/lib/provider-config";
import { cn } from "@/lib/utils";

import { ProviderTiming } from "@/lib/image-types";

import { ImageDisplay } from "./ImageDisplay";

interface ModelSelectProps {
  providerKey: ProviderKey;
  enabled?: boolean;
  image: string | null | undefined;
  timing?: ProviderTiming;
  failed?: boolean;
  modelId: string;
}

const PROVIDER_ICONS = {
  openai: OpenAIIcon,
  gemini: VertexIcon,
} as const;

const PROVIDER_LINKS = {
  openai: "openai",
  gemini: "gemini",
} as const;

export function ModelSelect({
  providerKey,
  enabled = true,
  image,
  timing,
  failed,
  modelId,
}: ModelSelectProps) {
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
