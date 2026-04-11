import { Layout } from "@/components/layout";
import { useGetSavedIdeas, useDeleteSavedIdea, getGetSavedIdeasQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, TrendingUp, Target, Package, ArrowRight, BookmarkX, Search, Lightbulb, Archive, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

type Tab = "ideas" | "bundles" | "files";

export default function Assets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("ideas");
  const [search, setSearch] = useState("");

  const { data: savedIdeas, isLoading } = useGetSavedIdeas({ query: { queryKey: getGetSavedIdeasQueryKey() } });
  const deleteIdea = useDeleteSavedIdea();

  const handleDelete = (id: number) => {
    deleteIdea.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Removed from assets" });
        queryClient.invalidateQueries({ queryKey: getGetSavedIdeasQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to remove", variant: "destructive" });
      }
    });
  };

  const filtered = useMemo(() => {
    if (!savedIdeas) return [];
    if (!search.trim()) return savedIdeas;
    const q = search.toLowerCase();
    return savedIdeas.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.niche.toLowerCase().includes(q)
    );
  }, [savedIdeas, search]);

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const TABS = [
    { id: "ideas" as Tab, label: "Saved Ideas", icon: Lightbulb, count: savedIdeas?.length ?? 0 },
    { id: "bundles" as Tab, label: "Saved Bundles", icon: Archive, count: 0, soon: true },
    { id: "files" as Tab, label: "Files", icon: FolderOpen, count: 0, soon: true },
  ];

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
            <p className="text-muted-foreground mt-2">All your saved ideas, bundles, and files in one place.</p>
          </div>
          <Link href="/ideas">
            <Button size="sm">Generate More <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 border-b border-border/50 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {t.count}
                </span>
              )}
              {t.soon && (
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">Soon</span>
              )}
            </button>
          ))}
        </div>

        {tab === "ideas" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas, niches..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 bg-card border-border/50"
              />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="opacity-50">
                    <CardHeader>
                      <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((idea) => (
                  <Card key={idea.id} className="flex flex-col border-border/50 hover:border-primary/50 transition-colors group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-3">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs">{idea.niche}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                          onClick={() => handleDelete(idea.id)}
                          disabled={deleteIdea.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">{idea.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">{idea.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Demand</span>
                          <span className={`text-base font-bold ${getScoreColor(idea.demandScore)}`}>{idea.demandScore ?? "—"}<span className="text-xs opacity-60">/100</span></span>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Comp.</span>
                          <span className={`text-base font-bold ${getScoreColor(idea.competitionScore ? 100 - idea.competitionScore : undefined)}`}>
                            {idea.competitionScore ?? "—"}<span className="text-xs opacity-60">/100</span>
                          </span>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Sat.</span>
                          <span className="text-sm font-medium capitalize">{idea.saturationLevel ?? "—"}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(idea.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </CardContent>

                    <CardFooter className="pt-3 border-t border-border/50 bg-secondary/10">
                      <Link href={`/bundle?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || "")}`} className="w-full">
                        <Button variant="secondary" className="w-full group/btn" size="sm">
                          <Package className="mr-2 h-4 w-4 text-primary" />
                          Build Bundle
                          <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : savedIdeas && savedIdeas.length > 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="font-medium">No ideas match "{search}"</p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => setSearch("")}>Clear search</Button>
              </div>
            ) : (
              <div className="h-[360px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <BookmarkX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No saved ideas yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                  Generate ideas and save the ones you want to build. They'll all show up here.
                </p>
                <Link href="/ideas">
                  <Button>Go to Idea Generator</Button>
                </Link>
              </div>
            )}
          </>
        )}

        {(tab === "bundles" || tab === "files") && (
          <div className="h-[360px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {tab === "bundles" ? <Archive className="h-6 w-6 text-primary" /> : <FolderOpen className="h-6 w-6 text-primary" />}
            </div>
            <h3 className="text-xl font-medium mb-2">{tab === "bundles" ? "Saved Bundles" : "Files"} — Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              {tab === "bundles"
                ? "Save your generated offer bundles and come back to refine them before launch."
                : "All your generated digital products, scripts, and assets — ready to download and share."}
            </p>
            <Badge variant="outline" className="mt-4 text-muted-foreground border-border/50">Phase 2</Badge>
          </div>
        )}
      </div>
    </Layout>
  );
}
