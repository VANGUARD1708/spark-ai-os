import { Layout } from "@/components/layout";
import { useGetUserProfile, useUpsertUserProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Save, Zap, CheckCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function BusinessProfile() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetUserProfile();
  const upsert = useUpsertUserProfile();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    niche: "",
    audience: "",
    brandVoice: "",
    topProduct: "",
    goals: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        businessName: profile.businessName ?? "",
        niche: profile.niche ?? "",
        audience: profile.audience ?? "",
        brandVoice: profile.brandVoice ?? "",
        topProduct: profile.topProduct ?? "",
        goals: profile.goals ?? "",
      });
    }
  }, [profile]);

  const handleSave = () => {
    setSaved(false);
    upsert.mutate(form, {
      onSuccess: () => {
        setSaved(true);
        toast({ title: "Business memory saved — SPARK will use this context everywhere." });
        setTimeout(() => setSaved(false), 3000);
      },
      onError: () => toast({ title: "Couldn't save profile", variant: "destructive" }),
    });
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const isFilled = Object.values(form).some(v => v.trim() !== "");

  return (
    <Layout>
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in duration-500">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-9 w-9 rounded-xl bg-purple-400/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Business Memory</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Tell SPARK about your business once. It uses this context everywhere — ideas, content, brands, and recommendations become laser-targeted to you.
          </p>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/8 border border-primary/20">
          <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary mb-0.5">How it works</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              SPARK automatically injects your business context into every AI generation. Your niche, audience, and brand voice shape every idea, script, hook, and recommendation you generate — no more filling in the same fields repeatedly.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-muted/30 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Your Business Context</CardTitle>
              <CardDescription className="text-xs">
                Fill in what applies. Leave blank anything you don't need.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Name</Label>
                  <Input
                    placeholder="e.g. FitFlow, Creator Co."
                    value={form.businessName}
                    onChange={set("businessName")}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market Niche</Label>
                  <Input
                    placeholder="e.g. fitness for busy moms, creator tools"
                    value={form.niche}
                    onChange={set("niche")}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</Label>
                <Input
                  placeholder="e.g. Women aged 28-45 who want to lose weight without leaving home"
                  value={form.audience}
                  onChange={set("audience")}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand Voice</Label>
                <Input
                  placeholder="e.g. Bold and direct, no fluff — like a trusted friend who's also an expert"
                  value={form.brandVoice}
                  onChange={set("brandVoice")}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Product / Offer</Label>
                <Input
                  placeholder="e.g. 6-week fat loss program, AI prompt library, online coaching"
                  value={form.topProduct}
                  onChange={set("topProduct")}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Business Goals</Label>
                <Textarea
                  placeholder="e.g. Reach $10k/mo by Q3, build an email list of 5k, launch a subscription offer"
                  value={form.goals}
                  onChange={set("goals")}
                  className="text-sm min-h-[80px] resize-none"
                  rows={3}
                />
              </div>

              <div className="pt-2 flex gap-3 items-center">
                <Button
                  onClick={handleSave}
                  disabled={upsert.isPending || !isFilled}
                  className={saved ? "bg-green-600 hover:bg-green-600" : ""}
                >
                  {upsert.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : saved ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {saved ? "Saved!" : upsert.isPending ? "Saving…" : "Save Business Memory"}
                </Button>
                {profile?.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    Last updated {new Date(profile.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 bg-secondary/10">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">SPARK uses your memory in:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Idea Generator", "Bundle Builder", "Brand Builder", "TikTok Scripts", "Viral Hooks", "AI Recommendations"].map(tool => (
                <div key={tool} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {tool}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
