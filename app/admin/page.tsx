"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClienteRecord = {
  id: number; createdAt: string;
  ragioneSociale: string; piva: string; via: string; cap: string; citta: string;
  contattoEmail: string; contattoTelefono: string | null;
  respNome: string; respCognome: string; respEmail: string; respTelefono: string | null;
  manutNome: string; manutCognome: string; manutEmail: string; manutTelefono: string | null;
  dittaAzienda: string; dittaEmail: string; dittaTelefono: string;
  tipoAttivita: string; numUtenti: number; numPersonale: number; tipoUtenti: string;
  repartiSpeciali: string; repartiSpecialiDettaglio: string | null;
};

type StrutturaRecord = {
  id: number; createdAt: string;
  ragioneSociale: string; piva: string; indirizzo: string | null; citta: string | null;
  telefono: string | null; email: string | null;
  tipologiaStruttura: string; periodoEsercizio: string;
  valutazioneRischioLegionellosi: string; dataValutazione: string | null; noteValutazione: string | null;
  pianoGestioneRischio: string; notePianoGestione: string | null;
  campionamentiLegionella: string; noteCampionamenti: string | null;
  registroIgiene: string; noteRegistro: string | null;
  pc1: number | null; pc2: number | null; pc3: number | null; pc4: number | null; pc5: number | null;
  tac1: number | null; tac2: number | null; tac3: number | null; tac4: number | null; tac5: number | null;
  taf1: number | null; taf2: number | null; taf3: number | null; taf4: number | null; taf5: number | null;
  cd1: number | null; cd2: number | null; cd3: number | null; cd4: number | null; cd5: number | null;
  diff1: string | null; diff2: string | null; diff3: string | null; diff4: string | null; diff5: string | null;
  sistemaDisinfezione: string; noteDisinfezione: string | null;
  schedaSicurezza: string | null; noteSchedaSicurezza: string | null;
  sistemaControlloAutomatico: string | null; noteControlloAutomatico: string | null;
};

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function Badge({ label, variant }: { label: string; variant: "green" | "amber" | "blue" | "slate" }) {
  const cls = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    blue:  "bg-blue-100  text-blue-700",
    slate: "bg-slate-100 text-slate-500",
  }[variant];
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
}

function SiNoBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-slate-300">—</span>;
  return <Badge label={value} variant={value === "Si" ? "green" : "slate"} />;
}

function DRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-slate-800">
        {value !== null && value !== undefined && value !== "" ? value : <span className="text-slate-300 italic text-xs">—</span>}
      </span>
    </div>
  );
}

function DSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-2 px-1">{title}</p>
      <div className="bg-slate-50 rounded-xl px-3">{children}</div>
    </div>
  );
}

function StatCard({ icon, label, count, sub, gradient }: {
  icon: React.ReactNode; label: string; count: number; sub?: string; gradient: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-3xl font-bold text-slate-800 leading-none tabular-nums">{count}</p>
        {sub && <p className="text-xs text-slate-400 mt-1 truncate">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Detail panel content ─────────────────────────────────────────────────────

function ClienteDetail({ r }: { r: ClienteRecord }) {
  return (
    <>
      <DSection title="Azienda">
        <DRow label="Ragione sociale" value={r.ragioneSociale} />
        <DRow label="P.IVA" value={r.piva} />
        <DRow label="Indirizzo" value={`${r.via}, ${r.cap} ${r.citta}`} />
      </DSection>
      <DSection title="Contatto azienda">
        <DRow label="Email" value={r.contattoEmail} />
        <DRow label="Telefono" value={r.contattoTelefono} />
      </DSection>
      <DSection title="Responsabile aziendale">
        <DRow label="Nominativo" value={`${r.respNome} ${r.respCognome}`} />
        <DRow label="Email" value={r.respEmail} />
        <DRow label="Telefono" value={r.respTelefono} />
      </DSection>
      <DSection title="Responsabile manutenzione">
        <DRow label="Nominativo" value={`${r.manutNome} ${r.manutCognome}`} />
        <DRow label="Email" value={r.manutEmail} />
        <DRow label="Telefono" value={r.manutTelefono} />
      </DSection>
      <DSection title="Ditta esterna manutenzione">
        <DRow label="Azienda" value={r.dittaAzienda} />
        <DRow label="Email" value={r.dittaEmail} />
        <DRow label="Telefono" value={r.dittaTelefono} />
      </DSection>
      <DSection title="Struttura">
        <DRow label="Tipo attività" value={r.tipoAttivita} />
        <DRow label="N° utenti / camere / bagni" value={r.numUtenti} />
        <DRow label="N° personale" value={r.numPersonale} />
        <DRow label="Tipo utenti" value={r.tipoUtenti} />
        <DRow label="Reparti speciali" value={r.repartiSpeciali} />
        {r.repartiSpecialiDettaglio && <DRow label="Dettaglio reparti" value={r.repartiSpecialiDettaglio} />}
      </DSection>
    </>
  );
}

function StrutturaDetail({ r }: { r: StrutturaRecord }) {
  const mrows = [
    { label: "Punto di controllo",      vals: [r.pc1, r.pc2, r.pc3, r.pc4, r.pc5] },
    { label: "T. acqua calda (°C)",      vals: [r.tac1, r.tac2, r.tac3, r.tac4, r.tac5] },
    { label: "T. acqua fredda (°C)",     vals: [r.taf1, r.taf2, r.taf3, r.taf4, r.taf5] },
    { label: "Conc. disinfettante (mg/L)",vals: [r.cd1, r.cd2, r.cd3, r.cd4, r.cd5] },
    { label: "Condizioni diffusori",     vals: [r.diff1, r.diff2, r.diff3, r.diff4, r.diff5] },
  ];
  return (
    <>
      <DSection title="Struttura">
        <DRow label="Ragione sociale" value={r.ragioneSociale} />
        <DRow label="P.IVA" value={r.piva} />
        <DRow label="Indirizzo" value={r.indirizzo} />
        <DRow label="Città" value={r.citta} />
        <DRow label="Telefono" value={r.telefono} />
        <DRow label="Email" value={r.email} />
        <DRow label="Tipologia" value={r.tipologiaStruttura} />
        <DRow label="Periodo esercizio" value={r.periodoEsercizio} />
      </DSection>
      <DSection title="Valutazione rischio Legionella">
        <DRow label="Valutazione effettuata" value={r.valutazioneRischioLegionellosi} />
        <DRow label="Data emissione" value={r.dataValutazione} />
        <DRow label="Note" value={r.noteValutazione} />
        <DRow label="Piano di gestione rischio" value={r.pianoGestioneRischio} />
        <DRow label="Note piano" value={r.notePianoGestione} />
      </DSection>
      <DSection title="Igiene e monitoraggio">
        <DRow label="Campionamenti Legionella" value={r.campionamentiLegionella} />
        <DRow label="Note campionamenti" value={r.noteCampionamenti} />
        <DRow label="Registro igiene/manutenzione" value={r.registroIgiene} />
        <DRow label="Note registro" value={r.noteRegistro} />
      </DSection>
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-2 px-1">Misurazioni</p>
        <div className="bg-slate-50 rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left px-3 py-2 text-slate-500 font-medium">Parametro</th>
                {[1, 2, 3, 4, 5].map((n) => (
                  <th key={n} className="px-3 py-2 text-slate-500 font-medium text-center">{n}ª</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mrows.map((m) => (
                <tr key={m.label} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 text-slate-600 font-medium whitespace-nowrap">{m.label}</td>
                  {m.vals.map((v, i) => (
                    <td key={i} className="px-3 py-2 text-center text-slate-700">
                      {v !== null && v !== undefined ? v : <span className="text-slate-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DSection title="Sistema di disinfezione">
        <DRow label="Sistema presente" value={r.sistemaDisinfezione} />
        <DRow label="Note" value={r.noteDisinfezione} />
        <DRow label="Scheda di sicurezza" value={r.schedaSicurezza} />
        <DRow label="Note scheda sicurezza" value={r.noteSchedaSicurezza} />
        <DRow label="Controllo automatico" value={r.sistemaControlloAutomatico} />
        <DRow label="Note controllo automatico" value={r.noteControlloAutomatico} />
      </DSection>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [checking,   setChecking]   = useState(true);
  const [authed,     setAuthed]     = useState(false);
  const [pin,        setPin]        = useState("");
  const [pinError,   setPinError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [tab,         setTab]         = useState<"clienti" | "strutture">("clienti");
  const [clienti,     setClienti]     = useState<ClienteRecord[]>([]);
  const [strutture,   setStrutture]   = useState<StrutturaRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search,      setSearch]      = useState("");

  const [selectedC, setSelectedC] = useState<ClienteRecord | null>(null);
  const [selectedS, setSelectedS] = useState<StrutturaRecord | null>(null);
  const panelOpen = selectedC !== null || selectedS !== null;

  useEffect(() => {
    const isAuthed = document.cookie.split(";").some((c) => c.trim().startsWith("admin_auth="));
    setAuthed(isAuthed);
    setChecking(false);
  }, []);

  function loadData() {
    setDataLoading(true);
    Promise.all([
      fetch("/api/identificazione-cliente").then((r) => r.json()),
      fetch("/api/identificazione-struttura").then((r) => r.json()),
    ])
      .then(([c, s]) => { setClienti(c); setStrutture(s); })
      .finally(() => setDataLoading(false));
  }

  useEffect(() => { if (authed) loadData(); }, [authed]);

  function closePanel() { setSelectedC(null); setSelectedS(null); }

  const filteredClienti = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clienti;
    return clienti.filter((c) =>
      c.ragioneSociale.toLowerCase().includes(q) ||
      c.piva.toLowerCase().includes(q) ||
      c.citta?.toLowerCase().includes(q) ||
      c.tipoAttivita?.toLowerCase().includes(q)
    );
  }, [clienti, search]);

  const filteredStrutture = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return strutture;
    return strutture.filter((s) =>
      s.ragioneSociale.toLowerCase().includes(q) ||
      s.piva.toLowerCase().includes(q) ||
      s.citta?.toLowerCase().includes(q) ||
      s.tipologiaStruttura?.toLowerCase().includes(q)
    );
  }, [strutture, search]);

  async function handlePin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setPinError("");
    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) { setAuthed(true); }
      else { setPinError("PIN non corretto"); setPin(""); }
    } catch { setPinError("Errore di rete"); }
    finally { setSubmitting(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false); setClienti([]); setStrutture([]); closePanel();
  }

  if (checking) return null;

  // ── PIN screen ──────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 max-w-sm w-full">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 text-center mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-400 text-center mb-8">Inserisci il PIN per accedere</p>
          <form onSubmit={handlePin} noValidate>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(""); }}
              placeholder="• • • •"
              maxLength={8}
              autoFocus
              className={`w-full text-center text-2xl tracking-[0.6em] px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition mb-1 placeholder:tracking-normal placeholder:text-slate-300 placeholder:text-sm ${
                pinError ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:ring-blue-100 focus:border-blue-400"
              }`}
            />
            <div className="h-5 flex items-center justify-center mb-4">
              {pinError && <p className="text-xs text-red-500">{pinError}</p>}
            </div>
            <button
              type="submit"
              disabled={submitting || !pin}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition disabled:opacity-40"
            >
              {submitting ? "Verifica..." : "Accedi"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin panel ─────────────────────────────────────────────────────────────
  const lastCliente  = clienti[0]  ? new Date(clienti[0].createdAt).toLocaleDateString("it-IT")  : undefined;
  const lastStruttura = strutture[0] ? new Date(strutture[0].createdAt).toLocaleDateString("it-IT") : undefined;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">S</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Admin Panel</span>
              <span className="hidden sm:block h-4 w-px bg-slate-200" />
              <span className="hidden sm:block text-xs text-slate-400">Archivio questionari</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={dataLoading}
              className="text-slate-400 hover:text-slate-600 transition disabled:opacity-40"
              title="Aggiorna dati"
            >
              <svg className={`w-4 h-4 ${dataLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <Link
              href="/"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuovo questionario
            </Link>
            <div className="h-4 w-px bg-slate-200" />
            <button onClick={logout} className="text-xs text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Esci
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard
            gradient="bg-gradient-to-br from-indigo-500 to-blue-600"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            label="Clienti salvati"
            count={clienti.length}
            sub={lastCliente ? `Ultimo: ${lastCliente}` : "Nessun record"}
          />
          <StatCard
            gradient="bg-gradient-to-br from-slate-500 to-slate-700"
            icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            label="Strutture salvate"
            count={strutture.length}
            sub={lastStruttura ? `Ultima: ${lastStruttura}` : "Nessun record"}
          />
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex gap-1.5 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            {(["clienti", "strutture"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSearch(""); closePanel(); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                  tab === t ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t}
                <span className={`ml-1.5 text-xs ${tab === t ? "text-slate-300" : "text-slate-400"}`}>
                  {t === "clienti" ? clienti.length : strutture.length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Cerca per ragione sociale, P.IVA, città...`}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition placeholder:text-slate-300"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {search && (
            <span className="text-xs text-slate-400">
              {tab === "clienti" ? filteredClienti.length : filteredStrutture.length} risultati
            </span>
          )}
        </div>

        {/* Table */}
        {dataLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-24 text-center">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Caricamento...</p>
          </div>
        ) : tab === "clienti" ? (
          filteredClienti.length === 0 ? (
            <EmptyState search={!!search} entity="cliente" />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      {["#", "Data", "Ragione sociale", "P.IVA", "Città", "Attività", "Utenti", "Rep. speciali", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClienti.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => { setSelectedC(c); setSelectedS(null); }}
                        className={`border-b border-slate-100 cursor-pointer transition-colors ${
                          selectedC?.id === c.id ? "bg-blue-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{c.id}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{c.ragioneSociale}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{c.piva}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.citta}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">{c.tipoAttivita}</td>
                        <td className="px-4 py-3 text-slate-600 text-center tabular-nums">{c.numUtenti}</td>
                        <td className="px-4 py-3">
                          <Badge label={c.repartiSpeciali} variant={c.repartiSpeciali === "Si" ? "amber" : "slate"} />
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-right pr-5">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          filteredStrutture.length === 0 ? (
            <EmptyState search={!!search} entity="struttura" />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">
                      {["#", "Data", "Ragione sociale", "P.IVA", "Tipologia", "Periodo", "Legionella", "Disinfezione", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStrutture.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => { setSelectedS(s); setSelectedC(null); }}
                        className={`border-b border-slate-100 cursor-pointer transition-colors ${
                          selectedS?.id === s.id ? "bg-blue-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{s.id}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString("it-IT")}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{s.ragioneSociale}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{s.piva}</td>
                        <td className="px-4 py-3 text-slate-600">{s.tipologiaStruttura}</td>
                        <td className="px-4 py-3 text-slate-600">{s.periodoEsercizio}</td>
                        <td className="px-4 py-3">
                          <Badge
                            label={s.valutazioneRischioLegionellosi === "Si" ? "Effettuata" : "Non effettuata"}
                            variant={s.valutazioneRischioLegionellosi === "Si" ? "green" : "amber"}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <SiNoBadge value={s.sistemaDisinfezione} />
                        </td>
                        <td className="px-4 py-3 text-slate-300 text-right pr-5">
                          <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      {/* Detail slide-over */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[1px]"
          onClick={closePanel}
        />
      )}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${panelOpen ? "translate-x-0" : "translate-x-full"}`}>
        {(selectedC || selectedS) && (
          <>
            {/* Panel header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">
                  {selectedC ? "Cliente" : "Struttura"} · #{selectedC?.id ?? selectedS?.id}
                </p>
                <h3 className="font-semibold text-slate-800 text-base leading-snug">
                  {selectedC?.ragioneSociale ?? selectedS?.ragioneSociale}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Salvato il {new Date((selectedC ?? selectedS)!.createdAt).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
              </div>
              <button
                onClick={closePanel}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition flex-shrink-0 ml-3 mt-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {selectedC && <ClienteDetail r={selectedC} />}
              {selectedS && <StrutturaDetail r={selectedS} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ search, entity }: { search: boolean; entity: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 py-24 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">
        {search ? "Nessun risultato trovato" : `Nessun ${entity} salvato`}
      </p>
      <p className="text-xs text-slate-400">
        {search ? "Prova a modificare i termini di ricerca" : "I dati appariranno qui dopo la prima compilazione"}
      </p>
    </div>
  );
}
