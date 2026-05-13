import { Layout } from "@/components/layout";
import { AIInput, type AIField } from "@/components/ai-input";
import { useGenerateTikTokScript, useSaveScript, getGetSavedScriptsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Hash, Copy, Activity, ShoppingBag, ArrowRight, Bookmark, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EXAMPLES = [
  "TikTok scripts for a 30-day fitness transformation guide for busy moms",
  "Shocking hook scripts for a budgeting app targeting college students who are always broke",
  "Storytelling scripts for a dog training course — dogs who won't stop barking",
  "Educational scripts for a freelance designer course — how to triple your rates",
  "Transformation scripts for a meal prep system for families who hate cooking",
];

const getParam = (key: string) =>
  new URLSearchParams(window.location.search).get(key) ?? "";

const FIELDS: AIField[] = [
  { key: "productTitle", label: "Product / offer", emoji: "📦", value: getParam("title") },
  { key: "productDescription", label: "Key selling point", emoji: "✨", value: getParam("desc") },
  { key: "targetAudience", label: "Audience", emoji: "👥", value: getParam("aud") },
  {
    key: "style",
    label: "Video style",
    emoji: "🎬",
    value: "shocking",
    options: [
      { value: "shocking", label: "Shocking Hook — highest attention" },
      { value: "educational", label: "Educational — highest trust" },
      { value: "storytelling", label: "Storytelling — highest retention" },
      { value: "transformation", label: "Transformation — highest desire" },
    ],
  },
];

function extractScriptsFields(text: string): Record<string, string> {
  const lower = text.toLowerCase();

  // Product title: "for a [X]" or "about [X]" or first chunk
  const productMatch =
    text.match(/(?:for a?n?\s+|about a?n?\s+|creating\s+|selling\s+)([A-Za-z][\w\s,'-]{3,50}?)(?:\s+for|\s+that|\s+targeting|\s+to |\.| — |,|$)/i)?.[1]?.trim() ??
    text.trim().split(/\s+/).slice(0, 5).join(" ");

  // Audience: after "for", "targeting", "helping"
  const audMatch =
    text.match(/\b(?:for|targeting|helping|aimed at)\s+([a-zA-Z][\w\s,'-]{3,50}?)(?:\s+who|\s+that|\s+to|\.|,|$)/i)?.[1]?.trim() ?? "";

  // Description: after "who" or extract pain/selling point
  const descMatch =
    text.match(/who\s+([a-zA-Z][\w\s,'-]{5,80}?)(?:\.|,|$)/i)?.[1]?.trim() ??
    text.match(/—\s+([a-zA-Z][\w\s,'-]{5,80}?)(?:\.|,|$)/i)?.[1]?.trim() ?? "";

  // Style detection
  let style = "shocking";
  if (/\b(educational|teach|learn|how to|value|tip)\b/.test(lower)) style = "educational";
  else if (/\b(story|storytell|moment|personal|real|journey)\b/.test(lower)) style = "storytelling";
  else if (/\b(transform|before.*after|result|glow.?up|change)\b/.test(lower)) style = "transformation";
  else if (/\b(shocking|viral|hook|attention|stop|scroll)\b/.test(lower)) style = "shocking";

  return {
    productTitle: productMatch.replace(/[.,!?]+$/, "").trim(),
    productDescription: descMatch.replace(/[.,!?]+$/, "").trim(),
    targetAudience: audMatch.replace(/[.,!?]+$/, "").trim(),
    style,
  };
}

function getScoreColor(score: number) {
  if (score >= 85) return "text-green-500 bg-green-500/10 border-green-500/20";
  if (score >= 70) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
  return "text-primary bg-primary/10 border-primary/20";
}

export default function Scripts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const generateScripts = useGenerateTikTokScript();
  const saveScript = useSaveScript();
  const [saved, setSaved] = useState(false);
  const [lastValues, setLastValues] = useState<Record<string, string>>({});

  // Pre-populate if coming from another page
  const initialPrompt = getParam("title")
    ? `${getParam("title")}${getParam("desc") ? " — " + getParam("desc") : ""}${getParam("aud") ? " for " + getParam("aud") : ""}`
    : "";

  const handleGenerate = (values: Record<string, string>) => {
    setSaved(false);
    setLastValues(values);
    generateScripts.mutate({
      data: {
        productTitle: values.productTitle,
        productDescription: values.productDescription,
        targetAudience: values.targetAudience,
        style: values.style as "educational" | "storytelling" | "shocking" | "transformation",
      }
    }, {
      onSuccess: () => {},
      onError: () => toast({ title: "Couldn't generate scripts — try again.", variant: "destructive" }),
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const handleSave = () => {
    const scriptsData = generateScripts.data;
    if (!scriptsData) return;
    saveScript.mutate(
      { data: { productTitle: lastValues.productTitle ?? "", style: lastValues.style ?? "shocking", data: scriptsData as any } },
      {
        onSuccess: () => {
          setSaved(true);
          toast({ title: "Scripts saved to Asset Command Center" });
          queryClient.invalidateQueries({ queryKey: getGetSavedScriptsQueryKey() });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const scriptsData = generateScripts.data;

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[300px] shrink-0 md:sticky md:top-8">
            <AIInput
              title="TikTok Scripts"
              subtitle="Tell SPARK about your product and audience. It writes scripts engineered for TikTok retention and conversion."
              placeholder={`e.g. "Shocking hook scripts for my 30-day fitness guide for busy moms who can't stick to a routine"`}
              examples={EXAMPLES}
              fields={FIELDS}
              extract={extractScriptsFields}
              onGenerate={handleGenerate}
              loading={generateScripts.isPending}
              ctaLabel="Generate Scripts"
              ctaIcon={<Video className="h-4 w-4" />}
              initialPrompt={initialPrompt}
            />
          </div>

          <div className="w-full md:w-2/3">
            {generateScripts.isPending ? (
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <Card key={i} className="opacity-50">
                    <CardHeader>
                      <div className="h-6 w-1/4 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : scriptsData && scriptsData.scripts.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{scriptsData.scripts.length} scripts generated</p>
                  <Button
                    variant={saved ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleSave}
                    disabled={saveScript.isPending || saved}
                    className={saved ? "text-green-400 border-green-400/30" : ""}
                  >
                    {saved ? <Check className="h-3.5 w-3.5 mr-2 text-green-400" /> : <Bookmark className="h-3.5 w-3.5 mr-2" />}
                    {saved ? "Saved" : saveScript.isPending ? "Saving…" : "Save All Scripts"}
                  </Button>
                </div>

                {scriptsData.scripts.map((script, i) => (
                  <Card key={i} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="bg-secondary/10 pb-4 border-b border-border/50">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 w-full">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            First 3 Seconds
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold leading-tight">{script.hook}</h3>
                        </div>
                        <Badge variant="outline" className={`shrink-0 border ${getScoreColor(script.estimatedViralScore)}`}>
                          <Activity className="h-3 w-3 mr-1" />
                          {script.estimatedViralScore}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Full Script</h4>
                          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleCopy(script.script)}>
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <div className="p-4 rounded-xl bg-card border border-border/50 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {script.script}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                            <Hash className="h-4 w-4 mr-1" /> Caption
                          </h4>
                          <p className="text-sm p-3 rounded-lg bg-secondary/20">{script.caption}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                            <Hash className="h-4 w-4 mr-1" /> Hashtags
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {script.hashtags.map(tag => (
                              <Badge key={tag} variant="secondary" className="font-mono text-xs bg-secondary/50">
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {i === 0 && (
                      <CardFooter className="border-t border-border/40 bg-card p-4 flex flex-col sm:flex-row gap-3 items-center">
                        <p className="text-sm text-muted-foreground sm:mr-auto">Ready to sell?</p>
                        <Link href="/storefronts" className="w-full sm:w-auto">
                          <Button className="w-full group/btn" size="sm">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Launch Product
                            <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                          </Button>
                        </Link>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-[420px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe your product</h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  Tell SPARK about your offer and audience. No forms — just say it naturally.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
