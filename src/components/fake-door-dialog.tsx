"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Dialog } from "@/components/dialog";
import { Input } from "@/components/input";
import { platformOptions } from "@/data/platform-options";
import { FAKE_DOOR_NOTICE } from "@/lib/constants";
import type { Platform, StrategyCard } from "@/types/strategy";

interface FakeDoorDialogProps {
  open: boolean;
  platform?: Platform;
  strategy?: StrategyCard;
  onClose: () => void;
  onWaitlist: (platform: Platform, email?: string) => void;
  onPriority: (platform: Platform) => void;
  onShare: () => void;
  onSaveAsSentence: () => void;
}

export function FakeDoorDialog({
  open,
  platform,
  strategy,
  onClose,
  onWaitlist,
  onPriority,
  onShare,
  onSaveAsSentence,
}: FakeDoorDialogProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!open) {
      setEmail("");
      setError(undefined);
    }
  }, [open]);

  const platformOption = platformOptions.find((item) => item.value === platform);
  const submitWaitlist = () => {
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setError("이메일 형식이 올바르지 않습니다. 비워두거나 다시 확인해주세요.");
      return;
    }
    setError(undefined);
    if (platform) {
      onWaitlist(platform, email || undefined);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="아직 개발 전인 베타 기능입니다">
      <div className="space-y-5">
        <div className="space-y-3 text-sm leading-6 text-slate-600">
          <p>
            이 전략을 <strong className="text-slate-900">{platformOption?.label ?? "선택한 플랫폼"}</strong>로 변환하고 싶다는
            요청을 기록했습니다.
          </p>
          <p>{FAKE_DOOR_NOTICE}</p>
          <p>출시 알림을 받고 싶다면 이메일을 남겨주세요.</p>
        </div>

        {strategy ? (
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            <p className="font-medium text-slate-900">{strategy.title}</p>
            <p>{strategy.oneLineSummary}</p>
          </div>
        ) : null}

        <Input
          type="email"
          value={email}
          placeholder="이메일은 선택 입력입니다"
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) {
              setError(undefined);
            }
          }}
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="beta" onClick={submitWaitlist}>
            변환 기능 출시 알림 받기
          </Button>
          <Button variant="secondary" onClick={() => platform && onPriority(platform)}>
            이 플랫폼을 가장 원해요
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onShare();
              onClose();
            }}
          >
            이 전략 카드 공유하기
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onSaveAsSentence();
              onClose();
            }}
          >
            현재는 문장형 조건식으로 저장하기
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
