import { SimulationReportSchema, SimulationRequestSchema } from "@/lib/schemas";
import { simulateStrategy } from "@/lib/simulation/simulate-strategy";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = SimulationRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "모의검증 요청 형식이 올바르지 않습니다." }, { status: 400 });
    }

    const report = simulateStrategy(parsed.data.strategy);
    const validated = SimulationReportSchema.safeParse(report);

    if (!validated.success) {
      return Response.json({ error: "모의검증 결과가 유효하지 않습니다." }, { status: 400 });
    }

    return Response.json(validated.data);
  } catch {
    return Response.json({ error: "모의검증 중 오류가 발생했습니다." }, { status: 400 });
  }
}
