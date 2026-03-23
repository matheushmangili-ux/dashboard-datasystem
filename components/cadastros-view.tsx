"use client";

import { useState, useEffect } from "react";
import { SidebarView } from "./sidebar";
import { PlusCircle, Target, Users, Trash2 } from "lucide-react";

export type Seller = {
  id: string;
  nome: string;
  email: string;
  nascimento: string;
  admissao: string;
  cpf: string;
  telefone: string;
  foto: string;
  departamento: string;
  canal: string;
  status: string;
};

export function CadastrosView({ onNavigate }: { onNavigate: (view: SidebarView) => void }) {
  const [activeTab, setActiveTab] = useState<"vendedores" | "metas">("vendedores");
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Form State
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [admissao, setAdmissao] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [foto, setFoto] = useState("");
  const [departamento, setDepartamento] = useState("Vestuário");
  const [canal, setCanal] = useState("Loja Física Principal (Data System)");
  const [status, setStatus] = useState("Ativo - Em Loja");

  useEffect(() => {
    const stored = localStorage.getItem("tc_sellers");
    if (stored) {
      try {
        setSellers(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const saveSellers = (newSellers: Seller[]) => {
    setSellers(newSellers);
    localStorage.setItem("tc_sellers", JSON.stringify(newSellers));
  };

  const handleCreateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeller: Seller = {
      id: Math.random().toString(36).substr(2, 9),
      nome, email, nascimento, admissao, cpf, telefone, foto, departamento, canal, status
    };
    saveSellers([...sellers, newSeller]);
    
    // Reset fields
    setNome(""); setEmail(""); setNascimento(""); setAdmissao("");
    setCpf(""); setTelefone(""); setFoto("");
    
    alert("Vendedor cadastrado com sucesso!");
  };

  const handleDelete = (id: string) => {
    saveSellers(sellers.filter(s => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col items-start w-full bg-background min-h-screen">
      <header className="px-8 py-8 w-full border-b border-border/50 bg-card">
        <h1 className="text-3xl font-extrabold font-heading tracking-tight">Central de Cadastros</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Gerencie sua equipe de vendas e metas operacionais do varejo.</p>
      </header>
      
      <div className="p-8 w-full max-w-[1200px]">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-muted/40 p-1.5 rounded-xl w-fit border border-border/50">
          <button 
            onClick={() => setActiveTab("vendedores")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              activeTab === "vendedores" 
                ? "bg-background shadow-md text-foreground ring-1 ring-border" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Users className="w-4 h-4" /> Vendedores
          </button>
          <button 
            onClick={() => setActiveTab("metas")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              activeTab === "metas" 
                ? "bg-background shadow-md text-foreground ring-1 ring-border" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Target className="w-4 h-4" /> Diretrizes de Metas
          </button>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === "vendedores" && (
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Form */}
              <div className="bg-card border border-border rounded-2xl shadow-sm p-8 flex-1 w-full max-w-[800px]">
                <h2 className="text-xl font-bold mb-6 font-heading tracking-tight">Novo Vendedor</h2>
                <form className="space-y-5" onSubmit={handleCreateSeller}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Nome Completo</label>
                      <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Ana Ribeiro" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder-muted-foreground" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">E-mail</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ana@exemplo.com" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Telefone / WhatsApp</label>
                      <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(XX) XXXXX-XXXX" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">CPF</label>
                      <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Data de Nascimento</label>
                      <input type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all cursor-text tracking-wide" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Data de Admissão</label>
                      <input type="date" value={admissao} onChange={e => setAdmissao(e.target.value)} required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all cursor-text tracking-wide" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">URL da Foto</label>
                      <input type="url" value={foto} onChange={e => setFoto(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Departamento (Peso)</label>
                      <select value={departamento} onChange={e => setDepartamento(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                        <option>Vestuário</option>
                        <option>Chapelaria</option>
                        <option>Selaria</option>
                        <option>Calçados</option>
                        <option>Geral / Outros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Canal Comercial / Equipe</label>
                      <select value={canal} onChange={e => setCanal(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                        <option>Loja Física Principal (Data System)</option>
                        <option>E-commerce (Tray)</option>
                        <option>Venda Corporativa / B2B</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-1.5 text-foreground">Status do Colaborador</label>
                      <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                        <option>Ativo - Em Loja</option>
                        <option>Afastado</option>
                        <option>Desligado</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md w-full md:w-auto">
                      <PlusCircle className="w-5 h-5" /> Cadastrar Vendedor
                    </button>
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="bg-card border border-border rounded-2xl shadow-sm p-6 w-full xl:w-[400px]">
                <h3 className="text-lg font-bold font-heading mb-4 border-b border-border/50 pb-2">Vendedores Cadastrados ({sellers.length})</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {sellers.length === 0 ? (
                     <p className="text-sm text-muted-foreground text-center py-8">Nenhum vendedor cadastrado ainda.</p>
                  ) : (
                    sellers.map(s => (
                      <div key={s.id} className="p-3 bg-muted/20 border border-border/50 rounded-xl flex items-center gap-3 relative group">
                        <img 
                          src={s.foto || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + s.nome} 
                          alt={s.nome} 
                          className="w-10 h-10 rounded-full bg-background border border-border object-cover" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{s.nome}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold truncate">{s.departamento} &bull; {s.canal.split(' ')[0]}</p>
                        </div>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg absolute right-2 opacity-0 group-hover:opacity-100 transition-all">
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "metas" && (
            <div className="bg-card border border-border rounded-2xl shadow-sm p-8 w-full max-w-[900px]">
              <h2 className="text-xl font-bold mb-2 font-heading tracking-tight">Metas Ponderadas (Semanal/Quinzenal)</h2>
              <p className="text-sm text-muted-foreground mb-8 font-medium">Defina o atingimento financeiro desejado para períodos customizados. Essas metas são exportadas para os motores (Data System / Tray).</p>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Diretrizes de metas salvas!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/20 border border-border/50 rounded-xl">
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Período de Início</label>
                    <input type="date" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-text" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Data de Fim (Encerramento)</label>
                    <input type="date" required className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-text" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Valor Projetado (Meta Histórica)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-muted-foreground font-bold">R$</span>
                      <input type="number" placeholder="150.000" min="0" required className="w-full pl-11 pr-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none font-mono font-medium" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-foreground">Canal da Meta</label>
                    <select className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none text-foreground cursor-pointer">
                      <option>Loja Física Analítica</option>
                      <option>Tráfego + E-commerce</option>
                      <option>Consolidado Global</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-border mt-6">
                  <button type="submit" className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md w-full md:w-auto">
                    <Target className="w-5 h-5" /> Salvar Diretrizes
                  </button>
                  <p className="text-xs text-muted-foreground mt-3 font-medium">Nota: Para distribuir essa meta por departamento e vendedor, utilize o painel de <b>Metas</b> no menu principal.</p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
