import { Layout } from "@/components/layout";
import {
  useGetAssets, getGetAssetsQueryKey,
  useGetSavedIdeas, getGetSavedIdeasQueryKey, useDeleteSavedIdea,
  useGetSavedBundles, getGetSavedBundlesQueryKey, useDeleteSavedBundle,
  useGetSavedScripts, getGetSavedScriptsQueryKey, useDeleteSavedScript,
  useGetSavedHooks, getGetSavedHooksQueryKey, useDeleteSavedHook,
  useGetSavedBrands, getGetSavedBrandsQueryKey, useDeleteSavedBrand,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2, Package, ArrowRight, BookmarkX, Search, Lightbulb,
  Archive, Video, Flame, Palette, Plus, Bookmark
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearch } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";

type Tab = "ideas" | "bundles" | "scripts" | "hooks" | "brands";

const TABS: { id: Tab; label: string; icon: React.ElementType; addHref: string }[] = [
  { id: "ideas", label: "Ideas", icon: Lightbulb, addHref: "/ideas" },
  { id: "bundles", label: "Bundles", icon: Archive, addHref: "/bundle" },
  { id: "scripts", label: "Scripts", icon: Video, addHref: "/scripts" },
  { id: "hooks", label: "Hooks", icon: Flame, addHref: "/viral-hooks" },
  { id: "brands", label: "Brands", icon: Palette, addHref: "/brand-builder" },
];

function DeleteBtn({ onDelete, disabled }: { onDelete: () => void; disabled?: boolean }) {
  return (
    <Button
      variant="ghost" size="icon"
      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={onDelete}
      disabled={disabled}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}

function EmptyState({ tab, addHref }: { tab: string; addHref: string }) {
  return (
    <div className="h-[320px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <BookmarkX className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No saved {tab} yet</h3>
      <p className="text-muted-foreground max-w-xs mb-5 text-sm">
        Generate and save {tab} to find them here, organized and ready to use.
      </p>
      <Link href={addHref}>
        <Button size="sm"><Plus className="h-3.5 w-3.5 mr-2" />Generate {tab.replace(/s$/, "")}</Button>
      </Link>
    </div>
  );
}

export default function Assets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) ?? "ideas");
  const [search, setSearch] = useState("");

  const { data: assets } = useGetAssets({ query: { queryKey: getGetAssetsQueryKey() } });

  const { data: ideas, isLoading: ideasLoading } = useGetSavedIdeas({ query: { queryKey: getGetSavedIdeasQueryKey() } });
  const { data: bundles, isLoading: bundlesLoading } = useGetSavedBundles({ query: { queryKey: getGetSavedBundlesQueryKey() } });
  const { data: scripts, isLoading: scriptsLoading } = useGetSavedScripts({ query: { queryKey: getGetSavedScriptsQueryKey() } });
  const { data: hooks, isLoading: hooksLoading } = useGetSavedHooks({ query: { queryKey: getGetSavedHooksQueryKey() } });
  const { data: brands, isLoading: brandsLoading } = useGetSavedBrands({ query: { queryKey: getGetSavedBrandsQueryKey() } });

  const deleteIdea = useDeleteSavedIdea();
  const deleteBundle = useDeleteSavedBundle();
  const deleteScript = useDeleteSavedScript();
  const deleteHook = useDeleteSavedHook();
  const deleteBrand = useDeleteSavedBrand();

  const counts: Record<Tab, number> = {
    ideas: assets?.ideas?.count ?? ideas?.length ?? 0,
    bundles: assets?.bundles?.count ?? bundles?.length ?? 0,
    scripts: assets?.scripts?.count ?? scripts?.length ?? 0,
    hooks: assets?.hooks?.count ?? hooks?.length ?? 0,
    brands: assets?.brands?.count ?? brands?.length ?? 0,
  };

  const del = (type: Tab, id: number) => {
    const qkMap: Record<Tab, unknown[]> = {
      ideas: getGetSavedIdeasQueryKey(),
      bundles: getGetSavedBundlesQueryKey(),
      scripts: getGetSavedScriptsQueryKey(),
      hooks: getGetSavedHooksQueryKey(),
      brands: getGetSavedBrandsQueryKey(),
    };
    const mutMap: Record<Tab, (id: number) => void> = {
      ideas: (id) => deleteIdea.mutate({ id }, { onSuccess: () => { toast({ title: "Removed" }); queryClient.invalidateQueries({ queryKey: qkMap.ideas as any }); queryClient.invalidateQueries({ queryKey: getGetAssetsQueryKey() }); } }),
      bundles: (id) => deleteBundle.mutate({ id }, { onSuccess: () => { toast({ title: "Removed" }); queryClient.invalidateQueries({ queryKey: qkMap.bundles as any }); queryClient.invalidateQueries({ queryKey: getGetAssetsQueryKey() }); } }),
      scripts: (id) => deleteScript.mutate({ id }, { onSuccess: () => { toast({ title: "Removed" }); queryClient.invalidateQueries({ queryKey: qkMap.scripts as any }); queryClient.invalidateQueries({ queryKey: getGetAssetsQueryKey() }); } }),
      hooks: (id) => deleteHook.mutate({ id }, { onSuccess: () => { toast({ title: "Removed" }); queryClient.invalidateQueries({ queryKey: qkMap.hooks as any }); queryClient.invalidateQueries({ queryKey: getGetAssetsQueryKey() }); } }),
      brands: (id) => deleteBrand.mutate({ id }, { onSuccess: () => { toast({ title: "Removed" }); queryClient.invalidateQueries({ queryKey: qkMap.brands as any }); queryClient.invalidateQueries({ queryKey: getGetAssetsQueryKey() }); } }),
    };
    mutMap[type](id);
  };

  const q = search.toLowerCase();
  const filteredIdeas = useMemo(() => !ideas ? [] : !q ? ideas : ideas.filter(i => i.title.toLowerCase().includes(q) || i.niche.toLowerCase().includes(q)), [ideas, q]);
  const filteredBundles = useMemo(() => !bundles ? [] : !q ? bundles : bundles.filter(b => b.productTitle.toLowerCase().includes(q) || b.offerName.toLowerCase().includes(q)), [bundles, q]);
  const filteredScripts = useMemo(() => !scripts ? [] : !q ? scripts : scripts.filter(s => s.productTitle.toLowerCase().includes(q)), [scripts, q]);
  const filteredHooks = useMemo(() => !hooks ? [] : !q ? hooks : hooks.filter(h => h.productTitle.toLowerCase().includes(q)), [hooks, q]);
  const filteredBrands = useMemo(() => !brands ? [] : !q ? brands : brands.filter(b => b.brandName.toLowerCase().includes(q) || b.niche.toLowerCase().includes(q)), [brands, q]);

  const currentTab = TABS.find(t => t.id === tab)!;

  const getScoreColor = (score?: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-6 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Command Center</h1>
            <p className="text-muted-foreground mt-1.5">
              {assets ? `${assets.totalAssets} saved assets` : "All your saved content in one place."}
            </p>
          </div>
          <Link href={currentTab.addHref}>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-2" />Add {currentTab.label.replace(/s$/, "")}</Button>
          </Link>
        </div>

        <div className="flex items-center gap-1 border-b border-border/50 -mb-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {counts[t.id] > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={`Search ${currentTab.label.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border/50" />
        </div>

        {tab === "ideas" && (
          ideasLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3].map(i => <Card key={i} className="opacity-40"><CardHeader><div className="h-6 w-2/3 bg-muted rounded animate-pulse" /></CardHeader><CardContent><div className="h-16 bg-muted rounded animate-pulse" /></CardContent></Card>)}
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.map(idea => (
                <Card key={idea.id} className="flex flex-col border-border/50 hover:border-primary/40 transition-colors group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <Badge variant="secondary" className="text-xs shrink-0">{idea.niche}</Badge>
                      <DeleteBtn onDelete={() => del("ideas", idea.id)} disabled={deleteIdea.isPending} />
                    </div>
                    <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">{idea.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{idea.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`font-bold ${getScoreColor(idea.demandScore)}`}>{idea.demandScore ?? "—"}<span className="text-xs opacity-50">/100</span></span>
                      <span className="text-xs text-muted-foreground">demand</span>
                      <span className="w-px h-4 bg-border" />
                      <span className="text-xs capitalize text-muted-foreground">{idea.saturationLevel ?? "—"} sat.</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-border/40 bg-secondary/10">
                    <Link href={`/bundle?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience ?? "")}`} className="w-full">
                      <Button variant="secondary" size="sm" className="w-full">
                        <Package className="h-3.5 w-3.5 mr-2 text-primary" />Build Bundle<ArrowRight className="ml-auto h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : <EmptyState tab="ideas" addHref="/ideas" />
        )}

        {tab === "bundles" && (
          bundlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2].map(i => <Card key={i} className="opacity-40"><CardHeader><div className="h-6 w-2/3 bg-muted rounded animate-pulse" /></CardHeader><CardContent><div className="h-16 bg-muted rounded animate-pulse" /></CardContent></Card>)}
            </div>
          ) : filteredBundles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBundles.map(bundle => (
                <Card key={bundle.id} className="border-border/50 hover:border-blue-400/30 transition-colors group">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-400/10 flex items-center justify-center shrink-0">
                      <Archive className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{bundle.offerName}</p>
                          <p className="text-xs text-muted-foreground">{bundle.productTitle}</p>
                        </div>
                        <DeleteBtn onDelete={() => del("bundles", bundle.id)} disabled={deleteBundle.isPending} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{bundle.headline}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {bundle.price && <Badge variant="outline" className="text-[10px] h-4 border-border/50 text-green-400">{bundle.price}</Badge>}
                        <span className="text-[10px] text-muted-foreground">{new Date(bundle.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : <EmptyState tab="bundles" addHref="/bundle" />
        )}

        {tab === "scripts" && (
          scriptsLoading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 bg-muted/20 rounded-xl animate-pulse" />)}</div>
          ) : filteredScripts.length > 0 ? (
            <div className="space-y-3">
              {filteredScripts.map(script => {
                const data = script.data as any;
                const scripts = Array.isArray(data?.scripts) ? data.scripts : [];
                return (
                  <Card key={script.id} className="border-border/50 hover:border-pink-400/30 transition-colors group">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-pink-400/10 flex items-center justify-center shrink-0">
                        <Video className="h-4.5 w-4.5 text-pink-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">{script.productTitle}</p>
                            {script.style && <Badge variant="outline" className="text-[10px] h-4 border-border/50 text-muted-foreground capitalize mt-1">{script.style}</Badge>}
                          </div>
                          <DeleteBtn onDelete={() => del("scripts", script.id)} disabled={deleteScript.isPending} />
                        </div>
                        {scripts.length > 0 && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">Hook: {scripts[0]?.hook}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">{scripts.length} script{scripts.length !== 1 ? "s" : ""} · {new Date(script.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : <EmptyState tab="scripts" addHref="/scripts" />
        )}

        {tab === "hooks" && (
          hooksLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted/20 rounded-xl animate-pulse" />)}</div>
          ) : filteredHooks.length > 0 ? (
            <div className="space-y-3">
              {filteredHooks.map(hook => {
                const data = hook.data as any;
                const hookList = Array.isArray(data?.hooks) ? data.hooks : [];
                return (
                  <Card key={hook.id} className="border-border/50 hover:border-orange-400/30 transition-colors group">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-orange-400/10 flex items-center justify-center shrink-0">
                        <Flame className="h-4.5 w-4.5 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">{hook.productTitle}</p>
                            {hook.hookType && <Badge variant="outline" className="text-[10px] h-4 border-border/50 text-muted-foreground capitalize mt-1">{hook.hookType}</Badge>}
                          </div>
                          <DeleteBtn onDelete={() => del("hooks", hook.id)} disabled={deleteHook.isPending} />
                        </div>
                        {hookList.length > 0 && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{hookList[0]?.text}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">{hookList.length} hook{hookList.length !== 1 ? "s" : ""} · {new Date(hook.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : <EmptyState tab="hooks" addHref="/viral-hooks" />
        )}

        {tab === "brands" && (
          brandsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className="h-24 bg-muted/20 rounded-xl animate-pulse" />)}</div>
          ) : filteredBrands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBrands.map(brand => {
                const data = brand.data as any;
                const colors = Array.isArray(data?.colors) ? data.colors : [];
                return (
                  <Card key={brand.id} className="border-border/50 hover:border-purple-400/30 transition-colors group overflow-hidden">
                    {colors[0]?.hex && <div className="h-1 w-full" style={{ background: colors[0].hex }} />}
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: colors[0]?.hex ? `${colors[0].hex}20` : "hsl(var(--secondary))" }}>
                        <Palette className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-base">{brand.brandName}</p>
                            {brand.slogan && <p className="text-xs text-muted-foreground">{brand.slogan}</p>}
                          </div>
                          <DeleteBtn onDelete={() => del("brands", brand.id)} disabled={deleteBrand.isPending} />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px] h-4 border-border/50 text-muted-foreground">{brand.niche}</Badge>
                          {colors.slice(0, 4).map((c: any) => (
                            <div key={c.hex} className="h-4 w-4 rounded-full border border-border/50" style={{ backgroundColor: c.hex }} title={c.name} />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : <EmptyState tab="brands" addHref="/brand-builder" />
        )}

      </div>
    </Layout>
  );
}
