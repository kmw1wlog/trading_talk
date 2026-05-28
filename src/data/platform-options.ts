import type { Platform } from "@/types/strategy";

export interface PlatformOption {
  value: Platform;
  label: string;
  shortLabel: string;
  buttonLabel: string;
}

export const platformOptions: PlatformOption[] = [
  {
    value: "tradingview",
    label: "트레이딩뷰 알람식",
    shortLabel: "트레이딩뷰",
    buttonLabel: "트레이딩뷰 변환 요청",
  },
  {
    value: "kiwoom",
    label: "키움 조건검색식",
    shortLabel: "키움",
    buttonLabel: "키움 변환 요청",
  },
  {
    value: "yestrader",
    label: "예스트레이더 조건식",
    shortLabel: "예스트레이더",
    buttonLabel: "예스트레이더 변환 요청",
  },
  {
    value: "mts",
    label: "MTS 알람 문장",
    shortLabel: "MTS",
    buttonLabel: "MTS 알람 요청",
  },
  {
    value: "webhook",
    label: "웹훅 알림 문장",
    shortLabel: "웹훅",
    buttonLabel: "웹훅 문장 요청",
  },
  {
    value: "telegram",
    label: "텔레그램 알림 문구",
    shortLabel: "텔레그램",
    buttonLabel: "텔레그램 요청",
  },
];
