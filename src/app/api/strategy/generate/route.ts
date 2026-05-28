import { generateStrategyCard } from "@/lib/ai/generate-strategy-card";
import { GenerateStrategyRequestSchema, StrategyCardSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = GenerateStrategyRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "입력 형식이 올바르지 않습니다." }, { status: 400 });
    }

    if (parsed.data.input.trim().length < 5) {
      return Response.json({ error: "입력은 5자 이상이어야 합니다." }, { status: 400 });
    }

    const strategy = await generateStrategyCard(parsed.data);
    const validated = StrategyCardSchema.safeParse(strategy);

    if (!validated.success) {
      return Response.json({ error: "전략 카드 생성 결과가 유효하지 않습니다." }, { status: 400 });
    }

    return Response.json(validated.data);
  } catch {
    return Response.json({ error: "전략 카드 생성 중 오류가 발생했습니다." }, { status: 400 });
  }
}
