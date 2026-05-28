import { platformOptions } from "@/data/platform-options";
import type { Platform } from "@/types/strategy";

import { Button } from "@/components/button";

export function FakeDoorButtons({
  onClick,
}: {
  onClick: (platform: Platform) => void;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {platformOptions.map((platform) => (
        <Button
          key={platform.value}
          variant="outline"
          className="justify-start rounded-2xl border-brand-100 bg-brand-50/60 text-left text-brand-800 hover:bg-brand-100"
          onClick={() => onClick(platform.value)}
        >
          {platform.buttonLabel}
        </Button>
      ))}
    </div>
  );
}
