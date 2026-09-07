import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

export function Topbar() {
  return (
    <header className="hidden h-[76px] shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#090E14]/80 px-6 backdrop-blur-xl lg:flex xl:px-8">
      {/* Current location */}
      <button
        type="button"
        className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex size-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025]">
          <HugeiconsIcon
            icon={Location01Icon}
            size={17}
            strokeWidth={1.5}
            className="text-white/45 transition-colors group-hover:text-white/70"
          />
        </div>

        <div className="text-left">
          <p className="text-sm font-medium text-white/85">
            Bengaluru, India
          </p>

          <p className="mt-0.5 text-[11px] text-white/30">
            Current location
          </p>
        </div>
      </button>

      {/* Search */}
      <div className="mx-6 hidden max-w-[420px] flex-1 xl:block">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            size={17}
            strokeWidth={1.5}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="search"
            placeholder="Search city or location..."
            className="h-10 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-16 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/[0.14] focus:bg-white/[0.04]"
          />

          <div className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-white/[0.07] px-1.5 py-0.5 text-[10px] text-white/25 sm:flex">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5 md:flex">
          <span className="size-1.5 rounded-full bg-emerald-400" />

          <span className="text-[11px] font-medium text-emerald-300/70">
            Live data
          </span>
        </div>

        <div className="size-8 rounded-xl border border-white/[0.07] bg-white/[0.04] flex items-center justify-center text-[11px] font-semibold text-white/70">
          R
        </div>
      </div>
    </header>
  );
}