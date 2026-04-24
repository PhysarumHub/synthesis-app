"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/ui/StepProgress";
import StepNav from "@/components/ui/StepNav";
import WelcomeCard from "@/components/ui/WelcomeCard";
import { FieldWrapper, TextInput, TextArea, RadioGroup } from "@/components/ui/FormField";
import { ImpiantoAcquaCalda } from "@/lib/types";

const SI_NO = [{ value: "Si", label: "Sì" }, { value: "No", label: "No" }];
const SI_NO_NA = [...SI_NO, { value: "Non applicabile", label: "Non appl." }];

const TOTAL_STEPS = 5;
const stepTitles = [
  "Dati aziendali",
  "Impianto – informazioni generali",
  "Presenza bollitori / serbatoi",
  "Dettagli bollitori (condizionale)",
  "Fattori di rischio e lavori",
];

export default function ImpiantoAcquaCaldaPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [finalData, setFinalData] = useState<ImpiantoAcquaCalda | null>(null);
  const router = useRouter();

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm<ImpiantoAcquaCalda>({ mode: "onBlur" });

  const presenzaBollitori = watch("presenzaBollitori");

  function setRadio(field: keyof ImpiantoAcquaCalda, v: string) {
    setValue(field, v as any, { shouldValidate: true });
  }

  const actualTotal = presenzaBollitori === "Si" ? 5 : 4;

  async function goNext() {
    const fieldMap: Record<number, (keyof ImpiantoAcquaCalda)[]> = {
      1: ["ragioneSociale", "piva"],
      2: [],
      3: ["presenzaBollitori"],
      4: [],
    };
    const valid = await trigger(fieldMap[step] || []);
    if (!valid) return;
    if (step === 3 && presenzaBollitori !== "Si") {
      setStep(5);
      return;
    }
    if (step < 5) setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 5 && presenzaBollitori !== "Si") { setStep(3); return; }
    if (step > 1) setStep((s) => s - 1);
  }

  async function downloadPdf() {
    if (!finalData) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/pdf/acqua-calda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-acqua-calda-${finalData.ragioneSociale.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Errore durante la generazione del PDF. Riprova.");
    } finally {
      setIsLoading(false);
    }
  }

  function onSubmit(data: ImpiantoAcquaCalda) {
    setFinalData(data);
  }

  if (finalData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Questionario completato!</h2>
          <p className="text-slate-500 mb-6">Il report PDF è pronto per il download.</p>

          <button
            onClick={downloadPdf}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition mb-3 disabled:opacity-70"
          >
            {isLoading ? "Generazione PDF..." : "⬇ Scarica Report PDF"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full px-6 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
          >
            Torna alla home
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-xl w-full">
          <WelcomeCard
            title="Impianto Acqua Calda Sanitaria"
            subtitle="Valutazione del Rischio – Impianti Idrici. Al termine verrà generato un report PDF formale."
            onStart={() => setStarted(true)}
          />
        </div>
      </div>
    );
  }

  const displayStep = step > 4 ? (presenzaBollitori === "Si" ? 5 : 4) : step;
  const displayTotal = presenzaBollitori === "Si" ? 5 : 4;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl w-full">
        <StepProgress
          currentStep={Math.min(displayStep, displayTotal)}
          totalSteps={displayTotal}
          title={step === 4 && presenzaBollitori === "Si" ? stepTitles[3] : stepTitles[step <= 3 ? step - 1 : 4]}
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 1 && (
            <>
              <FieldWrapper label="Ragione sociale" required error={errors.ragioneSociale?.message}>
                <TextInput {...register("ragioneSociale", { required: "Obbligatorio" })} placeholder="Azienda Srl" error={!!errors.ragioneSociale} />
              </FieldWrapper>
              <FieldWrapper label="P.IVA" required error={errors.piva?.message}>
                <TextInput {...register("piva", { required: "Obbligatorio" })} placeholder="IT00000000000" error={!!errors.piva} />
              </FieldWrapper>
            </>
          )}

          {step === 2 && (
            <>
              <FieldWrapper label="Fonte di approvvigionamento dell'acqua">
                <RadioGroup
                  name="fonteApprovvigionamento"
                  value={watch("fonteApprovvigionamento") || ""}
                  onChange={(v) => setRadio("fonteApprovvigionamento", v)}
                  options={[
                    { value: "Rete idrica municipale", label: "Rete municipale" },
                    { value: "Pozzo", label: "Pozzo" },
                    { value: "Mista", label: "Mista" },
                  ]}
                />
                <input type="hidden" {...register("fonteApprovvigionamento")} />
              </FieldWrapper>
              <FieldWrapper label="Materiale/i delle condutture">
                <TextArea {...register("materialeCondutture")} placeholder="es. Acciaio inox, Rame, PVC..." />
              </FieldWrapper>
            </>
          )}

          {step === 3 && (
            <FieldWrapper label="Presenza di bollitori/serbatoi di raccolta ACS?" required error={errors.presenzaBollitori?.message}>
              <RadioGroup
                name="presenzaBollitori"
                value={watch("presenzaBollitori") || ""}
                onChange={(v) => setRadio("presenzaBollitori", v)}
                options={SI_NO}
              />
              <input type="hidden" {...register("presenzaBollitori", { required: "Seleziona opzione" })} />
              {presenzaBollitori && (
                <p className="mt-2 text-xs text-slate-500">
                  {presenzaBollitori === "Si" ? "→ Procederai alla compilazione dei dettagli bollitori." : "→ Passerai direttamente ai fattori di rischio."}
                </p>
              )}
            </FieldWrapper>
          )}

          {step === 4 && (
            <>
              <FieldWrapper label="Numero di bollitori/serbatoi">
                <TextInput {...register("numeroBollitori", { valueAsNumber: true })} type="number" min={1} placeholder="2" />
              </FieldWrapper>
              <FieldWrapper label="Sono isolati termicamente?">
                <RadioGroup name="isolatiTermicamente" value={watch("isolatiTermicamente") || ""} onChange={(v) => setRadio("isolatiTermicamente", v)} options={SI_NO} />
                <input type="hidden" {...register("isolatiTermicamente")} />
              </FieldWrapper>
              <FieldWrapper label="Collegamento idraulico dei bollitori">
                <RadioGroup
                  name="collegamentoIdraulico"
                  value={watch("collegamentoIdraulico") || ""}
                  onChange={(v) => setRadio("collegamentoIdraulico", v)}
                  options={[
                    { value: "In serie", label: "In serie" },
                    { value: "In parallelo", label: "In parallelo" },
                    { value: "Non applicabile", label: "N/A" },
                  ]}
                />
                <input type="hidden" {...register("collegamentoIdraulico")} />
              </FieldWrapper>
            </>
          )}

          {step === 5 && (
            <>
              <div className="space-y-4">
                {[
                  { field: "frAc1" as keyof ImpiantoAcquaCalda, label: "FR.AC.1) Spurgo regolare bollitori dalla valvola di fondo", req: true },
                  { field: "frAc2" as keyof ImpiantoAcquaCalda, label: "FR.AC.2) Disinfezione semestrale / azione alternativa compensativa", req: true },
                  { field: "frAc3" as keyof ImpiantoAcquaCalda, label: "FR.AC.3) ASSENZA di rami morti (linee mai utilizzate)", req: true },
                  { field: "frAc4" as keyof ImpiantoAcquaCalda, label: "FR.AC.4) ASSENZA di linee a limitato utilizzo (<20 min/sett.)", req: true },
                  { field: "frAc5" as keyof ImpiantoAcquaCalda, label: "FR.AC.5) ASSENZA di linee esterne / scarsamente isolate", req: true },
                  { field: "frAc6" as keyof ImpiantoAcquaCalda, label: "FR.AC.6) Temperature erogazione ACS > 50°C", req: true },
                  { field: "frAc7" as keyof ImpiantoAcquaCalda, label: "FR.AC.7) Temperatura stoccaggio ACS > 60°C", req: true },
                ].map(({ field, label, req }) => (
                  <FieldWrapper key={field} label={label} required={req} error={(errors as any)[field]?.message}>
                    <RadioGroup
                      name={field}
                      value={String(watch(field) || "")}
                      onChange={(v) => setRadio(field, v)}
                      options={SI_NO_NA}
                    />
                    <input type="hidden" {...register(field, req ? { required: "Seleziona opzione" } : {})} />
                  </FieldWrapper>
                ))}

                <FieldWrapper label="Note FR.AC.2">
                  <TextArea {...register("frAc2Note")} placeholder="Inserisci notazioni opzionali..." />
                </FieldWrapper>

                <FieldWrapper label="Lavori di ristrutturazione negli ultimi 12 mesi?">
                  <RadioGroup name="lavoriRistrutturazione" value={watch("lavoriRistrutturazione") || ""} onChange={(v) => setRadio("lavoriRistrutturazione", v)} options={SI_NO} />
                  <input type="hidden" {...register("lavoriRistrutturazione")} />
                </FieldWrapper>
                {watch("lavoriRistrutturazione") === "Si" && (
                  <FieldWrapper label="Descrizione tipologia intervento">
                    <TextArea {...register("descrizioneIntervento")} placeholder="Descrivi il tipo di intervento effettuato..." />
                  </FieldWrapper>
                )}
              </div>
            </>
          )}

          <StepNav
            onBack={step > 1 ? goBack : () => setStarted(false)}
            onNext={step < 5 ? goNext : undefined}
            isLast={step === 5}
            isLoading={isLoading}
            nextLabel="Avanti"
          />
        </form>
      </div>
    </div>
  );
}
