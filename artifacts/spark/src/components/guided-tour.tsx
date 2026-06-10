import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "./onboarding-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, X, Sparkles, Zap, Rocket, Compass, Telescope, TrendingUp } from "lucide-react";

const STEPS = [
  {
    id: "discover",
    title: "Discover",
    subtitle: "Find opportunities before anyone else",
    body: "Trend Radar scans what's gaining momentum. Winning Products shows you what's actually selling right now. Start here to find your niche.",
    icon: Compass,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    targetSection: "Discover",
  },
  {
    id: "build",
    title: "Build",
    subtitle: "Turn ideas into real business concepts",
    body: "Brand Builder creates your identity. Bundle Builder crafts your offer. Offer Builder designs your pricing. This is where ideas become businesses.",
    icon: Sparkles,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    targetSection: "Build",
  },
  {
    id: "create",
    title: "Create",
    subtitle: "Generate content that stops the scroll",
    body: "Viral Hooks write your first 3 seconds. TikTok Scripts build your full video. Ad Generator makes your campaigns. Content is your distribution engine.",
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    targetSection: "Create",
  },
  {
    id: "launch",
    title: "Launch",
    subtitle: "Organize and distribute your growth",
    body: "Campaign Manager plans your push. Publish Composer writes your posts. Scheduling automates your calendar. Automations run while you sleep.",
    icon: Rocket,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    targetSection: "Launch",
  },
  {
    id: "scale",
    title: "Scale",
    subtitle: "Optimize and grow with data",
    body: "Analytics shows what works. Recommendations tells you what to do next. Revenue Forecast predicts your growth. This is where you compound.",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    targetSection: "Scale",
  },
];

export function GuidedTour() {
  const { showTour, activeStep, nextStep, prevStep, endTour } = useOnboarding();
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    if (showTour) {
      setStep(0);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [showTour]);

  useEffect(() => {
    if (!visible) return;

    const findTarget = () => {
      const sectionLabel = STEPS[step].targetSection;
      const navItems = document.querySelectorAll("nav span");
      for (const el of navItems) {
        if (el.textContent?.trim() === sectionLabel) {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          return;
        }
      }
      setTargetRect(null);
    };

    const timer = setTimeout(findTarget, 100);
    return () => clearTimeout(timer);
  }, [visible, step, location]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!visible) return;
      if (e.key === "ArrowRight") { if (step < STEPS.length - 1) setStep(s => s + 1); }
      if (e.key === "ArrowLeft") { if (step > 0) setStep(s => s - 1); }
      if (e.key === "Escape") { endTour(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, step, endTour]);

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[60]" ref={overlayRef}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={endTour} />

      {/* Spotlight around target */}
      {targetRect && (
        <div
          className="absolute rounded-xl border-2 border-primary/50 shadow-[0_0_40px_rgba(132,204,22,0.15)] animate-pulse"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            transition: "all 0.4s ease-out",
          }}
        />
      )}

      {/* Tour card */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[420px] max-w-[calc(100vw-32px)]">
        <div className="bg-[hsl(0_0%_8%)] border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header bar */}
          <div className={`flex items-center gap-3 px-5 py-4 border-b ${current.border}`}>
            <div className={`h-10 w-10 rounded-xl ${current.bg} flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${current.color}`} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-sm ${current.color}`}>
                Step {step + 1} of {STEPS.length} — {current.title}
              </h3>
              <p className="text-xs text-muted-foreground">{current.subtitle}</p>
            </div>
            <button onClick={endTour} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3">
            <p className="text-sm text-foreground/90 leading-relaxed">{current.body}</p>

            {/* Step dots */}
            <div className="flex items-center gap-2 pt-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-primary" : i < step ? "w-1.5 bg-primary/40" : "w-1.5 bg-secondary/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={step === 0}
                className="h-8 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={endTour}
                className="h-8 text-xs text-muted-foreground"
              >
                Skip Tour
              </Button>
            </div>

            {step < STEPS.length - 1 ? (
              <Button size="sm" onClick={() => setStep(s => s + 1)} className="h-8 text-xs">
                Next <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={endTour} className="h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> Finish
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
