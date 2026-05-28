import type { AssetClass, ConditionCategory, StrategyCard, StrategyCondition, StrategyType } from "@/types/strategy";

interface GenerateMockStrategyInput {
  input: string;
  mode?: "general" | "entry" | "exit" | "screening" | "cleanup";
  parentId?: string;
}

function makeCondition(
  label: string,
  detail: string,
  plainKorean: string,
  category: ConditionCategory,
): StrategyCondition {
  return {
    id: crypto.randomUUID(),
    label,
    detail,
    plainKorean,
    category,
  };
}

function includesAll(input: string, keywords: string[]) {
  return keywords.every((keyword) => input.includes(keyword));
}

function buildBaseCard() {
  return {
    title: "조건 조합형 전략 카드",
    oneLineSummary: "말로 적은 아이디어를 진입·청산·종목·필터 조건으로 정리한 기본 전략 카드입니다.",
    strategyTypes: ["swing", "market_regime_filter"] as StrategyType[],
    conditionCategories: ["entry", "exit", "screening", "analysis", "risk", "combo"] as ConditionCategory[],
    entryConditions: [
      makeCondition("진입 트리거", "최근 상승 모멘텀이 재확인될 때만 본다.", "신호가 다시 살아날 때 진입 후보로 봅니다.", "entry"),
      makeCondition("확인 조건", "직전 고점 또는 핵심 기준선 회복 여부를 본다.", "이전보다 강해졌는지 확인합니다.", "entry"),
    ],
    exitConditions: [
      makeCondition("손절 기준", "핵심 지지 구간 이탈 시 정리한다.", "기준선이 무너지면 손실을 제한합니다.", "exit"),
      makeCondition("익절 기준", "단기 과열 또는 목표 손익비 도달 시 분할 청산한다.", "충분히 올랐으면 나눠서 정리합니다.", "exit"),
    ],
    screeningConditions: [
      makeCondition("종목 조건", "관심 종목군 중 최근 거래대금이 유지되는 대상을 본다.", "거래가 너무 없는 종목은 피합니다.", "screening"),
    ],
    filterConditions: [
      makeCondition("필터 조건", "뉴스 급등 직후 과열 구간은 일단 제외한다.", "이미 너무 급하게 오른 자리는 조심합니다.", "analysis"),
      makeCondition("리스크 필터", "같은 방향 신호가 연속될 때는 첫 신호만 본다.", "과하게 많이 들어가지 않도록 제한합니다.", "risk"),
    ],
    suitableAssets: ["공통"] as AssetClass[],
    suitableTimeframes: ["15분봉", "60분봉"],
    avoidRegimes: ["뉴스 급등 직후 과열 구간", "거래대금이 급감한 횡보장"],
    riskSummary:
      "이 전략은 신호를 문장형으로 정리해 해석을 돕지만, 실제 시장에서는 체결 지연과 슬리피지로 결과가 달라질 수 있습니다.",
    validationIdeas: [
      "진입 신호 후 3봉, 5봉, 10봉 수익률 차이를 비교해보기",
      "시간대별로 신호 성공률이 달라지는지 나눠보기",
      "손절 기준을 고정폭과 ATR 기준으로 각각 비교해보기",
    ],
    nextActions: ["모의검증하기", "식 서랍에 저장하기", "문장형 조건식으로 다시 다듬기"],
  };
}

export function generateMockStrategyCard({
  input,
  mode,
  parentId,
}: GenerateMockStrategyInput): StrategyCard {
  const normalized = input.toLowerCase();
  const now = new Date().toISOString();
  const base = buildBaseCard();

  if (includesAll(normalized, ["거래량"]) && (normalized.includes("돌파") || normalized.includes("전고점"))) {
    base.title = "거래량 돌파 관심종목식";
    base.oneLineSummary = "거래량이 평소보다 크게 붙고 전고점 또는 최근 고점을 넘길 때 집중해서 보는 돌파형 전략입니다.";
    base.strategyTypes = ["breakout", "day_trading"];
    base.entryConditions = [
      makeCondition("거래량 급증", "최근 평균 거래량 대비 2배 이상 증가", "평소보다 거래가 확실히 많이 붙을 때만 봅니다.", "entry"),
      makeCondition("가격 돌파", "20봉 고점 또는 전고점 돌파", "최근 박스 상단을 넘기는지 확인합니다.", "entry"),
      makeCondition("캔들 확인", "돌파 시 양봉 마감", "올랐다가 바로 밀리지 않는지 봅니다.", "entry"),
    ];
    base.exitConditions = [
      makeCondition("손절", "진입가 대비 -2% 이탈", "처음 생각이 틀리면 빠르게 정리합니다.", "exit"),
      makeCondition("익절", "ATR 1.5배 구간 도달 시 분할 익절", "변동성 기준 목표 구간에서 일부 이익을 챙깁니다.", "exit"),
      makeCondition("추세 종료", "단기 이동평균 이탈", "짧은 추세가 꺾이면 정리합니다.", "exit"),
    ];
    base.suitableAssets = ["국장", "미장", "코인"];
    base.suitableTimeframes = ["5분봉", "15분봉"];
    base.avoidRegimes = ["이미 장대양봉이 3번 이상 이어진 과열 구간", "거래량 없는 가짜 돌파 구간"];
  } else if (
    includesAll(normalized, ["rsi"]) &&
    (normalized.includes("과매도") || normalized.includes("반등"))
  ) {
    base.title = "RSI 과매도 반등 전략";
    base.oneLineSummary = "RSI 과매도 구간에서 반등 신호가 확인될 때만 짧게 노리는 평균회귀형 전략입니다.";
    base.strategyTypes = ["mean_reversion", "swing"];
    base.entryConditions = [
      makeCondition("RSI 과매도", "RSI 30 이하 진입 후 재상향", "과하게 눌린 뒤 다시 살아나는지 봅니다.", "entry"),
      makeCondition("지지 확인", "직전 저점 부근 지지 확인", "무작정 반등이 아니라 버티는 자리를 찾습니다.", "entry"),
    ];
    base.exitConditions = [
      makeCondition("1차 청산", "RSI 50 부근 또는 단기 저항 도달", "반등이 중간 구간까지 오면 일부 정리합니다.", "exit"),
      makeCondition("손절", "직전 저점 이탈", "반등 가정이 깨지면 빠르게 정리합니다.", "exit"),
    ];
    base.suitableAssets = ["국장", "미장", "코인"];
    base.suitableTimeframes = ["60분봉", "일봉"];
  } else if (
    normalized.includes("코인") &&
    normalized.includes("5분") &&
    normalized.includes("급등")
  ) {
    base.title = "코인 5분봉 고변동성 초입 전략";
    base.oneLineSummary = "코인 5분봉에서 변동성이 급격히 커지는 초입만 짧게 추적하는 스캘핑형 전략입니다.";
    base.strategyTypes = ["scalping", "volatility"];
    base.entryConditions = [
      makeCondition("변동성 확대", "직전 5개 봉 평균 대비 몸통과 거래량이 동시에 확대", "갑자기 힘이 붙는 초입만 노립니다.", "entry"),
      makeCondition("재돌파", "짧은 눌림 뒤 직전 고점 재돌파", "한 번 튄 뒤 다시 강해지는지 봅니다.", "entry"),
    ];
    base.exitConditions = [
      makeCondition("빠른 익절", "1차 목표 도달 시 절반 정리", "짧은 시간 안에 일부 이익을 확보합니다.", "exit"),
      makeCondition("손절", "진입 기준봉 저가 이탈", "초입이 실패하면 바로 정리합니다.", "exit"),
    ];
    base.suitableAssets = ["코인"];
    base.suitableTimeframes = ["5분봉"];
    base.avoidRegimes = ["유동성 얕은 새벽 시간대", "뉴스 직후 과열된 추격 구간"];
  } else if (
    normalized.includes("장 막판") ||
    normalized.includes("종가") ||
    normalized.includes("오후장")
  ) {
    base.title = "장 막판 강세 종목 필터";
    base.oneLineSummary = "오후장 후반이나 종가 무렵에 매수세가 유지되는 종목만 가려보는 장 마감형 전략입니다.";
    base.strategyTypes = ["closing_bet", "day_trading"];
    base.entryConditions = [
      makeCondition("오후장 강세", "오후 2시 이후 고점 재시도", "장 막판에도 힘이 남아 있는 종목을 봅니다.", "entry"),
      makeCondition("거래대금 유지", "마감 전까지 거래대금이 줄지 않음", "막판에 거래가 식지 않는지 확인합니다.", "entry"),
    ];
    base.exitConditions = [
      makeCondition("당일 청산", "종가 전 또는 다음날 시가 반응 확인 후 정리", "밤새 위험을 크게 가져가지 않도록 합니다.", "exit"),
    ];
    base.suitableAssets = ["국장"];
    base.suitableTimeframes = ["15분봉", "30분봉"];
  }

  if (normalized.includes("atr") && normalized.includes("손절")) {
    base.riskSummary =
      "손절 기준을 ATR 기반으로 두는 아이디어가 포함되어 있습니다. 다만 ATR이 넓어질수록 실제 손실 허용폭도 커질 수 있으므로 자금 배분과 함께 봐야 합니다.";
    base.filterConditions = [
      ...base.filterConditions,
      makeCondition("ATR 손절 관리", "최근 변동성 확대 시 포지션 크기 축소", "변동성이 커지면 같은 비중으로 들어가지 않습니다.", "risk"),
    ];
  }

  if (mode === "entry") {
    base.oneLineSummary = `${base.oneLineSummary} 이번 정리는 진입 조건에 더 집중해서 구성했습니다.`;
  }

  return {
    id: crypto.randomUUID(),
    parentId,
    sourceInput: input,
    title: base.title,
    oneLineSummary: base.oneLineSummary,
    strategyTypes: base.strategyTypes,
    conditionCategories: Array.from(new Set(base.conditionCategories)),
    entryConditions: base.entryConditions,
    exitConditions: base.exitConditions,
    screeningConditions: base.screeningConditions,
    filterConditions: base.filterConditions,
    suitableAssets: [...base.suitableAssets],
    suitableTimeframes: base.suitableTimeframes,
    avoidRegimes: base.avoidRegimes,
    riskSummary: base.riskSummary,
    validationIdeas: base.validationIdeas,
    nextActions: base.nextActions,
    conversionRequestedPlatforms: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function createImprovedStrategyCard(strategy: StrategyCard): StrategyCard {
  const improvements = [
    "거래량 필터 강화",
    "시간대 필터 추가",
    "ATR 손절 추가",
    "과열 회피 필터 추가",
  ];
  const pick = improvements[strategy.title.length % improvements.length];
  const improved = generateMockStrategyCard({
    input: `${strategy.sourceInput} / 개선: ${pick}`,
    parentId: strategy.id,
  });

  improved.title = `${strategy.title} · 20분 개선`;
  improved.oneLineSummary = `${strategy.oneLineSummary} 개선안으로 ${pick}을 붙여 과열 구간과 약한 시간대를 줄이는 방향을 제안합니다.`;
  improved.validationIdeas = [
    `${pick} 적용 전후 성과 차이 비교`,
    "기존 전략 대비 거래 횟수와 MDD 변화 체크",
    "과최적화 여부를 보기 위해 조건 하나만 추가해 테스트",
  ];

  return improved;
}
