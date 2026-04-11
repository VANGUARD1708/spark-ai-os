import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateIdeas, useSaveIdea, type ProductIdea } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2, Sparkles, TrendingUp, Target, Save, Check, Package,
  ArrowRight, Lightbulb, Copy, RefreshCw, Video, Zap
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const POPULAR_NICHES = [
  "productivity", "fitness", "finance", "parenting",
  "dog training", "real estate", "dropshipping", "mindset",
  "cooking", "meditation", "side hustles", "dating"
];

const AUDIENCE_OPTIONS = [
  { value: "solopreneurs", label: "Solopreneurs" },
  { value: "content creators", label: "Content Creators" },
  { value: "parents", label: "Parents" },
  { value: "students", label: "Students" },
  { value: "professionals", label: "Working Professionals" },
  { value: "beginners", label: "Beginners / Newbies" },
  { value: "fitness enthusiasts", label: "Fitness Enthusiasts" },
  { value: "entrepreneurs", label: "Entrepreneurs" },
  { value: "freelancers", label: "Freelancers" },
  { value: "retirees", label: "Retirees" },
];

const formSchema = z.object({
  niche: z.string().min(2, "Niche is required").max(100),
  audience: z.string().optional(),
  painPoint: z.string().max(200).optional(),
  trendMode: z.boolean().default(false),
});

export default function Ideas() {
  const { toast } = useToast();
  const generateIdeas = useGenerateIdeas();
  const saveIdea = useSaveIdea();
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [nicheUsed, setNicheUsed] = useState("");
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { niche: "", audience: "", painPoint: "", trendMode: false },
  });

  const trendMode = form.watch("trendMode");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSavedIndices(new Set());
    setNicheUsed(values.niche);
    generateIdeas.mutate({ data: { niche: values.niche, audience: values.audience, painPoint: values.painPoint, trendMode: values.trendMode, count: 3 } }, {
      onSuccess: (data) => {
        setIdeas(data.ideas);
        toast({ title: "Ideas generated successfully!" });
      },
      onError: () => {
        toast({ title: "Failed to generate ideas", variant: "destructive" });
      }
    });
  };

  const handleRegenerate = () => {
    form.handleSubmit(onSubmit)();
  };

  const handleSave = (idea: ProductIdea, index: number) => {
    saveIdea.mutate({
      data: {
        title: idea.title,
        description: idea.description,
        niche: nicheUsed,
        demandScore: idea.demandScore,
        competitionScore: idea.competitionScore,
        profitPotential: idea.profitPotential,
        saturationLevel: idea.saturationLevel,
        targetAudience: idea.targetAudience,
        problemSolved: idea.problemSolved,
      }
    }, {
      onSuccess: () => {
        setSavedIndices(prev => new Set(prev).add(index));
        toast({ title: "Idea saved!" });
      },
      onError: () => {
        toast({ title: "Failed to save idea", variant: "destructive" });
      }
    });
  };

  const handleCopy = (idea: ProductIdea) => {
    navigator.clipboard.writeText(`${idea.title}\n\n${idea.description}\n\nTarget: ${idea.targetAudience}\nProblem solved: ${idea.problemSolved}`);
    toast({ title: "Copied to clipboard!" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[280px] shrink-0 md:sticky md:top-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Idea Generator</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Input a niche and we'll find high-leverage product opportunities.
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
                            <FormLabel className="text-foreground text-xs font-semibold uppercase tracking-wider">Market Niche</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. productivity, fitness, dogs" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {POPULAR_NICHES.slice(0, 6).map(n => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => form.setValue("niche", n)}
                                  className="text-[10px] px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border/40"
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider">Target Audience</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background text-sm">
                                  <SelectValue placeholder="Any audience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {AUDIENCE_OPTIONS.map(o => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="painPoint"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold uppercase tracking-wider">Pain Point (optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. no time, too expensive" {...field} className="bg-background text-sm" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="trendMode"
                        render={({ field }) => (
                          <FormItem>
                            <div
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                trendMode
                                  ? "border-primary/50 bg-primary/5"
                                  : "border-border/50 bg-secondary/20 hover:border-border"
                              }`}
                              onClick={() => field.onChange(!field.value)}
                            >
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${trendMode ? "bg-primary/20" : "bg-secondary/50"}`}>
                                <TrendingUp className={`h-4 w-4 ${trendMode ? "text-primary" : "text-muted-foreground"}`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">Trend Mode</p>
                                <p className="text-xs text-muted-foreground">Focus on what's hot right now</p>
                              </div>
                              <div className={`h-5 w-9 rounded-full transition-colors relative ${trendMode ? "bg-primary" : "bg-secondary"}`}>
                                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${trendMode ? "left-4" : "left-0.5"}`} />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={generateIdeas.isPending} size="sm">
                          {generateIdeas.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Generate
                        </Button>
                        {ideas.length > 0 && (
                          <Button type="button" variant="outline" size="sm" onClick={handleRegenerate} disabled={generateIdeas.isPending} className="shrink-0">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
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
                          <div className={`text-2xl font-bold ${getScoreColor(idea.demandScore)}`}>{idea.demandScore}<span className="text-sm opacity-60">/100</span></div>
                        </div>
                        <div className="space-y-1 bg-secondary/30 p-3 rounded-lg">
                          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Target className="h-3.5 w-3.5 mr-1" /> Comp.
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(100 - idea.competitionScore)}`}>{idea.competitionScore}<span className="text-sm opacity-60">/100</span></div>
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
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No ideas yet</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Enter a niche, pick your audience, and hit Generate to uncover high-potential product concepts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
