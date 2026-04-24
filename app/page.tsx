import Link from "next/link";
import { cookies } from "next/headers";

const forms = [
  {
    href: "/identificazione-cliente",
    title: "Identificazione Cliente",
    description: "Raccolta dati anagrafici, responsabili e ditta esterna manutenzione.",
    icon: "👤",
    action: "Salva su database",
    color: "from-indigo-500 to-blue-600",
    steps: 8,
    pdf: false,
  },
  {
    href: "/identificazione-struttura",
    title: "Identificazione Struttura",
    description: "Tipologia, periodo esercizio, valutazione rischio Legionella, misurazioni.",
    icon: "🏗️",
    action: "Salva su database",
    color: "from-slate-500 to-slate-700",
    steps: 14,
    pdf: false,
  },
  {
    href: "/impianto-acqua-calda",
    title: "Impianto Acqua Calda",
    description: "Bollitori, fattori di rischio FR.AC.1–7, lavori di ristrutturazione.",
    icon: "🌡️",
    action: "Genera report PDF",
    color: "from-orange-500 to-red-600",
    steps: 5,
    pdf: true,
  },
  {
    href: "/impianto-acqua-fredda",
    title: "Impianto Acqua Fredda",
    description: "Serbatoi, fattori di rischio FR.AF.1–6, capacità parziali.",
    icon: "❄️",
    action: "Genera report PDF",
    color: "from-cyan-500 to-blue-600",
    steps: 6,
    pdf: true,
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const pin = process.env.ADMIN_PIN ?? "";
  const isAdmin = pin && cookieStore.get("admin_auth")?.value === btoa(pin);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Synthesis</h1>
                <p className="text-xs text-slate-500">Valutazione del Rischio – Impianti Idrici</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              {isAdmin ? "Archivio" : "Admin"}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Questionari</h2>
          <p className="text-slate-500">Seleziona il questionario da compilare per la procedura di valutazione del rischio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {forms.map((form) => (
            <Link
              key={form.href}
              href={form.href}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${form.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {form.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition mb-1">
                    {form.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">
                    {form.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{form.steps} step</span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {form.pdf ? "📄" : "💾"} {form.action}
                    </span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 p-5 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> I questionari &ldquo;Identificazione Cliente&rdquo; e &ldquo;Identificazione Struttura&rdquo; vengono salvati nel database locale.
            I questionari &ldquo;Impianto Acqua Calda&rdquo; e &ldquo;Impianto Acqua Fredda&rdquo; generano un report PDF scaricabile al termine della compilazione.
          </p>
        </div>
      </div>
    </div>
  );
}
