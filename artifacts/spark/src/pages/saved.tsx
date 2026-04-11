import { Layout } from "@/components/layout";
import { useGetSavedIdeas, useDeleteSavedIdea, getGetSavedIdeasQueryKey, type SavedIdea } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingUp, Target, Package, ArrowRight, BookmarkX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

export default function Saved() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: savedIdeas, isLoading } = useGetSavedIdeas({
    query: {
      queryKey: getGetSavedIdeasQueryKey()
    }
  });

  const deleteIdea = useDeleteSavedIdea();

  const handleDelete = (id: number) => {
    deleteIdea.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Idea removed from saved list" });
        queryClient.invalidateQueries({ queryKey: getGetSavedIdeasQueryKey() });
      },
      onError: () => {
        toast({ title: "Failed to remove idea", variant: "destructive" });
      }
    });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Ideas</h1>
            <p className="text-muted-foreground mt-2">
              Your repository of validated product opportunities. Ready to build when you are.
            </p>
          </div>
          <Link href="/ideas">
            <Button>Generate More <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="opacity-50">
                <CardHeader>
                  <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-24 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : savedIdeas && savedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedIdeas.map((idea) => (
              <Card key={idea.id} className="flex flex-col border-border/50 hover:border-primary/50 transition-colors group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <Badge variant="secondary" className="mb-2 bg-secondary text-secondary-foreground">{idea.niche}</Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(idea.id)}
                      disabled={deleteIdea.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{idea.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{idea.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Demand</span>
                      <span className={`text-lg font-bold ${getScoreColor(idea.demandScore)}`}>{idea.demandScore}/100</span>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Comp.</span>
                      <span className={`text-lg font-bold ${getScoreColor(idea.competitionScore ? 100 - idea.competitionScore : undefined)}`}>
                        {idea.competitionScore}/100
                      </span>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sat.</span>
                      <span className="text-sm font-medium pt-1 capitalize">{idea.saturationLevel}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-border/50 bg-secondary/10">
                  <Link href={`/bundle?title=${encodeURIComponent(idea.title)}&desc=${encodeURIComponent(idea.description)}&aud=${encodeURIComponent(idea.targetAudience || '')}`} className="w-full">
                    <Button variant="secondary" className="w-full group/btn">
                      <Package className="mr-2 h-4 w-4 text-primary" /> 
                      Build Bundle
                      <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <BookmarkX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No saved ideas</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't saved any product ideas yet. Head over to the Idea Generator to find your first opportunity.
            </p>
            <Link href="/ideas">
              <Button>Go to Idea Generator</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
