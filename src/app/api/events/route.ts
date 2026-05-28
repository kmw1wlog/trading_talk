import { AnalyticsEventSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = AnalyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "이벤트 형식이 올바르지 않습니다." }, { status: 400 });
    }

    console.log("[siktalk:event]", parsed.data);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "이벤트 기록 중 오류가 발생했습니다." }, { status: 400 });
  }
}
