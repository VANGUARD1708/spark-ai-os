import { Layout } from "@/components/layout";
import {
  useGetCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  getGetCampaignsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone, Plus, Trash2, Play, Pause, Send, Clock, CheckCircle2,
  TikTokIcon, Instagram, Twitter, Youtube, X, ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SiTiktok, SiInstagram, SiX, SiYoutube, SiFacebook } from "react-icons/si";

const STATUS_STYLES: Record<string, { label: string; color: string; badge: string }> = {
  draft: { label: "Draft", color: "text-muted-foreground", badge: "border-border/50 text-muted-foreground" },
  active: { label: "Active", color: "text-blue-400", badge: "border-blue-400/30 text-blue-400 bg-blue-400/10" },
  published: { label: "Published", color: "text-green-400", badge: "border-green-400/30 text-green-400 bg-green-400/10" },
  paused: { label: "Paused", color: "text-yellow-400", badge: "border-yellow-400/30 text-yellow-400 bg-yellow-400/10" },
};

const STATUS_ACTIONS: Record<string, { label: string; next: string; icon: React.ReactNode }[]> = {
  draft: [{ label: "Activate", next: "active", icon: <Play className="h-3.5 w-3.5" /> }],
  active: [
    { label: "Publish", next: "published", icon: <Send className="h-3.5 w-3.5" /> },
    { label: "Pause", next: "paused", icon: <Pause className="h-3.5 w-3.5" /> },
  ],
  published: [],
  paused: [{ label: "Resume", next: "active", icon: <Play className="h-3.5 w-3.5" /> }],
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  tiktok: <SiTiktok className="h-3.5 w-3.5" />,
  instagram: <SiInstagram className="h-3.5 w-3.5" />,
  x: <SiX className="h-3.5 w-3.5" />,
  youtube: <SiYoutube className="h-3.5 w-3.5" />,
  facebook: <SiFacebook className="h-3.5 w-3.5" />,
};

const AVAILABLE_CHANNELS = ["tiktok", "instagram", "x", "youtube", "facebook"];

const STATUS_FILTERS = ["all", "draft", "active", "published", "paused"] as const;

function CreateModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createCampaign = useCreateCampaign();
  const [name, setName] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["tiktok"]);

  const toggleChannel = (c: string) => {
    setSelectedChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    createCampaign.mutate(
      { data: { name: name.trim(), productTitle: productTitle.trim() || undefined, channels: selectedChannels } },
      {
        onSuccess: () => {
          toast({ title: "Campaign created" });
          queryClient.invalidateQueries({ queryKey: getGetCampaignsQueryKey() });
          onClose();
        },
        onError: () => toast({ title: "Failed to create campaign", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md border-border bg-[hsl(0_0%_8%)]">
        <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
          <CardTitle className="text-base">New Campaign</CardTitle>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Campaign Name</label>
            <Input
              placeholder="e.g. Q2 Fitness Launch"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-background"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product (optional)</label>
            <Input
              placeholder="e.g. 30-Day Fitness System"
              value={productTitle}
              onChange={e => setProductTitle(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Channels</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CHANNELS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleChannel(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all capitalize ${
                    selectedChannels.includes(c)
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {CHANNEL_ICONS[c]}
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate} disabled={!name.trim() || createCampaign.isPending}>
              Create Campaign
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Campaigns() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  const { data: campaigns, isLoading } = useGetCampaigns(
    statusFilter !== "all" ? { status: statusFilter as any } : {},
    { query: { queryKey: getGetCampaignsQueryKey(statusFilter !== "all" ? { status: statusFilter as any } : {}) } }
  );

  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  const handleStatus = (id: number, status: string) => {
    updateCampaign.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          toast({ title: "Status updated" });
          queryClient.invalidateQueries({ queryKey: getGetCampaignsQueryKey() });
        },
        onError: () => toast({ title: "Failed to update", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteCampaign.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Campaign deleted" });
          queryClient.invalidateQueries({ queryKey: getGetCampaignsQueryKey() });
        },
        onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
      }
    );
  };

  return (
    <Layout>
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}

      <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Manager</h1>
            <p className="text-muted-foreground mt-1.5">Plan, track, and publish your distribution campaigns.</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all capitalize ${
                statusFilter === s
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted/20 rounded-xl animate-pulse" />)}
          </div>
        ) : campaigns && campaigns.length > 0 ? (
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const st = STATUS_STYLES[campaign.status] ?? STATUS_STYLES.draft;
              const actions = STATUS_ACTIONS[campaign.status] ?? [];
              const channels = (campaign.channels as string[] | null) ?? [];

              return (
                <Card key={campaign.id} className="border-border/50 bg-card/50 hover:border-border transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Megaphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base">{campaign.name}</h3>
                          <Badge variant="outline" className={`text-[10px] py-0 h-5 border ${st.badge}`}>
                            {st.label}
                          </Badge>
                        </div>
                        {campaign.productTitle && (
                          <p className="text-sm text-muted-foreground mt-0.5">{campaign.productTitle}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {channels.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              {channels.map(c => (
                                <span key={c} className="text-muted-foreground" title={c}>
                                  {CHANNEL_ICONS[c] ?? c}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(campaign.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          {campaign.publishedAt && (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Published {new Date(campaign.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {actions.map(action => (
                          <Button
                            key={action.next}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => handleStatus(campaign.id, action.next)}
                            disabled={updateCampaign.isPending}
                          >
                            {action.icon}
                            <span className="ml-1.5">{action.label}</span>
                          </Button>
                        ))}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(campaign.id)}
                          disabled={deleteCampaign.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="h-[360px] flex flex-col items-center justify-center border border-dashed rounded-xl border-border bg-card/10 text-center p-8">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Megaphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              {statusFilter !== "all" ? `No ${statusFilter} campaigns` : "No campaigns yet"}
            </h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Create a campaign to plan and track how your content gets distributed across channels.
            </p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Campaign
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
