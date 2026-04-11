import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateTikTokScript } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Video, Hash, Copy, PlayCircle, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productTitle: z.string().min(2, "Product title is required").max(100),
  productDescription: z.string().min(10, "Description is required").max(500),
  targetAudience: z.string().min(2, "Target audience is required").max(100),
  style: z.enum(["educational", "storytelling", "shocking", "transformation"] as const),
});

export default function Scripts() {
  const { toast } = useToast();
  const generateScripts = useGenerateTikTokScript();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      productTitle: "",
      productDescription: "",
      targetAudience: "",
      style: "shocking"
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateScripts.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Scripts generated successfully!" });
      },
      onError: () => {
        toast({ title: "Failed to generate scripts", variant: "destructive" });
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500 bg-green-500/10 border-green-500/20";
    if (score >= 70) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-primary bg-primary/10 border-primary/20";
  };

  const scriptsData = generateScripts.data;

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 md:sticky md:top-20">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">TikTok Scripts</h1>
                <p className="text-muted-foreground mt-2">
                  Generate viral short-form video scripts designed for retention and conversion.
                </p>
              </div>

              <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="productTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product/Offer Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 30-Day Fitness Plan" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Key Selling Point</FormLabel>
                            <FormControl>
                              <Textarea placeholder="What's the main hook?" {...field} className="bg-background resize-none h-20" />
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
                            <FormLabel>Target Audience</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Busy professionals" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="shocking">Shocking Hook (Highest attention)</SelectItem>
                                <SelectItem value="educational">Value/Educational (Highest trust)</SelectItem>
                                <SelectItem value="storytelling">Storytelling (Highest retention)</SelectItem>
                                <SelectItem value="transformation">Transformation (Highest desire)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={generateScripts.isPending}>
                        {generateScripts.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
                        Generate Scripts
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            {generateScripts.isPending ? (
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <Card key={i} className="opacity-50">
                    <CardHeader>
                      <div className="h-6 w-1/4 bg-muted rounded animate-pulse" />
                      <div className="h-10 w-full bg-muted rounded animate-pulse mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : scriptsData && scriptsData.scripts.length > 0 ? (
              <div className="space-y-6">
                {scriptsData.scripts.map((script, i) => (
                  <Card key={i} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="bg-secondary/10 pb-4 border-b border-border/50">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 w-full">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                            <PlayCircle className="h-4 w-4" /> 
                            The Hook (First 3 Seconds)
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold leading-tight">{script.hook}</h3>
                        </div>
                        <Badge variant="outline" className={`shrink-0 border ${getScoreColor(script.estimatedViralScore)}`}>
                          <Activity className="h-3 w-3 mr-1" />
                          Viral Score: {script.estimatedViralScore}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Full Script</h4>
                          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => handleCopy(script.script)}>
                            <Copy className="h-3 w-3 mr-1" /> Copy
                          </Button>
                        </div>
                        <div className="p-4 rounded-xl bg-card border border-border/50 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {script.script}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                            <Hash className="h-4 w-4 mr-1" /> Caption
                          </h4>
                          <p className="text-sm p-3 rounded-lg bg-secondary/20">{script.caption}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                            <Hash className="h-4 w-4 mr-1" /> Hashtags
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {script.hashtags.map(tag => (
                              <Badge key={tag} variant="secondary" className="font-mono text-xs bg-secondary/50">
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No scripts generated yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter your offer details on the left to generate viral scripts engineered for TikTok/Reels algorithms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
