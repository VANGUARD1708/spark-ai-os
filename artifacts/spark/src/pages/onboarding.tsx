import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, ArrowRight, ArrowLeft, ShoppingCart, FileText, Star,
  Users, Briefcase, Code, CheckCircle2,
  Crown, Flame, BookOpen, Gem, Megaphone, Globe
} from "lucide-react";
import { SiTiktok, SiInstagram, SiYoutube } from "react-icons/si";
import { cn } from "@/lib/utils";

const STEPS = ["Business Type", "Your Audience", "Brand Personality", "Primary Channel"];

const BUSINESS_TYPES = [
  { id: "ecommerce", label: "E-commerce", desc: "Physical or digital products", icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "digital-product", label: "Digital Products", desc: "Courses, guides, templates", icon: FileText, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "creator", label: "Creator Brand", desc: "Content + monetization", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "affiliate", label: "Affiliate", desc: "Recommend and earn", icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
  { id: "agency", label: "Agency", desc: "Services for other businesses", icon: Briefcase, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: "saas", label: "SaaS", desc: "Software subscription", icon: Code, color: "text-pink-400", bg: "bg-pink-400/10" },
];

const AUDIENCES = [
  { id: "entrepreneurs", label: "Entrepreneurs", desc: "Founders and business builders" },
  { id: "content-creators", label: "Content Creators", desc: "YouTubers, TikTokers, influencers" },
  { id: "parents", label: "Parents", desc: "Busy moms and dads" },
  { id: "fitness", label: "Fitness Lovers", desc: "Health and wellness seekers" },
  { id: "finance", label: "Finance Audience", desc: "Investors and money-minded" },
  { id: "students", label: "Students", desc: "College and lifelong learners" },
  { id: "professionals", label: "Professionals", desc: "Career-driven 9-5 employees" },
  { id: "solopreneurs", label: "Solopreneurs", desc: "One-person businesses" },
];

const PERSONALITIES = [
  { id: "luxury", label: "Luxury", desc: "Premium, exclusive, aspirational", icon: Crown, color: "text-yellow-400" },
  { id: "viral", label: "Viral", desc: "Bold, fast, entertainment-first", icon: Flame, color: "text-orange-400" },
  { id: "educational", label: "Educational", desc: "Teaching, authority, trusted", icon: BookOpen, color: "text-blue-400" },
  { id: "minimalist", label: "Minimalist", desc: "Clean, focused, intentional", icon: Gem, color: "text-purple-400" },
  { id: "bold", label: "Bold", desc: "Direct, confident, no-fluff", icon: Megaphone, color: "text-red-400" },
  { id: "community", label: "Community", desc: "Inclusive, warm, movement-led", icon: Users, color: "text-green-400" },
];

const PLATFORMS = [
  { id: "tiktok", label: "TikTok", desc: "Short-form viral content", icon: SiTiktok, color: "text-pink-400" },
  { id: "instagram", label: "Instagram", desc: "Visual brand presence", icon: SiInstagram, color: "text-purple-400" },
  { id: "youtube", label: "YouTube", desc: "Long-form authority content", icon: SiYoutube, color: "text-red-400" },
  { id: "email", label: "Email / Newsletter", desc: "Direct owned audience", icon: Globe, color: "text-blue-400" },
  { id: "multiple", label: "Multi-Platform", desc: "Everywhere at once", icon: Zap, color: "text-primary" },
];

interface SelectionCardProps {
  label: string;
  desc: string;
  icon?: React.ElementType;
  color?: string;
  bg?: string;
  selected: boolean;
  onClick: () => void;
}

function SelectionCard({ label, desc, icon: Icon, color, bg, selected, onClick }: SelectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
        selected
          ? "border-primary/60 bg-primary/10 shadow-sm shadow-primary/20"
          : "border-border/50 bg-card/30 hover:border-border hover:bg-card/60"
      )}
    >
      {Icon && (
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", bg ?? "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", color ?? "text-primary")} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      {selected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
    </button>
  );
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [audience, setAudience] = useState("");
  const [personality, setPersonality] = useState("");
  const [platform, setPlatform] = useState("");

  const canNext = [
    businessType !== "",
    audience !== "",
    personality !== "",
    platform !== "",
  ][step];

  const handleFinish = () => {
    const bt = BUSINESS_TYPES.find(b => b.id === businessType)?.label ?? businessType;
    const aud = AUDIENCES.find(a => a.id === audience)?.label ?? audience;
    const pers = PERSONALITIES.find(p => p.id === personality)?.label ?? personality;
    const plat = PLATFORMS.find(p => p.id === platform)?.label ?? platform;

    const prompt = `Build me a ${pers.toLowerCase()} ${bt.toLowerCase()} brand targeting ${aud.toLowerCase()} on ${plat}. Create my complete business strategy.`;
    navigate(`/command?goal=${encodeURIComponent(prompt)}`);
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground dark">
      <header className="flex items-center justify-between px-6 py-5 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black tracking-tight">SPARK</span>
        </div>
        <Badge variant="outline" className="border-border/50 text-muted-foreground text-xs">Business Setup</Badge>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl space-y-8">

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Step {step + 1} of {STEPS.length}</span>
              <span className="text-muted-foreground">{STEPS[step]}</span>
            </div>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all duration-500",
                    i <= step ? "bg-primary" : "bg-border/40"
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <h1 className="text-3xl font-bold tracking-tight">
              {step === 0 && "What are you building?"}
              {step === 1 && "Who is your customer?"}
              {step === 2 && "What's your brand personality?"}
              {step === 3 && "Where do you want to grow?"}
            </h1>
            <p className="text-muted-foreground">
              {step === 0 && "Choose the business model that fits your goals."}
              {step === 1 && "Your audience shapes everything — content, offer, and voice."}
              {step === 2 && "Your personality is your competitive advantage."}
              {step === 3 && "Start focused. Expand later."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-400">
            {step === 0 && BUSINESS_TYPES.map(b => (
              <SelectionCard key={b.id} {...b} selected={businessType === b.id} onClick={() => setBusinessType(b.id)} />
            ))}
            {step === 1 && AUDIENCES.map(a => (
              <SelectionCard key={a.id} {...a} selected={audience === a.id} onClick={() => setAudience(a.id)} />
            ))}
            {step === 2 && PERSONALITIES.map(p => (
              <SelectionCard key={p.id} label={p.label} desc={p.desc} icon={p.icon} color={p.color} selected={personality === p.id} onClick={() => setPersonality(p.id)} />
            ))}
            {step === 3 && PLATFORMS.map(p => (
              <SelectionCard key={p.id} label={p.label} desc={p.desc} icon={p.icon} color={p.color} selected={platform === p.id} onClick={() => setPlatform(p.id)} />
            ))}
          </div>

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {step === 0 ? "Skip Setup" : "Back"}
            </Button>
            <Button
              disabled={!canNext}
              onClick={isLastStep ? handleFinish : () => setStep(s => s + 1)}
              className="gap-2 min-w-[140px] font-semibold"
            >
              {isLastStep ? (
                <>
                  <Zap className="h-4 w-4" />
                  Launch SPARK
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
