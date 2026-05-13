import { Layout } from "@/components/layout";
import { AIInput, type AIField } from "@/components/ai-input";
import { useGenerateBrand, useSaveBrand, getGetSavedBrandsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Copy, ArrowRight, ShoppingBag, Users, Bookmark, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const EXAMPLES = [
  "A premium fitness brand for busy moms who want to feel strong without sacrificing family time",
  "A bold personal finance brand for Gen Z freelancers who are tired of broke culture",
  "A playful meal prep brand for college students who hate cooking but love eating well",
  "A professional coaching brand for teachers who want to turn their expertise into online income",
  "A minimalist productivity brand for creators who are overwhelmed by too many tools",
];

const FIELDS: AIField[] = [
  { key: "niche", label: "Market niche", emoji: "🎯", value: "" },
  { key: "productConcept", label: "What you sell", emoji: "📦", value: "" },
  { key: "targetAudience", label: "Target audience", emoji: "👥", value: "" },
  {
    key: "tonePreference",
    label: "Brand tone",
    emoji: "🎨",
    value: "bold",
    options: [
      { value: "bold", label: "Bold & Disruptive" },
      { value: "friendly", label: "Friendly & Warm" },
      { value: "premium", label: "Premium & Refined" },
      { value: "playful", label: "Playful & Fun" },
      { value: "professional", label: "Professional & Trustworthy" },
    ],
  },
];

function extractBrandFields(text: string): Record<string, string> {
  const lower = text.toLowerCase();

  // Niche: first core topic
  const nicheMatch =
    text.match(/\b(?:fitness|finance|food|meal|cooking|productivity|coaching|creator|fashion|tech|wellness|health|beauty|pet|dog|travel|education|parenting)\b/i)?.[0] ??
    text.trim().split(/\s+/).slice(0, 3).join(" ");

  // Audience: after "for"
  const audMatch =
    text.match(/\b(?:for|helping|targeting)\s+([a-zA-Z][\w\s,'-]{3,50}?)(?:\s+who|\s+that|\s+to|\.|,|$)/i)?.[1]?.trim() ?? "";

  // Product concept: main thing sold
  const productMatch =
    text.match(/(?:brand for |brand that |course |guide |system |program |tool |platform )([a-zA-Z][\w\s,'-]{3,50}?)(?:\s+for|\s+that|\.|,|$)/i)?.[1]?.trim() ??
    text.trim().split(/\s+/).slice(1, 6).join(" ");

  // Tone detection
  let tonePreference = "bold";
  if (/\b(premium|luxury|elevated|refined|exclusive|elegant)\b/.test(lower)) tonePreference = "premium";
  else if (/\b(friendly|warm|approachable|kind|caring|cozy)\b/.test(lower)) tonePreference = "friendly";
  else if (/\b(playful|fun|energetic|quirky|witty|light)\b/.test(lower)) tonePreference = "playful";
  else if (/\b(professional|trusted|credible|authoritative|serious|expert)\b/.test(lower)) tonePreference = "professional";
  else if (/\b(bold|disruptive|edgy|strong|powerful|fearless)\b/.test(lower)) tonePreference = "bold";

  return {
    niche: nicheMatch?.replace(/[.,!?]+$/, "").trim() ?? "",
    productConcept: productMatch?.replace(/[.,!?]+$/, "").trim() ?? "",
    targetAudience: audMatch?.replace(/[.,!?]+$/, "").trim() ?? "",
    tonePreference,
  };
}

export default function BrandBuilder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const generateBrand = useGenerateBrand();
  const saveBrand = useSaveBrand();
  const [saved, setSaved] = useState(false);
  const [lastValues, setLastValues] = useState<Record<string, string>>({});

  const handleGenerate = (values: Record<string, string>) => {
    setSaved(false);
    setLastValues(values);
    generateBrand.mutate({
      data: {
        niche: values.niche,
        productConcept: values.productConcept,
        targetAudience: values.targetAudience,
        tonePreference: values.tonePreference as "bold" | "friendly" | "premium" | "playful" | "professional",
      }
    }, {
      onSuccess: () => toast({ title: "Brand identity generated!" }),
      onError: () => toast({ title: "Failed to generate brand", variant: "destructive" }),
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!" });
  };

  const handleSave = () => {
    const brand = generateBrand.data;
    if (!brand) return;
    saveBrand.mutate(
      { data: { niche: lastValues.niche ?? "", brandName: brand.brandName, slogan: brand.slogan, data: brand as any } },
      {
        onSuccess: () => {
          setSaved(true);
          toast({ title: "Brand saved to Asset Command Center" });
          queryClient.invalidateQueries({ queryKey: getGetSavedBrandsQueryKey() });
        },
        onError: () => toast({ title: "Failed to save brand", variant: "destructive" }),
      }
    );
  };

  const brand = generateBrand.data;

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[300px] shrink-0 md:sticky md:top-8">
            <AIInput
              title="Brand Builder"
              subtitle="Describe your niche and who you help. SPARK generates a complete brand identity — name, colors, voice, and positioning."
              placeholder={`e.g. "A premium fitness brand for busy moms who want to feel strong without going to the gym"`}
              examples={EXAMPLES}
              fields={FIELDS}
              extract={extractBrandFields}
              onGenerate={handleGenerate}
              loading={generateBrand.isPending}
              ctaLabel="Generate Brand"
              ctaIcon={<Palette className="h-4 w-4" />}
            />
          </div>

          <div className="flex-1 min-w-0">
            {generateBrand.isPending ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 w-full bg-muted/30 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : brand ? (
              <div className="space-y-5">
                <Card className="border-border/50 overflow-hidden">
                  <div className="h-1 w-full" style={{ background: brand.colors?.[0]?.hex || "#84cc16" }} />
                  <CardHeader className="text-center pb-6 pt-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Your Brand</p>
                    <h2 className="text-5xl font-black tracking-tight">{brand.brandName}</h2>
                    <p className="text-lg text-foreground/90 font-medium mt-2">{brand.slogan}</p>
                    <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">{brand.tagline}</p>
                  </CardHeader>
                  <div className="flex items-center justify-center gap-3 pb-6">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(`${brand.brandName}\n${brand.slogan}\n\n${brand.tagline}`)}>
                      <Copy className="h-4 w-4 mr-2" /> Copy Brand Details
                    </Button>
                    <Button
                      variant={saved ? "secondary" : "outline"}
                      size="sm"
                      onClick={handleSave}
                      disabled={saveBrand.isPending || saved}
                      className={saved ? "text-green-400 border-green-400/30" : ""}
                    >
                      {saved ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Bookmark className="h-4 w-4 mr-2" />}
                      {saved ? "Saved" : saveBrand.isPending ? "Saving…" : "Save Brand"}
                    </Button>
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Brand Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {brand.colors?.map((color, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg border border-border/50 shrink-0 shadow-sm" style={{ backgroundColor: color.hex }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{color.name}</span>
                              <code className="text-xs text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{color.hex}</code>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{color.usage}</p>
                          </div>
                          <button onClick={() => handleCopy(color.hex)} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Brand Voice</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tone</p>
                        <p className="text-sm">{brand.toneDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Voice</p>
                        <p className="text-sm">{brand.brandVoice}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-border/50">
                  <CardContent className="p-5 grid md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Target Persona
                      </p>
                      <p className="text-sm leading-relaxed">{brand.targetPersona}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Naming Rationale</p>
                      <p className="text-sm leading-relaxed">{brand.namingRationale}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="border-t border-border/40 pt-4 flex flex-col sm:flex-row gap-3 items-center">
                  <p className="text-sm text-muted-foreground sm:mr-auto">Next step:</p>
                  <Link href="/campaigns" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full group/btn" size="sm">
                      <ArrowRight className="h-4 w-4 mr-2" /> Launch Campaign
                    </Button>
                  </Link>
                  <Link href="/storefronts" className="w-full sm:w-auto">
                    <Button className="w-full group/btn" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" /> Launch Storefront
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-purple-400/10 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe your brand vision</h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  Tell SPARK your niche and who you help. It builds the full brand identity from a single prompt.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
