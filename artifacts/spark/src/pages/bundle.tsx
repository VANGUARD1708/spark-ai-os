import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateBundle, type GenerateBundleBodyAngle } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, CheckCircle2, ArrowRight, Video, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";

const formSchema = z.object({
  productTitle: z.string().min(2, "Product title is required").max(100),
  productDescription: z.string().min(10, "Description is required").max(500),
  targetAudience: z.string().min(2, "Target audience is required").max(100),
  angle: z.enum(["pain", "desire", "transformation"] as const),
});

export default function Bundle() {
  const { toast } = useToast();
  const generateBundle = useGenerateBundle();

  const getParam = (key: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) ?? "";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productTitle: getParam("title"),
      productDescription: getParam("desc"),
      targetAudience: getParam("aud"),
      angle: "transformation",
    },
  });

  const productTitle = form.watch("productTitle");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateBundle.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Bundle generated successfully!" });
      },
      onError: () => {
        toast({ title: "Failed to generate bundle", variant: "destructive" });
      }
    });
  };

  const bundle = generateBundle.data;

  const scriptsLink = productTitle
    ? `/scripts?title=${encodeURIComponent(productTitle)}&desc=${encodeURIComponent(form.getValues("productDescription"))}&aud=${encodeURIComponent(form.getValues("targetAudience"))}`
    : "/scripts";

  return (
    <Layout>
      <div className="w-full max-w-6xl space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 md:sticky md:top-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Bundle Builder</h1>
                <p className="text-muted-foreground mt-2">
                  Turn a basic product into an irresistible offer by stacking value and framing the angle.
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
                            <FormLabel>Product Title</FormLabel>
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="What is it and what does it do?" {...field} className="bg-background resize-none h-20" />
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
                        name="angle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marketing Angle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select angle" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="transformation">Transformation (Where they want to be)</SelectItem>
                                <SelectItem value="pain">Pain (What they want to escape)</SelectItem>
                                <SelectItem value="desire">Desire (What they want to achieve)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={generateBundle.isPending}>
                        {generateBundle.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
                        Generate Offer Bundle
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            {generateBundle.isPending ? (
              <Card className="opacity-50">
                <CardHeader>
                  <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-1/2 bg-muted rounded animate-pulse mt-4" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                  <div className="h-32 w-full bg-muted rounded animate-pulse" />
                  <div className="h-12 w-full bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ) : bundle ? (
              <Card className="overflow-hidden border-border/50 border-t-primary/50 border-t-4 transition-all duration-300">
                <CardHeader className="text-center pb-8 border-b border-border/50 bg-secondary/10">
                  <Badge className="mx-auto mb-4 bg-primary/20 text-primary hover:bg-primary/30">{bundle.offerName}</Badge>
                  <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance leading-tight">
                    {bundle.headline}
                  </CardTitle>
                  <CardDescription className="text-xl mt-4 text-foreground/80 max-w-2xl mx-auto">
                    {bundle.subheadline}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="p-6 md:p-8 bg-card">
                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      The Core System
                    </h3>
                    <div className="p-6 rounded-xl bg-secondary/30 border border-border/50">
                      <p className="text-lg">{bundle.coreProduct}</p>
                    </div>

                    <h3 className="text-2xl font-bold mt-10 mb-6 flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      Value Stack Bonuses
                    </h3>
                    <div className="grid gap-4">
                      {bundle.bonuses.map((bonus, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-border/50 bg-background relative overflow-hidden group hover:border-primary/30 transition-colors">
                          <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 text-xs font-bold rounded-bl-lg">
                            Value: {bonus.value}
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                              <h4 className="font-bold text-lg">{bonus.name}</h4>
                            </div>
                            <p className="text-muted-foreground text-sm pl-7">{bonus.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-2xl font-bold mt-10 mb-6 flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      Why It Works
                    </h3>
                    <ul className="space-y-3">
                      {bundle.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-primary mr-3 shrink-0 mt-0.5" />
                          <span className="text-lg">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 md:p-8 bg-secondary/20 border-t border-border/50 text-center">
                    <div className="inline-block px-4 py-2 rounded-full bg-background border border-border/50 text-sm font-medium mb-6">
                      {bundle.guarantee}
                    </div>

                    <div className="flex flex-col items-center justify-center mb-8">
                      <div className="text-muted-foreground line-through text-2xl mb-1">{bundle.strikethroughPrice}</div>
                      <div className="text-6xl font-black text-primary drop-shadow-sm">{bundle.price}</div>
                    </div>

                    <Button size="lg" className="w-full md:w-auto text-lg h-14 px-12 font-bold animate-in zoom-in duration-500 delay-300">
                      {bundle.callToAction} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/40 bg-card p-5 flex flex-col sm:flex-row gap-3">
                  <p className="text-sm text-muted-foreground sm:mr-auto">Next step:</p>
                  <Link href={scriptsLink} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full group/btn" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Create Content
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                  <Link href="/storefronts" className="w-full sm:w-auto">
                    <Button className="w-full group/btn" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Launch Product
                      <ArrowRight className="ml-2 h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">No bundle generated yet</h3>
                <p className="text-muted-foreground max-w-sm">
                  Enter your product details on the left to transform it into a high-converting, irresistible offer bundle.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
