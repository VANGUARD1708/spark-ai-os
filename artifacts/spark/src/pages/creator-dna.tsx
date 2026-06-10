import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetUserProfile, useGetStats } from "@workspace/api-client-react";
import {
  Brain, Sparkles, Zap, Target, Flame, Video, BookOpen,
  TrendingUp, ArrowRight, Compass, RefreshCw, Dna
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const DNA_TRAITS = [
  { id: "idea-generator", label: "Idea Generator", icon: Sparkles, color: "text-yellow-400", desc: "You generate concepts quickly. Your strength is breadth." },
  { id: "builder", label: "Builder", icon: Zap, color: "text-primary", desc: "You turn ideas into tangible products. Your strength is execution." },
  { id: "storyteller", label: "Storyteller", icon: Video, color: "text-pink-400", desc: "You connect emotionally through content. Your strength is engagement." },
  { id: "analyst", label: "Analyst", icon: TrendingUp, color: "text-blue-400", desc: "You make decisions with data. Your strength is optimization." },
  { id: "teacher", label: "Teacher", icon: BookOpen, color: "text-green-400", desc: "You educate and build authority. Your strength is trust." },
  { id: "performer", label: "Performer", icon: Flame, color: "text-orange-400", desc: "You thrive on stage and camera. Your strength is attention." },
];

export default function CreatorDNA() {
  const { toast } = useToast();
  const { data: profile } = useGetUserProfile();
  const { data: stats } = useGetStats();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const statsAny = stats as any;
  const topTrait = statsAny?.topType === "ideas" ? "idea-generator" :
    statsAny?.topType === "bundle" ? "builder" :
    statsAny?.topType === "scripts" ? "storyteller" :
    statsAny?.topType === "hooks" ? "performer" :
    statsAny?.topType === "brand" ? "teacher" : "idea-generator";

  const primary = DNA_TRAITS.find(t => t.id === topTrait) || DNA_TRAITS[0];
  const secondary = DNA_TRAITS.find(t => t.id !== topTrait) || DNA_TRAITS[1];
  const PrimaryIcon = primary.icon;
  const SecondaryIcon = secondary.icon;

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
      toast({ title: "DNA Analysis Complete", description: "SPARK has mapped your creator personality." });
    }, 2000);
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                <Dna className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Creator DNA</h1>
                <p className="text-sm text-muted-foreground">SPARK analyzes your behavior to reveal your creator archetype.</p>
              </div>
            </div>
          </div>
          <Badge className="bg-purple-400/10 text-purple-400 border-purple-400/20">AI Powered</Badge>
        </div>

        {/* Analysis trigger */}
        {!analyzed && (
          <Card className="border-purple-400/20 bg-purple-400/5">
            <CardContent className="p-6 text-center space-y-4">
              <Brain className="h-12 w-12 text-purple-400 mx-auto" />
              <h3 className="text-lg font-bold">Discover Your Creator DNA</h3>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                SPARK analyzes your generations, saves, and activity to identify your natural strengths. Every creator has a dominant archetype. Know yours to double down on what works.
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-purple-400/20 text-purple-400 hover:bg-purple-400/30 border-purple-400/30"
              >
                {analyzing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                {analyzing ? "Analyzing..." : "Analyze My DNA"}
              </Button>
            </CardContent>
          </Card>
        )}

        {analyzed && (
          <>
            {/* Primary Archetype */}
            <Card className="border-purple-400/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-14 w-14 rounded-xl ${primary.color.replace("text-", "bg-").replace("400", "400/10")} flex items-center justify-center`}>
                    <PrimaryIcon className={`h-7 w-7 ${primary.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Primary Archetype</p>
                    <h2 className="text-xl font-bold">{primary.label}</h2>
                  </div>
                  <Badge className="ml-auto bg-purple-400/10 text-purple-400">{statsAny?.totalGenerations ?? 0} generations analyzed</Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{primary.desc}</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-center">
                    <p className="text-lg font-bold">{statsAny?.totalGenerations ?? 0}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Total Generations</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-center">
                    <p className="text-lg font-bold">{statsAny?.topNiche ?? "General"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Top Niche</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-center">
                    <p className="text-lg font-bold">{statsAny?.topType ?? "Ideas"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Most Used Tool</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary + All Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Secondary Archetype</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${secondary.color.replace("text-", "bg-").replace("400", "400/10")} flex items-center justify-center`}>
                      <SecondaryIcon className={`h-5 w-5 ${secondary.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{secondary.label}</p>
                      <p className="text-xs text-muted-foreground">{secondary.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">DNA Strengths</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Compass className="h-4 w-4 text-primary" />
                    <span>Best platform: {primary.id === "storyteller" || primary.id === "performer" ? "TikTok / Shorts" : primary.id === "teacher" ? "YouTube / Blog" : "All platforms"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-primary" />
                    <span>Content style: {primary.id === "idea-generator" ? "Concept + curiosity" : primary.id === "builder" ? "Process + results" : primary.id === "storyteller" ? "Narrative + emotion" : "Data + proof"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>Monetization path: {primary.id === "builder" ? "Product-first, content supports" : primary.id === "storyteller" ? "Audience-first, monetize later" : "Hybrid approach"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All archetypes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">All Creator Archetypes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DNA_TRAITS.map(t => {
                    const TIcon = t.icon;
                    return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border transition-all ${
                        t.id === primary.id
                          ? "border-purple-400/30 bg-purple-400/10"
                          : t.id === secondary.id
                          ? "border-primary/20 bg-primary/5"
                          : "border-border/30 bg-secondary/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <TIcon className={`h-4 w-4 ${t.color}`} />
                        <span className={`text-xs font-semibold ${t.id === primary.id ? "text-purple-400" : ""}`}>{t.label}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                    </div>
                  );})}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setAnalyzed(false)}>
                <RefreshCw className="h-4 w-4 mr-2" /> Reanalyze
              </Button>
              <Button className="bg-purple-400/20 text-purple-400 hover:bg-purple-400/30 border-purple-400/30">
                <ArrowRight className="h-4 w-4 mr-2" /> Build From This DNA
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
