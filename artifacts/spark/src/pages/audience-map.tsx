import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetUserProfile } from "@workspace/api-client-react";
import {
  Compass, Users, Target, Heart, Zap, Brain, ArrowRight,
  MapPin, MessageSquare, ShoppingCart, Bookmark, Sparkles
} from "lucide-react";
import { useState } from "react";

const SEGMENT_TEMPLATES = [
  {
    name: "Core Fans",
    icon: Heart,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    size: "5-10% of audience",
    desc: "Buy everything, share everything, defend your brand.",
    platforms: "Email, community",
    value: "Highest LTV",
  },
  {
    name: "Engaged Followers",
    icon: MessageSquare,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    size: "20-30% of audience",
    desc: "Like, comment, share. Warm but not always buying.",
    platforms: "TikTok, Instagram",
    value: "High engagement, medium conversion",
  },
  {
    name: "Window Shoppers",
    icon: ShoppingCart,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    size: "40-50% of audience",
    desc: "Consume content, occasionally engage. Need nurturing.",
    platforms: "All platforms",
    value: "Volume + awareness",
  },
  {
    name: "Casual Browsers",
    icon: Bookmark,
    color: "text-muted-foreground",
    bg: "bg-secondary/20",
    size: "10-20% of audience",
    desc: "Saw once, might return. Need reminder to re-engage.",
    platforms: "Algorithm discovery",
    value: "Low engagement, conversion potential",
  },
];

export default function AudienceMap() {
  const { data: profile } = useGetUserProfile();
  const [expanded, setExpanded] = useState<string | null>(null);
  const niche = profile?.niche || "Your Niche";
  const audience = profile?.audience || "target audience";

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-blue-400/10 flex items-center justify-center">
                <Compass className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Audience Map</h1>
                <p className="text-sm text-muted-foreground">Understand who follows you and how to reach each segment.</p>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20">Preview</Badge>
        </div>

        {/* Business context */}
        {profile && (
          <Card className="border-blue-400/20 bg-blue-400/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold">Business Context</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Niche: <span className="text-foreground font-medium">{niche}</span> 
                {profile.audience && <> | Target audience: <span className="text-foreground font-medium">{audience}</span></>}
                {profile.brandVoice && <> | Voice: <span className="text-foreground font-medium">{profile.brandVoice}</span></>}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Audience Segments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEGMENT_TEMPLATES.map((seg) => (
            <Card
              key={seg.name}
              className={`cursor-pointer transition-all hover:border-blue-400/30 ${
                expanded === seg.name ? "border-blue-400/30" : ""
              }`}
              onClick={() => setExpanded(expanded === seg.name ? null : seg.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-lg ${seg.bg} flex items-center justify-center`}>
                    <seg.icon className={`h-5 w-5 ${seg.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{seg.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{seg.size}</p>
                  </div>
                  <Badge className={`${seg.bg} ${seg.color} text-[9px]`}>{seg.value}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{seg.desc}</p>
                {expanded === seg.name && (
                  <div className="mt-3 pt-3 border-t border-border/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Best platforms: <span className="text-foreground">{seg.platforms}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Target className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Strategy: <span className="text-foreground">
                        {seg.name === "Core Fans" ? "Exclusive content, early access, community" :
                         seg.name === "Engaged Followers" ? "Call-to-action heavy, limited offers" :
                         seg.name === "Window Shoppers" ? "Value-first content, education, trust building" :
                         "Retargeting, reminder campaigns, algorithm-friendly hooks"}
                      </span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Content type: <span className="text-foreground">
                        {seg.name === "Core Fans" ? "Behind-the-scenes, Q&A, community posts" :
                         seg.name === "Engaged Followers" ? "Hooks, trends, quick tips, product demos" :
                         seg.name === "Window Shoppers" ? "Educational carousels, case studies, testimonials" :
                         "Short-form hooks, viral trends, discovery content"}
                      </span></span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="border-blue-400/20 bg-blue-400/5">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-semibold">Ready to build content for each segment?</p>
                <p className="text-xs text-muted-foreground">SPARK can generate hooks, scripts, and campaigns tailored to each audience type.</p>
              </div>
            </div>
            <Button className="bg-blue-400/20 text-blue-400 hover:bg-blue-400/30 border-blue-400/30">
              <ArrowRight className="h-4 w-4 mr-2" /> Generate Content
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
