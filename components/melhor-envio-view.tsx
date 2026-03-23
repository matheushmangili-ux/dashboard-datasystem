"use client";

import { useState } from "react";
import { Truck, Package, MapPin, Calculator, Clock, Shield, Star, Loader2 } from "lucide-react";

/* ───── Types ───── */
interface ShippingQuote {
  id: string;
  carrier: string;
  service: string;
  price: number;
  deliveryDays: number;
  logo: string;
  recommended?: boolean;
}

/* ───── Mock shipping results ───── */
function generateMockQuotes(weight: number, _height: number, _width: number, _length: number): ShippingQuote[] {
  const basePrice = weight * 2.5;
  return [
    {
      id: "me-1",
      carrier: "Correios",
      service: "SEDEX",
      price: basePrice + 18.9,
      deliveryDays: 3,
      logo: "correios",
      recommended: false,
    },
    {
      id: "me-2",
      carrier: "Correios",
      service: "PAC",
      price: basePrice + 8.5,
      deliveryDays: 7,
      logo: "correios",
      recommended: true,
    },
    {
      id: "me-3",
      carrier: "Jadlog",
      service: ".Package",
      price: basePrice + 12.3,
      deliveryDays: 5,
      logo: "jadlog",
    },
    {
      id: "me-4",
      carrier: "Azul Cargo",
      service: "E-commerce",
      price: basePrice + 22.0,
      deliveryDays: 2,
      logo: "azul",
    },
    {
      id: "me-5",
      carrier: "Loggi",
      service: "Loggi Ponto",
      price: basePrice + 15.6,
      deliveryDays: 4,
      logo: "loggi",
    },
    {
      id: "me-6",
      carrier: "Kangu",
      service: "Economico",
      price: basePrice + 6.2,
      deliveryDays: 9,
      logo: "kangu",
    },
  ];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/* ───── Carrier logo placeholder ───── */
function CarrierLogo({ carrier }: { carrier: string }) {
  const colors: Record<string, string> = {
    "Correios": "bg-[#FFCD00] text-[#003781]",
    "Jadlog": "bg-[#E31E24] text-white",
    "Azul Cargo": "bg-[#003DA5] text-white",
    "Loggi": "bg-[#00B4D8] text-white",
    "Kangu": "bg-[#7B2D8E] text-white",
  };

  const colorClass = colors[carrier] || "bg-muted text-foreground";

  return (
    <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center text-xs font-black shadow-sm`}>
      {carrier.slice(0, 2).toUpperCase()}
    </div>
  );
}

/* ═════════════════════════════════════════════════════ */
/* ═══            MAIN COMPONENT                   ═══ */
/* ═════════════════════════════════════════════════════ */

export function MelhorEnvioView() {
  const [cepOrigem, setCepOrigem] = useState("01310-100");
  const [cepDestino, setCepDestino] = useState("");
  const [peso, setPeso] = useState<number>(0.5);
  const [altura, setAltura] = useState<number>(10);
  const [largura, setLargura] = useState<number>(15);
  const [comprimento, setComprimento] = useState<number>(20);
  const [valorDeclarado, setValorDeclarado] = useState<number>(0);

  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "delivery">("price");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setHasSearched(false);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results = generateMockQuotes(peso, altura, largura, comprimento);
    setQuotes(results);
    setIsCalculating(false);
    setHasSearched(true);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    return a.deliveryDays - b.deliveryDays;
  });

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      {/* Header */}
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <div className="flex items-center gap-3 mb-1">
          <Truck className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-extrabold font-heading tracking-tight">Calculadora de Frete</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          Simule fretes com as principais transportadoras via Melhor Envio.
        </p>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[11px] font-bold text-[#22C55E]">Melhor Envio API</span>
        </div>
      </header>

      <div className="p-8 w-full max-w-[1200px] flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── Form Panel ─── */}
          <div className="lg:col-span-1">
            <form onSubmit={handleCalculate} className="bg-card border border-border rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold font-heading tracking-tight mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Dados do Envio
              </h2>

              {/* CEPs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground uppercase tracking-wider">CEP Origem</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={cepOrigem}
                      onChange={(e) => setCepOrigem(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-foreground uppercase tracking-wider">CEP Destino</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-primary" />
                    <input
                      type="text"
                      value={cepDestino}
                      onChange={(e) => setCepDestino(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="mb-6">
                <label className="block text-xs font-bold mb-3 text-foreground uppercase tracking-wider">Dimensões (cm)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase">Altura</label>
                    <input
                      type="number"
                      min={1}
                      value={altura}
                      onChange={(e) => setAltura(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase">Largura</label>
                    <input
                      type="number"
                      min={1}
                      value={largura}
                      onChange={(e) => setLargura(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground font-bold uppercase">Compr.</label>
                    <input
                      type="number"
                      min={1}
                      value={comprimento}
                      onChange={(e) => setComprimento(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-center focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="mb-6">
                <label className="block text-xs font-bold mb-1.5 text-foreground uppercase tracking-wider">Peso (kg)</label>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={peso}
                  onChange={(e) => setPeso(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Declared value */}
              <div className="mb-6">
                <label className="block text-xs font-bold mb-1.5 text-foreground uppercase tracking-wider">Valor Declarado (opcional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-bold">R$</span>
                  <input
                    type="number"
                    min={0}
                    value={valorDeclarado || ""}
                    onChange={(e) => setValorDeclarado(Number(e.target.value))}
                    placeholder="0,00"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Calculate button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-60"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calcular Frete
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ─── Results Panel ─── */}
          <div className="lg:col-span-2">
            {!hasSearched && !isCalculating && (
              <div className="bg-card border border-border rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                  <Truck className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold text-muted-foreground mb-2">Simule seu frete</h3>
                <p className="text-sm text-muted-foreground/70 max-w-sm">
                  Preencha os dados do pacote e o CEP de destino para comparar precos e prazos das transportadoras.
                </p>
              </div>
            )}

            {isCalculating && (
              <div className="bg-card border border-border rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin border-t-primary" />
                  <Truck className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm font-bold text-muted-foreground mt-6 animate-pulse">
                  Consultando transportadoras...
                </p>
              </div>
            )}

            {hasSearched && !isCalculating && quotes.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Sort controls */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold font-heading tracking-tight">
                    {quotes.length} opções encontradas
                  </h3>
                  <div className="flex bg-muted p-1 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setSortBy("price")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        sortBy === "price"
                          ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Menor Preco
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortBy("delivery")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        sortBy === "delivery"
                          ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Mais Rapido
                    </button>
                  </div>
                </div>

                {/* Quotes list */}
                {sortedQuotes.map((quote, idx) => (
                  <div
                    key={quote.id}
                    className={`bg-card border rounded-2xl shadow-sm p-5 flex items-center gap-5 transition-all hover:shadow-md hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-2 ${
                      quote.recommended ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                    }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Carrier logo */}
                    <CarrierLogo carrier={quote.carrier} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{quote.carrier}</span>
                        <span className="text-xs text-muted-foreground font-medium">- {quote.service}</span>
                        {quote.recommended && (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-primary/15 text-primary rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" /> Recomendado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1.5">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium">{quote.deliveryDays} dias uteis</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Shield className="w-3.5 h-3.5" />
                          <span className="font-medium">Rastreavel</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xl font-black text-foreground font-heading">{formatCurrency(quote.price)}</p>
                    </div>
                  </div>
                ))}

                {/* Disclaimer */}
                <p className="text-[10px] text-muted-foreground/60 text-center mt-4 italic">
                  * Valores simulados. Para cotações em tempo real, integre sua chave API do Melhor Envio.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
