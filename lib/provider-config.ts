export type ProviderKey = "openai" | "gemini";

interface ProviderConfig {
  displayName: string;
  color: string;
  models: string[];
}

export const PROVIDERS: Record<ProviderKey, ProviderConfig> = {
  openai: {
    displayName: "OpenAI",
    color: "from-blue-500 to-cyan-500",
    models: ["dall-e-2", "dall-e-3"],
  },

  gemini: {
    displayName: "Gemini",
    color: "from-yellow-500 to-amber-500",
    models: ["gemini-2.5-flash-image"],
  },
};

// Flat list of all models with their provider
export const ALL_MODELS = [
  { id: "gemini-2.5-flash-image", provider: "gemini" as ProviderKey },
  { id: "dall-e-2", provider: "openai" as ProviderKey },
  { id: "dall-e-3", provider: "openai" as ProviderKey },
];

// Default model
export const DEFAULT_MODEL = ALL_MODELS[0].id;

// Derive provider order from ALL_MODELS
export const PROVIDER_ORDER: ProviderKey[] = Array.from(
  new Set(ALL_MODELS.map((model) => model.provider))
);

export const initializeProviderRecord = <T>(defaultValue?: T) =>
  Object.fromEntries(
    PROVIDER_ORDER.map((key) => [key, defaultValue])
  ) as Record<ProviderKey, T>;
