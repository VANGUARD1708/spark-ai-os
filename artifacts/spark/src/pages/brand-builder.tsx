import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateBrand, useSaveBrand, getGetSavedBrandsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Palette, Copy, ArrowRight, ShoppingBag, Users, Bookmark, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  niche: z.string().min(2, "Niche is required").max(100),
  productConcept: z.string().min(5, "Product concept is required").max(300),
  targetAudience: z.string().max(100).optional(),
  tonePreference: z.enum(["bold", "friendly", "premium", "playful", "professional"] as const),
});

const TONE_OPTIONS = [
  { value: "bold", label: "Bold & Disruptive", desc: "Strong, direct, unapologetic" },
  { value: "friendly", label: "Friendly & Warm", desc: "Approachable, conversational" },
  { value: "premium", label: "Premium & Refined", desc: "Elevated, exclusive, polished" },
  { value: "playful", label: "Playful & Fun", desc: "Light, energetic, personality-driven" },
  { value: "professional", label: "Professional & Trustworthy", desc: "Credible, authoritative, reliable" },
];

export default function BrandBuilder() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const generateBrand = useGenerateBrand();
  const saveBrand = useSaveBrand();
  const [saved, setSaved] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { niche: "", productConcept: "", targetAudience: "", tonePreference: "bold" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSaved(false);
    generateBrand.mutate({ data: values }, {
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
      {
        data: {
          niche: form.getValues("niche"),
          brandName: brand.brandName,
          slogan: brand.slogan,
          data: brand as any,
        }
      },
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
          <div className="w-full md:w-[280px] shrink-0 md:sticky md:top-8 space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Brand Builder</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Generate a complete brand identity — name, slogan, colors, and voice — from a single prompt.
              </p>
            </div>

            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardContent className="pt-5 pb-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="niche"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">Market Niche</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. fitness, productivity, finance" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productConcept"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">What You Sell</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. digital workout programs for busy moms" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">Target Audience (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. working moms 28-45" {...field} className="bg-background" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tonePreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">Brand Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TONE_OPTIONS.map(t => (
                                <SelectItem key={t.value} value={t.value}>
                                  <div>
                                    <div className="font-medium">{t.label}</div>
                                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={generateBrand.isPending}>
                      {generateBrand.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
                      Generate Brand
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
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
                    <CardTitle className="text-5xl font-black tracking-tight">{brand.brandName}</CardTitle>
                    <CardDescription className="text-lg text-foreground/90 font-medium mt-2">{brand.slogan}</CardDescription>
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
                          <div
                            className="h-10 w-10 rounded-lg border border-border/50 shrink-0 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
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
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Launch Campaign
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/storefronts" className="w-full sm:w-auto">
                    <Button className="w-full group/btn" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Launch Storefront
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-purple-400/10 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No brand generated yet</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Tell us your niche and what you sell. We'll create a full brand identity ready to launch.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
