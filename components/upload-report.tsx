"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, CheckCircle2, XCircle, Loader2, FileSpreadsheet, CloudUpload } from "lucide-react";

interface UploadResult {
  data: string;
  semana: string;
  registros: number;
  vendedores: { vendedor: string; total: number }[];
}

export function UploadReport({ onSuccess }: { onSuccess?: () => void }) {
  const [dragging, setDragging]   = useState(false);
  const [status,   setStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message,  setMessage]    = useState("");
  const [result,   setResult]     = useState<UploadResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const upload = useCallback(async (file: File) => {
    setStatus("loading");
    setMessage("Processando relatório...");
    setResult(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res  = await fetch("/api/upload-report", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Erro ao processar o arquivo.");
        return;
      }

      setStatus("success");
      setResult(json as UploadResult);
      setMessage(`${json.registros} vendedores importados com sucesso.`);
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage("Falha na conexão. Tente novamente.");
    }
  }, [onSuccess]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }, [upload]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8
          flex flex-col items-center justify-center gap-3 text-center select-none
          ${dragging
            ? "border-[var(--western-gold)] bg-[var(--western-gold)]/10 scale-[1.01]"
            : "border-border/60 hover:border-[var(--western-gold)]/50 hover:bg-[var(--western-gold)]/5"
          }
          ${status === "loading" ? "pointer-events-none opacity-70" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={handleChange}
        />

        <div className={`p-4 rounded-2xl transition-colors ${dragging ? "bg-[var(--western-gold)]/20" : "bg-muted/50"}`}>
          {status === "loading"
            ? <Loader2 className="w-8 h-8 text-[var(--western-gold)] animate-spin" />
            : <CloudUpload className="w-8 h-8 text-[var(--western-gold)]" />
          }
        </div>

        <div>
          <p className="font-bold text-base font-heading">
            {status === "loading" ? "Processando..." : "Arraste o relatório aqui"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {status === "loading"
              ? "Aguarde, importando dados..."
              : "Relatorio_PedidosPA-YYYY-MM-DD.xls · ou clique para selecionar"
            }
          </p>
        </div>

        {dragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--western-gold)]/5 pointer-events-none">
            <Upload className="w-12 h-12 text-[var(--western-gold)] opacity-80" />
          </div>
        )}
      </div>

      {/* Status feedback */}
      {status !== "idle" && status !== "loading" && (
        <div className={`
          flex items-start gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300
          ${status === "success"
            ? "bg-green-500/10 border-green-500/30 text-green-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
          }
        `}>
          {status === "success"
            ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            : <XCircle       className="w-5 h-5 mt-0.5 shrink-0" />
          }
          <div className="flex-1">
            <p className="font-semibold text-sm">{message}</p>
            {result && (
              <p className="text-xs mt-1 opacity-80">
                Data: {result.data} · Semana: {result.semana}
              </p>
            )}
          </div>
          <button
            onClick={() => { setStatus("idle"); setResult(null); setMessage(""); }}
            className="text-current opacity-60 hover:opacity-100 transition-opacity text-xs font-medium"
          >
            ✕
          </button>
        </div>
      )}

      {/* Vendedor breakdown */}
      {result && status === "success" && (
        <div className="rounded-xl border border-border/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="px-4 py-3 bg-card border-b border-border/50 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[var(--western-gold)]" />
            <span className="text-sm font-bold font-heading">Dados importados</span>
          </div>
          <div className="divide-y divide-border/30">
            {result.vendedores
              .sort((a, b) => b.total - a.total)
              .map((v) => (
                <div key={v.vendedor} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors">
                  <span className="text-sm font-medium">{v.vendedor}</span>
                  <span className="text-sm font-bold font-mono text-[var(--western-gold)]">{fmt(v.total)}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
