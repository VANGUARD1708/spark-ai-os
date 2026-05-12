import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  FolderOpen, FileText, Video, Mic, Image, Download,
  Trash2, Plus, ArrowRight, Zap, Crown, Clock
} from "lucide-react";
import { useState } from "react";

const FILE_TYPES = ["All", "Scripts", "PDFs", "Images", "Audio"];

interface FileItem {
  id: number;
  name: string;
  type: "script" | "pdf" | "image" | "audio";
  size: string;
  created: string;
  source: string;
}

const SAMPLE_FILES: FileItem[] = [
  { id: 1, name: "30-Day Fitness Transformation — TikTok Script", type: "script", size: "4 KB", created: "Today", source: "TikTok Scripts" },
  { id: 2, name: "Wellness Brand Identity Guide", type: "pdf", size: "2.1 MB", created: "Yesterday", source: "Brand Builder" },
  { id: 3, name: "Cortisol Morning Routine — Hook Pack", type: "script", size: "6 KB", created: "2 days ago", source: "Viral Hooks" },
  { id: 4, name: "Digital Product Bundle — Offer Sheet", type: "pdf", size: "890 KB", created: "3 days ago", source: "Bundle Builder" },
];

const TYPE_CONFIG = {
  script: { icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", label: "Script" },
  pdf: { icon: FileText, color: "text-red-400", bg: "bg-red-400/10", label: "PDF" },
  image: { icon: Image, color: "text-purple-400", bg: "bg-purple-400/10", label: "Image" },
  audio: { icon: Mic, color: "text-green-400", bg: "bg-green-400/10", label: "Audio" },
};

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>(SAMPLE_FILES);
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All"
    ? files
    : files.filter(f => {
        if (filter === "Scripts") return f.type === "script";
        if (filter === "PDFs") return f.type === "pdf";
        if (filter === "Images") return f.type === "image";
        if (filter === "Audio") return f.type === "audio";
        return true;
      });

  const removeFile = (id: number) => setFiles(prev => prev.filter(f => f.id !== id));

  return (
    <Layout>
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-500">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Files</h1>
              <Badge variant="outline" className="border-blue-400/30 text-blue-400 text-[10px]">Beta</Badge>
            </div>
            <p className="text-muted-foreground text-sm">All your generated assets, scripts, and exports in one place.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border/50 text-muted-foreground text-[10px]">
              {files.length} files
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Scripts", count: files.filter(f => f.type === "script").length, icon: FileText, color: "text-blue-400" },
            { label: "PDFs", count: files.filter(f => f.type === "pdf").length, icon: FileText, color: "text-red-400" },
            { label: "Images", count: files.filter(f => f.type === "image").length, icon: Image, color: "text-purple-400" },
            { label: "Audio", count: files.filter(f => f.type === "audio").length, icon: Mic, color: "text-green-400" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="border-border/50 bg-card/50">
                <CardContent className="p-3 text-center">
                  <Icon className={`h-4 w-4 mx-auto mb-1 ${s.color}`} />
                  <p className="text-xl font-black">{s.count}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                filter === t
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map(file => {
              const cfg = TYPE_CONFIG[file.type];
              const Icon = cfg.icon;
              return (
                <Card key={file.id} className="border-border/50 bg-card/50 hover:border-border transition-all group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{file.size}</span>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />{file.created}
                        </span>
                        <Badge variant="outline" className="text-[9px] h-4 border-border/50 text-muted-foreground">{file.source}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-border/40 bg-card/20">
            <CardContent className="p-8 text-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No {filter.toLowerCase()} files yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Generate content to populate your files.</p>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/scripts" className="flex-1">
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Generate Script
            </Button>
          </Link>
          <Link href="/bundle" className="flex-1">
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Build Bundle
            </Button>
          </Link>
          <Link href="/brand-builder" className="flex-1">
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Create Brand Kit
            </Button>
          </Link>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5">
          <div className="flex items-center gap-3">
            <Crown className="h-7 w-7 text-yellow-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Unlimited file storage with Pro</p>
              <p className="text-xs text-muted-foreground">Auto-export, organized folders, download as ZIP, and delivery to customers.</p>
            </div>
            <Link href="/pricing" className="ml-auto shrink-0">
              <Button size="sm">Unlock Pro</Button>
            </Link>
          </div>
        </Card>

      </div>
    </Layout>
  );
}
