import { Layout } from "@/components/layout";
import { AIInput, type AIField } from "@/components/ai-input";
import { useGenerateIdeas, useSaveIdea, useCritiqueIdea, type ProductIdea } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, TrendingUp, Target, Save, Check, Package,
  ArrowRight, Lightbulb, Copy, RefreshCw, Video, Zap, Brain,
  ThumbsUp, AlertTriangle, Wand2, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const EXAMPLES = [
  "I want to help busy moms find quick healthy meal ideas for their families",
  "TikTok creators who can't grow past 10k followers and feel stuck",
  "Dog owners struggling with separation anxiety — I want a training system",
  "Freelance designers who undercharge and don't know how to raise their rates",
  "Side hustle ideas for teachers who want passive income during summer break",
];

const FIELDS: AIField[] = [
  { key: "niche", label: "Market niche", emoji: "🎯", value: "" },
  { key: "audience", label: "Audience", emoji: "👥", value: "" },
  { key: "painPoint", label: "Pain point", emoji: "💢", value: "" },
  {
    key: "trendMode",
    label: "Mode",
    emoji: "📈",
    value: "false",
    options: [
      { value: "false", label: "Standard — timeless opportunities" },
      { value: "true", label: "Trend Mode — what's hot right now" },
    ],
  },
];

function extractIdeasFields(text: string): Record<string, string> {
  const lower = text.toLowerCase();

  // Audience: after "for", "helping", "targeting", "aimed at"
  const audMatch =
    text.match(/\b(?:for|helping|targeting|aimed at|with)\s+([a-zA-Z][\w\s,'-]{4,50}?)(?:\s+who|\s+that|\s+to|\.|,|$)/i)?.[1]?.trim() ?? "";

  // Pain point: after "struggle", "can't", "don't know how", "hate"
  const painMatch =
    text.match(/(?:struggling with|can't|hate|problem is|don't know how to|frustrated by|failing at)\s+([a-zA-Z][\w\s,'-]{4,60}?)(?:\.|,|$)/i)?.[1]?.trim() ?? "";

  // Niche: first significant segment or the whole thing condensed
  let niche = "";
  const nicheMatch = text.match(/^(?:I want to |help |create |build |make )?([a-zA-Z][\w\s,'-]{2,40}?)(?:\s+for|\s+helping|\s+about|\s+targeting|\.| — |$)/i)?.[1];
  if (nicheMatch && nicheMatch.length > 2) {
    niche = nicheMatch.trim().replace(/^(I want to |help |create |build |make )/i, "").trim();
  }
  if (!niche) {
    // fallback: first 3 words
    niche = text.trim().split(/\s+/).slice(0, 4).join(" ");
  }

  // Trend mode: check for trend/viral/hot/trending keywords
  const trendMode = /\b(trend|viral|hot right now|trending|what'?s working|current|2024|2025)\b/.test(lower) ? "true" : "false";

  return {
    niche: niche.replace(/[.,!?]+$/, "").trim(),
    audience: audMatch.replace(/[.,!?]+$/, "").trim() || audMatch,
    painPoint: painMatch.replace(/[.,!?]+$/, "").trim(),
    trendMode,
  };
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-500";
  if (score >= 50) return "text-yellow-500";
  return "text-red-500";
}

interface CritiquePanel {
  index: number;
  open: boolean;
}

function IdeaCritiquePanel({ idea, niche }: { idea: ProductIdea; niche: string }) {
  const critiqueIdea = useCritiqueIdea();
  const [ran, setRan] = useState(false);

  const handleCritique = () => {
    setRan(true);
    critiqueIdea.mutate({
      title: idea.title,
      description: idea.description,
      niche,
      demandScore: idea.demandScore,
      competitionScore: idea.competitionScore,
    });
  };

  const c = critiqueIdea.data;
  const VERDICT_STYLES: Record<string, string> = {
    strong: "text-green-400 bg-green-400/10 border-green-400/20",
    promising: "text-primary bg-primary/10 border-primary/20",
    weak: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    overcrowded: "text-red-400 bg-red-400/10 border-red-400/20",
  };
  const verdictStyle = c ? (VERDICT_STYLES[c.verdict] ?? VERDICT_STYLES.promising) : "";

  if (!ran) {
    return (
      <button
        onClick={handleCritique}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
      >
        <Brain className="h-3.5 w-3.5" />
        Get SPARK's Opinion
      </button>
    );
  }

  if (critiqueIdea.isPending) {
    return (
      <div className="mx-4 mb-4 p-3 rounded-lg bg-secondary/20 border border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
        SPARK is analysing this idea…
      </div>
    );
  }

  if (!c) return null;

  return (
    <div className="mx-4 mb-4 p-4 rounded-xl border bg-card/50 space-y-3">
      <div className="flex items-center gap-2">
        <div className={`text-xs font-bold px-2.5 py-1 rounded-full border ${verdictStyle}`}>
          {c.verdictLabel}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-muted-foreground text-xs">SPARK Rating:</span>
          <span className={`text-sm font-black ${c.overallRating >= 8 ? "text-green-400" : c.overallRating >= 6 ? "text-yellow-400" : "text-red-400"}`}>
            {c.overallRating}/10
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
        <Zap className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-foreground/90">{c.sparkTake}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <ThumbsUp className="h-3 w-3 text-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">Strengths</span>
          </div>
          <ul className="space-y-1">
            {c.strengths?.map((s, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-green-400 mt-0.5">·</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle className="h-3 w-3 text-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Risks</span>
          </div>
          <ul className="space-y-1">
            {c.risks?.map((r, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-orange-400 mt-0.5">·</span>{r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {c.bestAngle && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30">
          <Wand2 className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Best angle: </span>
            <span className="text-xs text-muted-foreground">{c.bestAngle}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Ideas() {
  const { toast } = useToast();
  const generateIdeas = useGenerateIdeas();
  const saveIdea = useSaveIdea();
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [currentInput, setCurrentInput] = useState<Record<string, string>>({});
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const handleGenerate = (values: Record<string, string>) => {
    setCurrentInput(values);
    setSavedIndices(new Set());
    generateIdeas.mutate({
      data: {
        niche: values.niche,
        audience: values.audience,
        painPoint: values.painPoint,
        trendMode: values.trendMode === "true",
        count: 3,
      }
    }, {
      onSuccess: (data) => {
        setIdeas(data.ideas);
      },
      onError: () => {
        toast({ title: "Couldn't generate ideas right now — try again.", variant: "destructive" });
      }
    });
  };

  const handleSave = (idea: ProductIdea, index: number) => {
    saveIdea.mutate({
      data: {
        title: idea.title,
        description: idea.description,
        niche: currentInput.niche ?? "",
        demandScore: idea.demandScore,
        competitionScore: idea.competitionScore,
        profitPotential: idea.profitPotential,
        saturationLevel: idea.saturationLevel,
        targetAudience: idea.targetAudience,
        problemSolved: idea.problemSolved,
      }
    }, {
      onSuccess: () => setSavedIndices(prev => new Set(prev).add(index)),
      onError: () => toast({ title: "Couldn't save idea", variant: "destructive" }),
    });
  };

  const handleCopy = (idea: ProductIdea) => {
    navigator.clipboard.writeText(`${idea.title}\n\n${idea.description}\n\nTarget: ${idea.targetAudience}\nProblem solved: ${idea.problemSolved}`);
    toast({ title: "Copied!" });
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[300px] shrink-0 md:sticky md:top-8">
            <AIInput
              title="Idea Generator"
              subtitle="Describe who you want to help and what they're struggling with. SPARK finds the product opportunity."
              placeholder='e.g. "I want to help teacher creators turn classroom moments into viral TikTok content"'
              examples={EXAMPLES}
              fields={FIELDS}
              extract={extractIdeasFields}
              onGenerate={handleGenerate}
              loading={generateIdeas.isPending}
              ctaLabel="Find Opportunities"
              ctaIcon={<Sparkles className="h-4 w-4" />}
            />

            {ideas.length > 0 && !generateIdeas.isPending && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 gap-2 text-muted-foreground"
                onClick={() => handleGenerate(currentInput)}
                disabled={generateIdeas.isPending}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate ideas
              </Button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {generateIdeas.isPending ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="opacity-50">
                    <CardHeader>
                      <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : ideas.length > 0 ? (
              <div className="space-y-6">
                {ideas.map((idea, i) => (
                  <Card key={i} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{idea.title}</CardTitle>
                          <CardDescription className="mt-1.5 text-base text-foreground/80">{idea.description}</CardDescription>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleCopy(idea)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={savedIndices.has(i) ? "secondary" : "outline"}
                            size="sm"
                            className="h-8"
                            onClick={() => handleSave(idea, i)}
                            disabled={savedIndices.has(i) || saveIdea.isPending}
                          >
                            {savedIndices.has(i) ? <Check className="h-4 w-4 mr-1.5 text-primary" /> : <Save className="h-4 w-4 mr-1.5" />}
                            {savedIndices.has(i) ? "Saved" : "Save"}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1 bg-secondary/30 p-3 rounded-lg">
                          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" /> Demand
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(idea.demandScore)}`}>
                            {idea.demandScore}<span className="text-sm opacity-60">/100</span>
                          </div>
                        </div>
                        <div className="space-y-1 bg-secondary/30 p-3 rounded-lg">
                          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Target className="h-3.5 w-3.5 mr-1" /> Comp.
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(100 - idea.competitionScore)}`}>
                            {idea.competitionScore}<span className="text-sm opacity-60">/100</span>
                          </div>
                        </div>
                        <div className="space-y-1 bg-secondary/30 p-3 rounded-lg col-span-2">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Profit Potential</div>
                          <div className="text-base font-bold text-primary">{idea.profitPotential}</div>
                          <Badge variant="outline" className="text-[10px] mt-1 border-border/50">Saturation: {idea.saturationLevel}</Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</h4>
                          <p className="text-sm">{idea.targetAudience}</p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Problem Solved</h4>
                          <p className="text-sm">{idea.problemSolved}</p>
                        </div>
                      </div>

                      {idea.whyItSells && (
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/15">
                          <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Why it sells: </span>
                            <span className="text-sm text-foreground/80">{idea.whyItSells}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <IdeaCritiquePanel idea={idea} niche={currentInput.niche ?? ""} />

                    <CardFooter className="pt-4 border-t border-border/40 bg-secondary/10 flex gap-2 flex-wrap">
                      <Link href={`/bundle?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || "")}`} className="flex-1 min-w-[130px]">
                        <Button className="w-full group/btn" size="sm">
                          <Package className="h-4 w-4 mr-2" />
                          Build Offer
                          <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </Button>
                      </Link>
                      <Link href={`/scripts?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || "")}`} className="flex-1 min-w-[130px]">
                        <Button variant="outline" className="w-full group/btn" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Create Content
                          <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-[420px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe your idea</h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  Tell SPARK who you want to help and what they're struggling with. No forms — just talk naturally.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
