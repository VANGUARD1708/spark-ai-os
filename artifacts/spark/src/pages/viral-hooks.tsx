import { Layout } from "@/components/layout";
import { AIInput, type AIField } from "@/components/ai-input";
import { useGenerateViralHooks, useSaveHooks, getGetSavedHooksQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Copy, ArrowRight, Video, Bookmark, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EXAMPLES = [
  "Pain hooks for a 30-day fitness plan for moms who can't lose weight after having kids",
  "Curiosity hooks for a budgeting system that helped me save $500 in one month",
  "Short punchy hooks for a dog training course — dogs who won't stop barking",
  "Story hooks for a freelance design course — how I went from $20/hr to $200/hr",
  "All hook types for a side hustle guide for teachers who want passive income",
];

const FIELDS: AIField[] = [
  { key: "productTitle", label: "Product / topic", emoji: "📦", value: "" },
  { key: "description", label: "What makes it different", emoji: "✨", value: "" },
  {
    key: "hookType",
    label: "Hook type",
    emoji: "🪝",
    value: "all",
    options: [
      { value: "all", label: "All types — get every category" },
      { value: "curiosity", label: "Curiosity — they HAVE to keep watching" },
      { value: "pain", label: "Pain — hits a deep frustration" },
      { value: "story", label: "Story — opens with a moment" },
      { value: "short", label: "Short — under 8 words, punchy" },
    ],
  },
];

function extractHookFields(text: string): Record<string, string> {
  const lower = text.toLowerCase();

  // Product title: before "for" or "that" or whole thing
  const productMatch =
    text.match(/(?:hooks? for a?n?\s+|about a?n?\s+|for my\s+)([A-Za-z][\w\s,'-]{3,50}?)(?:\s+for|\s+that|\s+targeting|\s+to |\.| — |,|$)/i)?.[1]?.trim() ??
    text.match(/^([A-Za-z][\w\s,'-]{3,40}?)(?:\s+for|\s+that|\.| — |,|$)/i)?.[1]?.trim() ??
    text.trim().split(/\s+/).slice(0, 5).join(" ");

  // Description: after " — " or "who"
  const descMatch =
    text.match(/—\s+([a-zA-Z][\w\s,'-]{5,80}?)(?:\.|,|$)/i)?.[1]?.trim() ??
    text.match(/who\s+([a-zA-Z][\w\s,'-]{5,80}?)(?:\.|,|$)/i)?.[1]?.trim() ?? "";

  // Hook type
  let hookType = "all";
  if (/\b(curiosity|wonder|secret|they don'?t want|don'?t know)\b/.test(lower)) hookType = "curiosity";
  else if (/\b(pain|hurt|hate|struggling|can'?t|fail|frustrat|broke|stuck)\b/.test(lower)) hookType = "pain";
  else if (/\b(story|storytell|personal|real life|journey|moment|when I)\b/.test(lower)) hookType = "story";
  else if (/\b(short|quick|punchy|under|brief|simple|fast)\b/.test(lower)) hookType = "short";
  else if (/\b(all|every|each|different|multiple|variety|types?)\b/.test(lower)) hookType = "all";

  return {
    productTitle: productMatch?.replace(/[.,!?]+$/, "").trim() ?? "",
    description: descMatch.replace(/[.,!?]+$/, "").trim(),
    hookType,
  };
}

const HOOK_COLORS: Record<string, string> = {
  curiosity: "border-purple-400/30 bg-purple-400/5 hover:border-purple-400/50",
  pain: "border-red-400/30 bg-red-400/5 hover:border-red-400/50",
  story: "border-blue-400/30 bg-blue-400/5 hover:border-blue-400/50",
  short: "border-orange-400/30 bg-orange-400/5 hover:border-orange-400/50",
};

const HOOK_BADGE_COLORS: Record<string, string> = {
  curiosity: "bg-purple-400/15 text-purple-400 border-0",
  pain: "bg-red-400/15 text-red-400 border-0",
  story: "bg-blue-400/15 text-blue-400 border-0",
  short: "bg-orange-400/15 text-orange-400 border-0",
};

export default function ViralHooks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const generateHooks = useGenerateViralHooks();
  const saveHooks = useSaveHooks();
  const [filterType, setFilterType] = useState<string>("all");
  const [saved, setSaved] = useState(false);
  const [lastValues, setLastValues] = useState<Record<string, string>>({});

  const handleGenerate = (values: Record<string, string>) => {
    setSaved(false);
    setLastValues(values);
    setFilterType("all");
    generateHooks.mutate({
      data: {
        productTitle: values.productTitle,
        description: values.description,
        hookType: values.hookType as "all" | "curiosity" | "pain" | "story" | "short",
      }
    }, {
      onSuccess: () => {},
      onError: () => toast({ title: "Couldn't generate hooks — try again.", variant: "destructive" }),
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const handleSave = () => {
    const hooksData = generateHooks.data;
    if (!hooksData) return;
    saveHooks.mutate(
      { data: { productTitle: lastValues.productTitle ?? "", hookType: lastValues.hookType ?? "all", data: hooksData as any } },
      {
        onSuccess: () => {
          setSaved(true);
          toast({ title: "Hooks saved to Asset Command Center" });
          queryClient.invalidateQueries({ queryKey: getGetSavedHooksQueryKey() });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const hooksData = generateHooks.data;
  const hooks = hooksData?.hooks ?? [];
  const filteredHooks = filterType === "all" ? hooks : hooks.filter(h => h.type === filterType);

  const groupedByType = (hs: typeof filteredHooks) => {
    const groups: Record<string, typeof hs> = {};
    hs.forEach(h => {
      if (!groups[h.type]) groups[h.type] = [];
      groups[h.type].push(h);
    });
    return groups;
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[300px] shrink-0 md:sticky md:top-8">
            <AIInput
              title="Viral Hooks"
              subtitle="Describe your product and who it's for. SPARK writes scroll-stopping openers built for attention."
              placeholder={`e.g. "Pain hooks for a fitness guide for moms who can't lose weight after having kids"`}
              examples={EXAMPLES}
              fields={FIELDS}
              extract={extractHookFields}
              onGenerate={handleGenerate}
              loading={generateHooks.isPending}
              ctaLabel="Generate Hooks"
              ctaIcon={<Flame className="h-4 w-4" />}
            />
          </div>

          <div className="flex-1 min-w-0">
            {generateHooks.isPending ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 w-full bg-muted/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : hooks.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {["all", ...Object.keys(groupedByType(hooks))].filter((v, i, a) => a.indexOf(v) === i).map(type => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                          filterType === type
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                        }`}
                      >
                        {type === "all"
                          ? `All (${hooks.length})`
                          : `${type.charAt(0).toUpperCase() + type.slice(1)} (${groupedByType(hooks)[type]?.length || 0})`}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant={saved ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleSave}
                    disabled={saveHooks.isPending || saved}
                    className={saved ? "text-green-400 border-green-400/30 shrink-0" : "shrink-0"}
                  >
                    {saved ? <Check className="h-3.5 w-3.5 mr-2 text-green-400" /> : <Bookmark className="h-3.5 w-3.5 mr-2" />}
                    {saved ? "Saved" : saveHooks.isPending ? "Saving…" : "Save Hooks"}
                  </Button>
                </div>

                {Object.entries(groupedByType(filteredHooks)).map(([type, typeHooks]) => (
                  <div key={type} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold uppercase tracking-wider ${HOOK_BADGE_COLORS[type]?.split(" ")[1] || "text-foreground"}`}>
                        {type}
                      </span>
                      <span className="text-xs text-muted-foreground">({typeHooks.length} hooks)</span>
                    </div>
                    {typeHooks.map((hook, i) => (
                      <Card key={i} className={`border transition-all duration-200 cursor-default ${HOOK_COLORS[hook.type] || "border-border/50"}`}>
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-base font-medium leading-snug">{hook.text}</p>
                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${HOOK_BADGE_COLORS[hook.type] || ""}`}>
                                {hook.type}
                              </span>
                              {hook.angle}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopy(hook.text)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors shrink-0"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}

                <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row gap-3 items-center">
                  <p className="text-sm text-muted-foreground sm:mr-auto">Use a hook in your content:</p>
                  <Link href="/scripts" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full group/btn" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Write a Script
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-[420px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-14 w-14 rounded-full bg-orange-400/10 flex items-center justify-center mb-4">
                  <Flame className="h-7 w-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe your offer</h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  Tell SPARK what you're promoting and who it's for. Just talk — no forms to fill.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
