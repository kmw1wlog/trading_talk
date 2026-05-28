import { generateMockStrategyCard } from "@/lib/ai/mock-strategy-generator";
import { generateStrategyWithOpenAI } from "@/lib/ai/openai-strategy-generator";
import type { StrategyCard } from "@/types/strategy";

interface GenerateStrategyInput {
  input: string;
  mode?: "general" | "entry" | "exit" | "screening" | "cleanup";
}

export async function generateStrategyCard({
  input,
  mode,
}: GenerateStrategyInput): Promise<StrategyCard> {
  if (process.env.USE_OPENAI === "true" && process.env.OPENAI_API_KEY) {
    return generateStrategyWithOpenAI({ input, mode });
  }

  return generateMockStrategyCard({ input, mode });
}
