import { Workflow } from "@/app/generate/types";

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 1,
    title: "Mushroom Mania",
    context:
      "Vibrant and colorful mushrooms, colorful background, vibrant colors, detailed, realistic, high quality, 8k",
    prompt:
      "Create a masterpiece of a mushroom, make it realistic like in the reference images, but the upper part of the mushroom should be a vibrant electric blue",
    aspectRatio: "1:1",
    referenceImages: [
      "https://cdn.pixabay.com/photo/2025/09/30/14/53/mushroom-9864616_1280.jpg",
      "https://cdn.pixabay.com/photo/2022/12/19/21/44/golden-7666646_1280.jpg",
      "https://cdn.pixabay.com/photo/2022/12/19/21/44/golden-7666646_1280.jpg",
    ],
    modelId: "gemini-2.5-flash-image",
    providerId: "gemini",
  },
  {
    id: 2,
    title: "Second workflow title",
    context: "Second workflow context",
    prompt: "Second workflow prompt",
    aspectRatio: "1:1",
    referenceImages: [],
    modelId: "gemini-2.5-flash-image",
    providerId: "gemini",
  },
  {
    id: 3,
    title: "Third workflow title",
    context: "Third workflow context",
    prompt: "Third workflow prompt",
    aspectRatio: "1:1",
    referenceImages: [],
    modelId: "gemini-2.5-flash-image",
    providerId: "gemini",
  },
  {
    id: 4,
    title: "Fourth workflow title",
    context: "Fourth workflow context",
    prompt: "Fourth workflow prompt",
    aspectRatio: "1:1",
    referenceImages: [
      "https://cdn.pixabay.com/photo/2022/12/19/21/44/golden-7666646_1280.jpg",
    ],
    modelId: "gemini-2.5-flash-image",
    providerId: "gemini",
  },
];
