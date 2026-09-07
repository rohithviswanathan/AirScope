import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

type MobileHeaderProps = {
  onMenuClick: () => void;
};

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#090E14]/90 px-4 backdrop-blur-xl lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex size-9 items-center justify-center rounded-xl text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
      >
        <HugeiconsIcon
          icon={Menu01Icon}
          size={20}
          strokeWidth={1.5}
        />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-white">
          <span className="size-2.5 rounded-full bg-[#0A0F15]" />
        </div>

        <span className="text-sm font-semibold tracking-[-0.02em] text-white">
          AirScope
        </span>
      </div>

      <button
        type="button"
        aria-label="Search locations"
        className="flex size-9 items-center justify-center rounded-xl text-white/55 transition-colors hover:bg-white/[0.05] hover:text-white"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={19}
          strokeWidth={1.5}
        />
      </button>
    </header>
  );
}