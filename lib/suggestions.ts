export interface Suggestion {
  text: string;
  prompt: string;
}

const artStyles = ["anime", "art nouveau", "ukiyo-e", "watercolor"];

const basePrompts: { text: string; prompt: string }[] = [
  {
    text: "Cinematic rubik cube",
    prompt:
      "A dramatic, cinematic image of a worn, scratched, and vintage Rubik's Cube tumbling down a grand flight of white marble stairs. The scene is set outdoors at the entrance of a stately building on an overcast autumn dusk. Soft, diffused light creates a moody atmosphere, with sharp contrasts and strong shadows adding to the drama. Vibrant red and yellow autumn leaves are scattered across the stairs. The perspective is a dynamic blend of close-up detail on the cube's texture and the marble's surface, alongside a wider shot that captures the full descent of the stairs, which run from left to right. The cube appears to be falling in the same left-to-right direction",
  },
  {
    text: "Freshly glazed tea bowl",
    prompt:
      "A photorealistic close-up portrait of an elderly Japanese ceramicist with deep, sun-etched wrinkles and a warm, knowing smile. He is carefully inspecting a freshly glazed tea bowl. The setting is his rustic, sun-drenched workshop. The scene is illuminated by soft, golden hour light streaming through a window, highlighting the fine texture of the clay. Captured with an 85mm portrait lens, resulting in a soft, blurred background (bokeh). The overall mood is serene and masterful. Vertical portrait orientation.",
  },
  {
    text: "Ceramic coffee mug",
    prompt:
      "A high-resolution, studio-lit product photograph of a minimalist ceramic coffee mug in matte black, presented on a polished concrete surface. The lighting is a three-point softbox setup designed to create soft, diffused highlights and eliminate harsh shadows. The camera angle is a slightly elevated 45-degree shot to showcase its clean lines. Ultra-realistic, with sharp focus on the steam rising from the coffee. Square image.",
  },
  {
    text: "minimalist composition",
    prompt:
      "A minimalist composition featuring a single, delicate red maple leaf positioned in the bottom-right of the frame. The background is a vast, empty off-white canvas, creating significant negative space for text. Soft, diffused lighting from the top left. Square image.",
  },
];

export function getRandomSuggestions(count: number = 5): Suggestion[] {
  return basePrompts.slice(0, count).map((item) => ({
    text: item.text,
    prompt: item.prompt,
  }));
}
