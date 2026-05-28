import OpenAI from "openai";

import { StrategyCardSchema } from "@/lib/schemas";
import { generateMockStrategyCard } from "@/lib/ai/mock-strategy-generator";
import { strategySystemPrompt } from "@/lib/ai/strategy-prompt";
import type { StrategyCard } from "@/types/strategy";

interface OpenAIInput {
  input: string;
  mode?: "general" | "entry" | "exit" | "screening" | "cleanup";
}

const model = "gpt-4.1-mini";

function shouldUseOpenAI() {
  return process.env.USE_OPENAI === "true" && Boolean(process.env.OPENAI_API_KEY);
}

export async function generateStrategyWithOpenAI({
  input,
  mode,
}: OpenAIInput): Promise<StrategyCard> {
  if (!shouldUseOpenAI()) {
    return generateMockStrategyCard({ input, mode });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content: strategySystemPrompt,
        },
        {
          role: "user",
          content: `입력 아이디어: ${input}\n모드: ${mode ?? "general"}\n반드시 StrategyCard 형태 JSON만 반환해 주세요.`,
        },
      ],
    });
    const parsed = JSON.parse(response.output_text);
    const candidate = {
      ...parsed,
      sourceInput: input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversionRequestedPlatforms: Array.isArray(parsed.conversionRequestedPlatforms)
        ? parsed.conversionRequestedPlatforms
        : [],
      id: typeof parsed.id === "string" && parsed.id.length > 0 ? parsed.id : crypto.randomUUID(),
    };

    return StrategyCardSchema.parse(candidate);
  } catch {
    return generateMockStrategyCard({ input, mode });
  }
}
