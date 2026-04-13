import { Layout } from "@/components/layout";
import { useCreateCampaign, getGetCampaignsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useState } from "react";
import { SiTiktok, SiInstagram, SiX, SiYoutube, SiFacebook } from "react-icons/si";

const CHANNELS = [
  { id: "tiktok", label: "TikTok", icon: SiTiktok },
  { id: "instagram", label: "Instagram", icon: SiInstagram },
  { id: "x", label: "X / Twitter", icon: SiX },
  { id: "youtube", label: "YouTube", icon: SiYoutube },
  { id: "facebook", label: "Facebook", icon: SiFacebook },
];

export default function Compose() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const createCampaign = useCreateCampaign();

  const [name, setName] = useState("");
  const [productTitle, setProductTitle] = useState(new URLSearchParams(window.location.search).get("product") ?? "");
  const [caption, setCaption] = useState("");
  const [price, setPrice] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["tiktok"]);

  const toggleChannel = (c: string) => setSelectedChannels(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const handlePublish = () => {
    if (!name.trim()) { toast({ title: "Campaign name is required", variant: "destructive" }); return; }
    createCampaign.mutate(
      {
        data: {
          name: name.trim(),
          productTitle: productTitle.trim() || undefined,
          channels: selectedChannels,
          content: { caption: caption.trim() || undefined, price: price.trim() || undefined, ctaLink: ctaLink.trim() || undefined },
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Campaign created!" });
          queryClient.invalidateQueries({ queryKey: getGetCampaignsQueryKey() });
          navigate("/campaigns");
        },
        onError: () => toast({ title: "Failed to create campaign", variant: "destructive" }),
      }
    );
  };

  return (
    <Layout>
      <div className="w-full max-w-2xl space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publish Composer</h1>
          <p className="text-muted-foreground mt-1.5">Create a campaign and push it to your channels.</p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Campaign Name</label>
              <Input placeholder="e.g. May Product Launch" value={name} onChange={e => setName(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product / Offer</label>
              <Input placeholder="What are you promoting?" value={productTitle} onChange={e => setProductTitle(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Caption (optional)</label>
              <Textarea placeholder="Your post caption..." value={caption} onChange={e => setCaption(e.target.value)} className="bg-background resize-none h-24" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</label>
                <Input placeholder="e.g. $47" value={price} onChange={e => setPrice(e.target.value)} className="bg-background" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CTA Link</label>
                <Input placeholder="https://..." value={ctaLink} onChange={e => setCtaLink(e.target.value)} className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channels</label>
              <div className="grid grid-cols-2 gap-2">
                {CHANNELS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChannel(c.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedChannels.includes(c.id)
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {selectedChannels.includes(c.id) && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
                    <c.icon className="h-4 w-4 shrink-0" />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full h-11 font-semibold" onClick={handlePublish} disabled={createCampaign.isPending || !name.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {createCampaign.isPending ? "Creating..." : "Create Campaign"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
