import { useEffect, useRef, useState, type ReactNode } from "react";
import { PointerProvider } from "./lib/pointer-context";
import { CursorGlow } from "./lib/cursor-glow";
import { MagneticButton } from "./crimes/magnetic-button";
import { FluidTooltip } from "./crimes/fluid-tooltip";
import { ShimmerText } from "./crimes/shimmer-text";
import { TiltCard } from "./crimes/tilt-card";
import GravityWells from "./toys/gravity-wells";
import FluidMesh from "./toys/fluid-mesh";
import TextDissolve from "./toys/text-dissolve";
import ColourField from "./toys/colour-field";

type Crime = {
  name: string;
  charge: string;
  evidence: string;
  exhibit: ReactNode;
};

const crimes: Crime[] = [
  {
    name: "Magnetic button",
    charge: "Moving the target",
    evidence: "Lunges at your cursor with spring physics, so the thing you're aiming at is never quite where you aimed.",
    exhibit: <MagneticButton>Try to click me</MagneticButton>,
  },
  {
    name: "Fluid tooltip",
    charge: "Loitering",
    evidence: "Follows your cursor around instead of staying next to the thing it describes. Lovely to watch, hard to read.",
    exhibit: (
      <FluidTooltip content="I'll follow you anywhere">
        <span className="rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-2.5 text-sm text-white/70">Hover me</span>
      </FluidTooltip>
    ),
  },
  {
    name: "Shimmer text",
    charge: "Being a screensaver",
    evidence: "A band of light that sweeps across the words on a loop, forever, whether or not anyone asked.",
    exhibit: <ShimmerText className="text-3xl font-light tracking-tight text-white/90">Look at me</ShimmerText>,
  },
  {
    name: "Tilt card",
    charge: "Leaning",
    evidence: "Perfectly good content, presented at an angle, for no reason except that your cursor moved.",
    exhibit: (
      <TiltCard className="w-60">
        <div className="p-5">
          <p className="text-sm text-white/80">Quarterly report</p>
          <p className="mt-1 text-xs text-white/50">Now with perspective</p>
        </div>
      </TiltCard>
    ),
  },
];

const toys: Array<{ name: string; hint: string; Toy: () => ReactNode }> = [
  { name: "Gravity wells", hint: "Click to drop an attractor. Click it again to remove it.", Toy: GravityWells },
  { name: "Fluid mesh", hint: "Drag through the fabric. Click for a shockwave.", Toy: FluidMesh },
  { name: "Text dissolve", hint: "Hover the letters and they scatter.", Toy: TextDissolve },
  { name: "Colour field", hint: "Move around. Click to spill some colour.", Toy: ColourField },
];

/** Mounts a canvas toy only while it's on screen, so four rAF loops don't run at once. */
const ToyFrame = ({ name, hint, Toy }: (typeof toys)[number]) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080808]">
      <div ref={ref} className="relative aspect-[4/3] [transform:translateZ(0)]">
        {visible && <Toy />}
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 border-t border-white/[0.06] px-5 py-4">
        <span className="text-white/90">{name}</span>
        <span className="text-right text-xs text-white/50">{hint}</span>
      </figcaption>
    </figure>
  );
};

export const App = () => (
  <PointerProvider>
    <CursorGlow size={520} blur={70} opacity={0.07} />
    <main className="relative mx-auto max-w-5xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">The ones that didn&apos;t make it into Prism</p>
      <h1 className="mt-6 text-5xl font-light tracking-[-0.035em] text-white/95 sm:text-7xl">chaos components</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
        Fun, beautiful and slightly unusable. Each of these was built with real care, then charged with a crime against
        usability and exiled from{" "}
        <a href="https://prism.sammii.dev" className="text-white/85 underline decoration-white/30 underline-offset-4 hover:decoration-white">
          Prism
        </a>
        . Play with them here, ship them nowhere.
      </p>

      <section aria-labelledby="crimes" className="mt-24">
        <h2 id="crimes" className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          The accused
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {crimes.map((c, i) => (
            <li key={c.name} className="flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
              <div className="flex min-h-56 flex-1 items-center justify-center p-10">{c.exhibit}</div>
              <div className="border-t border-white/[0.06] px-6 py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-light text-white/90">{c.name}</h3>
                  <span className="font-mono text-[11px] tabular-nums text-white/50">No. {String(i + 1).padStart(3, "0")}</span>
                </div>
                <p className="mt-2 text-sm text-white/75">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(255_170_160)]">Charge</span>{" "}
                  {c.charge}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/55">{c.evidence}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="toys" className="mt-24">
        <h2 id="toys" className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50">
          Toys
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/55">
          Canvas sketches with no job at all. Physics, particles and the Prism colour system with nothing to do but play.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {toys.map((t) => (
            <ToyFrame key={t.name} {...t} />
          ))}
        </div>
      </section>

      <footer className="mt-24 border-t border-white/[0.06] pt-8 text-sm text-white/50">
        By{" "}
        <a href="https://sammii.dev" className="text-white/75 hover:text-white">
          Sammii
        </a>
        . The serious ones live in{" "}
        <a href="https://prism.sammii.dev" className="text-white/75 hover:text-white">
          Prism
        </a>
        .
      </footer>
    </main>
  </PointerProvider>
);
