import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateViralHooks, useSaveHooks, getGetSavedHooksQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Flame, Copy, ArrowRight, Video, Bookmark, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  productTitle: z.string().min(2, "Product or topic is required").max(100),
  description: z.string().max(300).optional(),
  hookType: z.enum(["all", "curiosity", "pain", "story", "short"] as const),
});

const HOOK_TYPE_OPTIONS = [
  { value: "all", label: "All Types", desc: "Get every category", color: "text-primary" },
  { value: "curiosity", label: "Curiosity", desc: "HAVE to keep watching", color: "text-purple-400" },
  { value: "pain", label: "Pain", desc: "Hits a deep frustration", color: "text-red-400" },
  { value: "story", label: "Story", desc: "Opens with a moment", color: "text-blue-400" },
  { value: "short", label: "Short", desc: "Under 8 words, punchy", color: "text-orange-400" },
];

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { productTitle: "", description: "", hookType: "all" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSaved(false);
    generateHooks.mutate({ data: values }, {
      onSuccess: () => {
        setFilterType("all");
        toast({ title: "Hooks generated!" });
      },
      onError: () => toast({ title: "Failed to generate hooks", variant: "destructive" }),
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const handleSave = () => {
    const hooksData = generateHooks.data;
    if (!hooksData) return;
    saveHooks.mutate(
      {
        data: {
          productTitle: form.getValues("productTitle"),
          hookType: form.getValues("hookType"),
          data: hooksData as any,
        }
      },
      {
        onSuccess: () => {
          setSaved(true);
          toast({ title: "Hooks saved to Asset Command Center" });
          queryClient.invalidateQueries({ queryKey: getGetSavedHooksQueryKey() });
        },
        onError: () => toast({ title: "Failed to save hooks", variant: "destructive" }),
      }
    );
  };

  const hooksData = generateHooks.data;
  const hooks = hooksData?.hooks ?? [];
  const filteredHooks = filterType === "all" ? hooks : hooks.filter(h => h.type === filterType);

  const groupedByType = (hooks: typeof filteredHooks) => {
    const groups: Record<string, typeof filteredHooks> = {};
    hooks.forEach(h => {
      if (!groups[h.type]) groups[h.type] = [];
      groups[h.type].push(h);
    });
    return groups;
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[280px] shrink-0 md:sticky md:top-8 space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Viral Hooks</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Scroll-stopping opening lines engineered to interrupt the feed and demand attention.
              </p>
            </div>

            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardContent className="pt-5 pb-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">Product / Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 30-Day Fitness Plan, budgeting" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">Context (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="What makes it different?" {...field} className="bg-background" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hookType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider">Hook Type</FormLabel>
                          <div className="grid grid-cols-1 gap-2">
                            {HOOK_TYPE_OPTIONS.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => field.onChange(opt.value)}
                                className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all ${
                                  field.value === opt.value
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-border/50 bg-secondary/20 hover:border-border"
                                }`}
                              >
                                <div className="flex-1">
                                  <p className={`text-sm font-semibold ${opt.color}`}>{opt.label}</p>
                                  <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                                </div>
                                {field.value === opt.value && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={generateHooks.isPending}>
                      {generateHooks.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flame className="mr-2 h-4 w-4" />}
                      Generate Hooks
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
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
                        {type === "all" ? `All (${hooks.length})` : `${type.charAt(0).toUpperCase() + type.slice(1)} (${groupedByType(hooks)[type]?.length || 0})`}
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
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-orange-400/10 flex items-center justify-center mb-4">
                  <Flame className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No hooks yet</h3>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Enter a product or topic and choose a hook type. We'll generate scroll-stopping openers built for attention.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
