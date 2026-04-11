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
import { Loader2, Sparkles, TrendingUp, Users, Target, Save, Check, Package, ArrowRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const formSchema = z.object({
  niche: z.string().min(2, "Niche is required").max(100),
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
    defaultValues: { niche: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSavedIndices(new Set());
    setNicheUsed(values.niche);
    generateIdeas.mutate({ data: { niche: values.niche, count: 4 } }, {
      onSuccess: (data) => {
        setIdeas(data.ideas);
        toast({ title: "Ideas generated successfully!" });
      },
      onError: () => {
        toast({ title: "Failed to generate ideas", variant: "destructive" });
      }
    });
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
        problemSolved: idea.problemSolved
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

  const getBundleLink = (idea: ProductIdea) =>
    `/bundle?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || "")}`;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 md:sticky md:top-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Idea Generator</h1>
                <p className="text-muted-foreground mt-2">
                  Input a broad niche. We'll find specific, high-leverage product opportunities.
                </p>
              </div>

              <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="niche"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">Market Niche</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. productivity, fitness, dog owners" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={generateIdeas.isPending}>
                        {generateIdeas.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Opportunities
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full md:w-2/3">
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
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">{idea.title}</CardTitle>
                          <CardDescription className="mt-2 text-base text-foreground/80">{idea.description}</CardDescription>
                        </div>
                        <Button
                          variant={savedIndices.has(i) ? "secondary" : "outline"}
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleSave(idea, i)}
                          disabled={savedIndices.has(i) || saveIdea.isPending}
                        >
                          {savedIndices.has(i) ? <Check className="h-4 w-4 mr-2 text-primary" /> : <Save className="h-4 w-4 mr-2" />}
                          {savedIndices.has(i) ? "Saved" : "Save"}
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2 bg-secondary/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm font-medium text-muted-foreground">
                            <TrendingUp className="h-4 w-4 mr-1" /> Demand
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(idea.demandScore)}`}>{idea.demandScore}/100</div>
                        </div>
                        <div className="space-y-2 bg-secondary/30 p-3 rounded-lg">
                          <div className="flex items-center text-sm font-medium text-muted-foreground">
                            <Target className="h-4 w-4 mr-1" /> Competition
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(100 - idea.competitionScore)}`}>{idea.competitionScore}/100</div>
                        </div>
                        <div className="space-y-2 bg-secondary/30 p-3 rounded-lg col-span-2">
                          <div className="text-sm font-medium text-muted-foreground mb-1">Profit Potential</div>
                          <div className="text-lg font-semibold">{idea.profitPotential}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                            <Users className="h-4 w-4 mr-2" /> Target Audience
                          </h4>
                          <p className="text-sm">{idea.targetAudience}</p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                            <Target className="h-4 w-4 mr-2" /> Problem Solved
                          </h4>
                          <p className="text-sm">{idea.problemSolved}</p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="outline" className="bg-background">Saturation: {idea.saturationLevel}</Badge>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-4 border-t border-border/40 bg-secondary/10 flex gap-2 flex-wrap">
                      <Link href={getBundleLink(idea)} className="flex-1 min-w-[140px]">
                        <Button className="w-full group/btn" size="sm">
                          <Package className="h-4 w-4 mr-2" />
                          Build Offer
                          <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </Button>
                      </Link>
                      <Link href={`/scripts?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || "")}`} className="flex-1 min-w-[140px]">
                        <Button variant="outline" className="w-full group/btn" size="sm">
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
                <p className="text-muted-foreground max-w-sm">
                  Enter a niche on the left to uncover high-potential product concepts tailored to market gaps.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
