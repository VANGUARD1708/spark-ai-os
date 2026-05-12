import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import {
  Sparkles, Package, DollarSign, Gift, ChevronUp, ChevronDown,
  Plus, Trash2, ArrowRight, CheckCircle2, Zap, Star
} from "lucide-react";
import { useState } from "react";

interface Bonus {
  id: number;
  name: string;
  value: string;
}

interface Upsell {
  id: number;
  name: string;
  price: string;
  description: string;
}

const OFFER_TEMPLATES = [
  {
    name: "Digital Course Bundle",
    mainProduct: "30-Day Transformation Course",
    price: "97",
    upsells: [{ id: 1, name: "VIP Community Access", price: "47", description: "1-year access to the private members group" }],
    bonuses: [
      { id: 1, name: "Quick-Start Checklist", value: "$27" },
      { id: 2, name: "Private Podcast Feed", value: "$47" },
    ],
    guarantee: "30-Day Money Back Guarantee",
  },
  {
    name: "Template Pack",
    mainProduct: "Ultimate Notion Template Pack",
    price: "37",
    upsells: [{ id: 1, name: "Done-For-You Setup Call", price: "97", description: "1-hour setup and walkthrough session" }],
    bonuses: [
      { id: 1, name: "Video Tutorial Library", value: "$57" },
    ],
    guarantee: "14-Day Money Back Guarantee",
  },
];

export default function DigitalProduct() {
  const [mainProduct, setMainProduct] = useState("30-Day Fitness Transformation");
  const [price, setPrice] = useState("97");
  const [description, setDescription] = useState("A step-by-step program that helps busy people lose weight without gym equipment.");
  const [guarantee, setGuarantee] = useState("30-Day Money Back Guarantee");
  const [bonuses, setBonuses] = useState<Bonus[]>([
    { id: 1, name: "Quick-Start Cheat Sheet", value: "$27" },
    { id: 2, name: "Meal Plan Bonus", value: "$47" },
  ]);
  const [upsells, setUpsells] = useState<Upsell[]>([
    { id: 1, name: "1-on-1 Coaching Call", price: "97", description: "45-min personal coaching session" },
  ]);
  const [nextId, setNextId] = useState(10);

  const totalValue = bonuses.reduce((sum, b) => sum + (parseInt(b.value.replace("$", "")) || 0), 0) + parseInt(price || "0");

  const addBonus = () => {
    setBonuses(prev => [...prev, { id: nextId, name: "", value: "$27" }]);
    setNextId(n => n + 1);
  };
  const removeBonus = (id: number) => setBonuses(prev => prev.filter(b => b.id !== id));
  const updateBonus = (id: number, key: keyof Bonus, val: string) =>
    setBonuses(prev => prev.map(b => b.id === id ? { ...b, [key]: val } : b));

  const addUpsell = () => {
    setUpsells(prev => [...prev, { id: nextId, name: "", price: "47", description: "" }]);
    setNextId(n => n + 1);
  };
  const removeUpsell = (id: number) => setUpsells(prev => prev.filter(u => u.id !== id));
  const updateUpsell = (id: number, key: keyof Upsell, val: string) =>
    setUpsells(prev => prev.map(u => u.id === id ? { ...u, [key]: val } : u));

  const applyTemplate = (t: typeof OFFER_TEMPLATES[0]) => {
    setMainProduct(t.mainProduct);
    setPrice(t.price);
    setBonuses(t.bonuses);
    setUpsells(t.upsells);
    setGuarantee(t.guarantee);
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Offer Builder</h1>
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Beta</Badge>
          </div>
          <p className="text-muted-foreground text-sm">Stack your core product, bonuses, and upsells into an irresistible offer.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 text-xs text-muted-foreground flex items-center mr-1">Templates:</span>
          {OFFER_TEMPLATES.map((t, i) => (
            <button
              key={i}
              onClick={() => applyTemplate(t)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 font-medium transition-all"
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" /> Core Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Product Name</label>
                  <Input value={mainProduct} onChange={e => setMainProduct(e.target.value)} className="bg-background" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="bg-background resize-none h-20 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Price ($)</label>
                  <Input value={price} onChange={e => setPrice(e.target.value)} className="bg-background" placeholder="97" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Guarantee</label>
                  <Input value={guarantee} onChange={e => setGuarantee(e.target.value)} className="bg-background" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Gift className="h-4 w-4" /> Bonuses
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addBonus}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {bonuses.map(b => (
                  <div key={b.id} className="flex gap-2 items-center">
                    <Input
                      value={b.name}
                      onChange={e => updateBonus(b.id, "name", e.target.value)}
                      placeholder="Bonus name"
                      className="bg-background text-sm flex-1"
                    />
                    <Input
                      value={b.value}
                      onChange={e => updateBonus(b.id, "value", e.target.value)}
                      placeholder="$27"
                      className="bg-background text-sm w-16"
                    />
                    <button onClick={() => removeBonus(b.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {bonuses.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">No bonuses added yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <ChevronUp className="h-4 w-4" /> Order Bumps & Upsells
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addUpsell}>
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {upsells.map(u => (
                  <div key={u.id} className="p-3 rounded-lg border border-border/40 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={u.name}
                        onChange={e => updateUpsell(u.id, "name", e.target.value)}
                        placeholder="Upsell name"
                        className="bg-background text-sm flex-1"
                      />
                      <Input
                        value={u.price}
                        onChange={e => updateUpsell(u.id, "price", e.target.value)}
                        placeholder="$47"
                        className="bg-background text-sm w-16"
                      />
                      <button onClick={() => removeUpsell(u.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <Input
                      value={u.description}
                      onChange={e => updateUpsell(u.id, "description", e.target.value)}
                      placeholder="Short description…"
                      className="bg-background text-sm"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
              <CardHeader className="text-center pb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Your Complete Offer</p>
                <h2 className="text-2xl font-black">{mainProduct || "Your Product"}</h2>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{mainProduct || "Core Product"}</span>
                    <span className="ml-auto text-sm font-bold text-primary">${price || "0"}</span>
                  </div>
                  {bonuses.filter(b => b.name).map(b => (
                    <div key={b.id} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-border/40">
                      <Gift className="h-4 w-4 text-yellow-400 shrink-0" />
                      <span className="text-sm">{b.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground line-through">{b.value}</span>
                      <span className="text-xs font-bold text-green-400">FREE</span>
                    </div>
                  ))}
                </div>

                <div className="text-center p-4 rounded-xl bg-background border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                  <p className="text-3xl font-black text-muted-foreground line-through">${totalValue}</p>
                  <p className="text-5xl font-black text-primary mt-1">${price || "0"}</p>
                  {guarantee && (
                    <p className="text-xs text-muted-foreground mt-3">{guarantee}</p>
                  )}
                </div>

                {upsells.filter(u => u.name).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">One-Time Offers</p>
                    {upsells.filter(u => u.name).map(u => (
                      <div key={u.id} className="p-3 rounded-lg border border-yellow-400/20 bg-yellow-400/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">{u.name}</span>
                          <span className="font-bold text-yellow-400">${u.price}</span>
                        </div>
                        {u.description && <p className="text-xs text-muted-foreground">{u.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2">
                  <Link href={`/bundle?title=${encodeURIComponent(mainProduct)}&desc=${encodeURIComponent(description)}`}>
                    <Button className="w-full font-semibold">
                      <Zap className="h-4 w-4 mr-2" />
                      Enhance with AI Bundle Builder
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href={`/campaigns`}>
                    <Button variant="outline" className="w-full">
                      Launch Campaign
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
