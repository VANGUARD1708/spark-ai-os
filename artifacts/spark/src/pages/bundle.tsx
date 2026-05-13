import { Layout } from "@/components/layout";
import { AIInput, type AIField } from "@/components/ai-input";
import { useGenerateBundle, useSaveBundle, getGetSavedBundlesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, CheckCircle2, ArrowRight, Video, ShoppingBag, Check, Bookmark } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

const EXAMPLES = [
  "A 30-day fitness transformation guide for busy moms who want to lose weight without going to the gym",
  "A budgeting system for college students who are always broke and don't know where their money goes",
  "A dog training course for owners whose dogs won't stop barking and destroying furniture",
  "A freelance design course for graphic designers who charge $20/hr and want to 10x their rates",
  "A content creation starter kit for teachers who want to build a side income over summer break",
];

const getParam = (key: string) =>
  new URLSearchParams(window.location.search).get(key) ?? "";

const FIELDS: AIField[] = [
  { key: "productTitle", label: "Product name", emoji: "📦", value: getParam("title") },
  { key: "productDescription", label: "Description / hook", emoji: "✨", value: getParam("desc") },
  { key: "targetAudience", label: "Audience", emoji: "👥", value: getParam("aud") },
  {
    key: "angle",
    label: "Offer angle",
    emoji: "🎯",
    value: "transformation",
    options: [
      { value: "transformation", label: "Transformation — where they want to be" },
      { value: "pain", label: "Pain — what they want to escape" },
      { value: "desire", label: "Desire — what they want to achieve" },
    ],
  },
];

function extractBundleFields(text: string): Record<string, string> {
  const lower = text.toLowerCase();

  // Product title
  const productMatch =
    text.match(/^(?:A\s+)?([A-Za-z][\w\s,'-]{3,50}?)(?:\s+for|\s+that|\s+helping|\s+about|\.| — |,|$)/i)?.[1]?.trim() ??
    text.trim().split(/\s+/).slice(0, 5).join(" ");

  // Audience
  const audMatch =
    text.match(/\b(?:for|helping|targeting|aimed at)\s+([a-zA-Z][\w\s,'-]{3,50}?)(?:\s+who|\s+that|\s+to|\.|,|$)/i)?.[1]?.trim() ?? "";

  // Description: after "who" or "—"
  const descMatch =
    text.match(/who\s+([a-zA-Z][\w\s,'-]{5,80}?)(?:\.|,|$)/i)?.[1]?.trim() ??
    text.match(/—\s+([a-zA-Z][\w\s,'-]{5,80}?)(?:\.|,|$)/i)?.[1]?.trim() ?? "";

  // Angle
  let angle = "transformation";
  if (/\b(pain|escape|stop|hate|never|struggle|frustrat|broke|stuck|can'?t)\b/.test(lower)) angle = "pain";
  else if (/\b(desire|dream|want|achieve|goal|aspire|success|earn|rich)\b/.test(lower)) angle = "desire";
  else if (/\b(transform|before.*after|change|glow.?up|journey|result|from.*to)\b/.test(lower)) angle = "transformation";

  return {
    productTitle: productMatch?.replace(/^A\s+/i, "").replace(/[.,!?]+$/, "").trim() ?? "",
    productDescription: descMatch.replace(/[.,!?]+$/, "").trim(),
    targetAudience: audMatch.replace(/[.,!?]+$/, "").trim(),
    angle,
  };
}

export default function Bundle() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const generateBundle = useGenerateBundle();
  const saveBundle = useSaveBundle();
  const [saved, setSaved] = useState(false);
  const [lastValues, setLastValues] = useState<Record<string, string>>({});

  const initialPrompt = getParam("title")
    ? `${getParam("title")}${getParam("desc") ? " — " + getParam("desc") : ""}${getParam("aud") ? " for " + getParam("aud") : ""}`
    : "";

  const handleGenerate = (values: Record<string, string>) => {
    setSaved(false);
    setLastValues(values);
    generateBundle.mutate({
      data: {
        productTitle: values.productTitle,
        productDescription: values.productDescription,
        targetAudience: values.targetAudience,
        angle: values.angle as "pain" | "desire" | "transformation",
      }
    }, {
      onSuccess: () => toast({ title: "Bundle generated!" }),
      onError: () => toast({ title: "Couldn't generate bundle — try again.", variant: "destructive" }),
    });
  };

  const handleSave = () => {
    const bundle = generateBundle.data;
    if (!bundle) return;
    saveBundle.mutate(
      {
        data: {
          productTitle: lastValues.productTitle ?? "",
          offerName: bundle.offerName,
          headline: bundle.headline,
          price: bundle.price,
          data: bundle as any,
        }
      },
      {
        onSuccess: () => {
          setSaved(true);
          toast({ title: "Bundle saved to Asset Command Center" });
          queryClient.invalidateQueries({ queryKey: getGetSavedBundlesQueryKey() });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const bundle = generateBundle.data;

  const scriptsLink = lastValues.productTitle
    ? `/scripts?title=${encodeURIComponent(lastValues.productTitle)}&desc=${encodeURIComponent(lastValues.productDescription ?? "")}&aud=${encodeURIComponent(lastValues.targetAudience ?? "")}`
    : "/scripts";

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[300px] shrink-0 md:sticky md:top-8">
            <AIInput
              title="Bundle Builder"
              subtitle="Describe your product and audience. SPARK turns it into an irresistible offer with bonuses, pricing, and a headline."
              placeholder={`e.g. "A 30-day fitness guide for busy moms who want to lose weight without going to the gym"`}
              examples={EXAMPLES}
              fields={FIELDS}
              extract={extractBundleFields}
              onGenerate={handleGenerate}
              loading={generateBundle.isPending}
              ctaLabel="Build Offer Bundle"
              ctaIcon={<Package className="h-4 w-4" />}
              initialPrompt={initialPrompt}
            />
          </div>

          <div className="w-full md:w-2/3">
            {generateBundle.isPending ? (
              <Card className="opacity-50">
                <CardHeader>
                  <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-1/2 bg-muted rounded animate-pulse mt-4" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                  <div className="h-12 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ) : bundle ? (
              <Card className="overflow-hidden border-border/50 border-t-primary/50 border-t-4 transition-all duration-300">
                <CardHeader className="text-center pb-8 border-b border-border/50 bg-secondary/10">
                  <Badge className="mx-auto mb-4 bg-primary/20 text-primary hover:bg-primary/30">{bundle.offerName}</Badge>
                  <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance leading-tight">
                    {bundle.headline}
                  </CardTitle>
                  <CardDescription className="text-xl mt-4 text-foreground/80 max-w-2xl mx-auto">
                    {bundle.subheadline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="p-6 md:p-8 bg-card">
                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      The Core System
                    </h3>
                    <div className="p-6 rounded-xl bg-secondary/30 border border-border/50">
                      <p className="text-lg">{bundle.coreProduct}</p>
                    </div>

                    <h3 className="text-2xl font-bold mt-10 mb-6 flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      Value Stack Bonuses
                    </h3>
                    <div className="grid gap-4">
                      {bundle.bonuses.map((bonus, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-border/50 bg-background relative overflow-hidden group hover:border-primary/30 transition-colors">
                          <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 text-xs font-bold rounded-bl-lg">
                            Value: {bonus.value}
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                              <h4 className="font-bold text-lg">{bonus.name}</h4>
                            </div>
                            <p className="text-muted-foreground text-sm pl-7">{bonus.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-2xl font-bold mt-10 mb-6 flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      Why It Works
                    </h3>
                    <ul className="space-y-3">
                      {bundle.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                          <span className="text-lg">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 md:p-8 bg-secondary/20 border-t border-border/50 text-center">
                    <div className="inline-block px-4 py-2 rounded-full bg-background border border-border/50 text-sm font-medium mb-6">
                      {bundle.guarantee}
                    </div>
                    <div className="flex flex-col items-center justify-center mb-8">
                      <div className="text-muted-foreground line-through text-2xl mb-1">{bundle.strikethroughPrice}</div>
                      <div className="text-6xl font-black text-primary drop-shadow-sm">{bundle.price}</div>
                    </div>
                    <Button size="lg" className="w-full md:w-auto text-lg h-14 px-12 font-bold animate-in zoom-in duration-500 delay-300">
                      {bundle.callToAction} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/40 bg-card p-5 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant={saved ? "secondary" : "outline"}
                    size="sm"
                    onClick={handleSave}
                    disabled={saveBundle.isPending || saved}
                    className={saved ? "text-green-400 border-green-400/30" : ""}
                  >
                    {saved ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Bookmark className="h-4 w-4 mr-2" />}
                    {saved ? "Saved" : saveBundle.isPending ? "Saving…" : "Save Bundle"}
                  </Button>
                  <p className="text-sm text-muted-foreground sm:mr-auto hidden sm:block">Next step:</p>
                  <Link href={scriptsLink} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full group/btn" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Create Content
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/storefronts" className="w-full sm:w-auto">
                    <Button className="w-full group/btn" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Launch Product
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Describe your product</h3>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  Tell SPARK what you're selling and who it's for. It builds the entire offer — bonuses, pricing, headline, and CTA.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
