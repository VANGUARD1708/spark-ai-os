import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Zap, ChevronDown, Check, RotateCcw, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AIField {
  key: string;
  label: string;
  emoji: string;
  value: string;
  options?: { value: string; label: string }[];
}

interface AIInputProps {
  title: string;
  subtitle: string;
  placeholder: string;
  examples: string[];
  fields: AIField[];
  extract: (text: string) => Record<string, string>;
  onGenerate: (values: Record<string, string>) => void;
  loading: boolean;
  ctaLabel: string;
  ctaIcon: React.ReactNode;
  initialPrompt?: string;
}

function compress(text: string, maxWords = 6): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ") + "…";
}

export function AIInput({
  title,
  subtitle,
  placeholder,
  examples,
  fields: initialFields,
  extract,
  onGenerate,
  loading,
  ctaLabel,
  ctaIcon,
  initialPrompt = "",
}: AIInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [detected, setDetected] = useState<AIField[] | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runExtraction = useCallback((text: string) => {
    if (!text.trim() || text.trim().length < 6) {
      setDetected(null);
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      const extracted = extract(text);
      const updated = initialFields.map(f => ({
        ...f,
        value: extracted[f.key] ?? f.value,
      }));
      setDetected(updated);
      setAnalyzing(false);
      setConfirmed(false);
    }, 600);
  }, [extract, initialFields]);

  useEffect(() => {
    if (initialPrompt) {
      runExtraction(initialPrompt);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (prompt.trim().length < 6) {
      setDetected(null);
      return;
    }
    debounceRef.current = setTimeout(() => {
      runExtraction(prompt);
    }, 700);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [prompt]);

  const handleExample = (ex: string) => {
    setPrompt(ex);
    textareaRef.current?.focus();
  };

  const updateField = (key: string, value: string) => {
    setDetected(prev => prev ? prev.map(f => f.key === key ? { ...f, value } : f) : prev);
  };

  const handleGenerate = () => {
    const values: Record<string, string> = {};
    (detected ?? initialFields).forEach(f => {
      values[f.key] = f.value;
    });
    setConfirmed(true);
    onGenerate(values);
  };

  const handleReset = () => {
    setPrompt("");
    setDetected(null);
    setConfirmed(false);
    setEditingKey(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const allFilled = detected ? detected.every(f => f.value.trim().length > 0) : false;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className={`relative rounded-2xl border transition-all duration-300 ${
        detected
          ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/5"
          : "border-border/50 bg-card/50 focus-within:border-primary/40 focus-within:shadow-lg focus-within:shadow-primary/5"
      }`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none leading-relaxed min-h-[72px]"
            />
          </div>

          {prompt.length === 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 pl-11">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(ex)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-primary/5 transition-all"
                >
                  {compress(ex, 5)}
                </button>
              ))}
            </div>
          )}

          {analyzing && (
            <div className="mt-3 pl-11 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">SPARK is reading your intent…</span>
            </div>
          )}
        </div>

        {detected && !analyzing && (
          <div className="border-t border-border/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">SPARK detected</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {detected.map(field => (
                <div key={field.key} className="flex items-center gap-2.5 group">
                  <span className="text-base shrink-0">{field.emoji}</span>
                  <span className="text-[11px] text-muted-foreground font-medium w-24 shrink-0">{field.label}</span>

                  {editingKey === field.key ? (
                    field.options ? (
                      <select
                        value={field.value}
                        onChange={e => { updateField(field.key, e.target.value); setEditingKey(null); }}
                        onBlur={() => setEditingKey(null)}
                        autoFocus
                        className="flex-1 text-xs bg-secondary/50 border border-primary/30 rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                      >
                        {field.options.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        autoFocus
                        value={field.value}
                        onChange={e => updateField(field.key, e.target.value)}
                        onBlur={() => setEditingKey(null)}
                        onKeyDown={e => e.key === "Enter" && setEditingKey(null)}
                        className="flex-1 text-xs bg-secondary/50 border border-primary/30 rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                      />
                    )
                  ) : (
                    <button
                      onClick={() => setEditingKey(field.key)}
                      className="flex-1 text-left text-xs font-medium px-2.5 py-1.5 rounded-lg bg-secondary/30 hover:bg-secondary/60 hover:border-primary/20 border border-transparent transition-all flex items-center justify-between gap-2"
                    >
                      <span className={field.value ? "text-foreground" : "text-muted-foreground/60 italic"}>
                        {field.value
                          ? (field.options?.find(o => o.value === field.value)?.label ?? field.value)
                          : "Not detected — tap to add"}
                      </span>
                      <Edit2 className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                onClick={handleGenerate}
                disabled={loading || !allFilled}
                className="flex-1 font-bold h-9 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generating…
                  </span>
                ) : confirmed ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Generating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {ctaIcon}
                    {ctaLabel}
                  </span>
                )}
              </Button>
              {!allFilled && (
                <p className="text-[10px] text-muted-foreground">Edit empty fields above to continue.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
