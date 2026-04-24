"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/ui/StepProgress";
import StepNav from "@/components/ui/StepNav";
import WelcomeCard from "@/components/ui/WelcomeCard";
import { FieldWrapper, TextInput, TextArea, RadioGroup } from "@/components/ui/FormField";

type FormData = {
  ragioneSociale: string; piva: string; indirizzo: string; citta: string; telefono: string; email: string;
  tipologiaStruttura: string;
  periodoEsercizio: string;
  valutazioneRischioLegionellosi: string; dataValutazione: string; noteValutazione: string;
  pianoGestioneRischio: string; notePianoGestione: string;
  campionamentiLegionella: string; noteCampionamenti: string;
  registroIgiene: string; noteRegistro: string;
  pc1: number; pc2: number; pc3: number; pc4: number; pc5: number;
  tac1: number; tac2: number; tac3: number; tac4: number; tac5: number;
  taf1: number; taf2: number; taf3: number; taf4: number; taf5: number;
  cd1: number; cd2: number; cd3: number; cd4: number; cd5: number;
  diff1: string; diff2: string; diff3: string; diff4: string; diff5: string;
  sistemaDisinfezione: string; noteDisinfezione: string;
  schedaSicurezza: string; noteSchedaSicurezza: string;
  sistemaControlloAutomatico: string; noteControlloAutomatico: string;
};

const SI_NO = [{ value: "Si", label: "Sì" }, { value: "No", label: "No" }];
const TIPOLOGIE = ["Ad uso collettivo", "Industriale", "Nosocomiale", "Recettivo", "Termale", "Altro"];
const PERIODI = [{ value: "Annuale", label: "Annuale" }, { value: "Stagionale", label: "Stagionale" }];

const stepTitles = [
  "Dati aziendali", "Tipologia struttura", "Periodo di esercizio",
  "Valutazione rischio Legionellosi", "Piano di gestione rischio",
  "Campionamenti microbiologici", "Registro igiene e manutenzione",
  "Punto di controllo – misurazioni", "Temperatura acqua calda sanitaria",
  "Temperatura acqua fredda sanitaria", "Concentrazione disinfettante",
  "Condizioni diffusori/rompigetto", "Sistema di disinfezione",
  "Dettagli sistema di disinfezione",
];

const TOTAL_STEPS = 14;

export default function IdentificazioneStrutturaPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors }, trigger, setValue } = useForm<FormData>({ mode: "onBlur" });

  const sistemaDisinfezione = watch("sistemaDisinfezione");
  const actualTotalSteps = sistemaDisinfezione === "Si" ? 14 : 13;

  function setRadio(field: keyof FormData, v: string) {
    setValue(field, v as any, { shouldValidate: true });
  }

  async function goNext() {
    const stepFieldMap: Record<number, (keyof FormData)[]> = {
      1: ["ragioneSociale", "piva"],
      2: ["tipologiaStruttura"],
      3: ["periodoEsercizio"],
      4: ["valutazioneRischioLegionellosi"],
      5: ["pianoGestioneRischio"],
      6: ["campionamentiLegionella"],
      7: ["registroIgiene"],
      8: ["pc1"], 9: ["tac1"], 10: ["taf1"],
      11: [], 12: ["diff1"],
      13: ["sistemaDisinfezione"],
    };
    const valid = await trigger(stepFieldMap[step] || []);
    if (!valid) return;
    if (step === 13 && sistemaDisinfezione !== "Si") {
      handleSubmit(onSubmit)();
      return;
    }
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }

  function goBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/identificazione-struttura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
    } catch {
      alert("Errore durante il salvataggio. Riprova.");
    } finally {
      setIsLoading(false);
    }
  }

  const MisurRow = ({ label, fields, required = true }: { label: string; fields: (keyof FormData)[]; required?: boolean }) => (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-700 mb-2">{label}</p>
      <div className="grid grid-cols-5 gap-2">
        {fields.map((f, i) => (
          <div key={f}>
            <label className="text-xs text-slate-500 mb-1 block">{i + 1}ª mis.</label>
            <TextInput
              {...register(f, i === 0 ? { required: required ? "Obbligatorio" : false, valueAsNumber: true } : { valueAsNumber: true })}
              type="number"
              step="0.1"
              placeholder="--"
              error={!!(errors as any)[f]}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (saved) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Dati salvati!</h2>
          <p className="text-slate-500 mb-6">L'identificazione struttura è stata registrata nel database.</p>
          <button onClick={() => router.push("/")} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
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
            title="Identificazione Struttura"
            subtitle="Valutazione del Rischio – Impianti Idrici. Censimento e rilevazione dati della struttura."
            onStart={() => setStarted(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl w-full">
        <StepProgress currentStep={step} totalSteps={actualTotalSteps} title={stepTitles[step - 1]} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrapper label="Ragione sociale" required error={errors.ragioneSociale?.message}>
                  <TextInput {...register("ragioneSociale", { required: "Obbligatorio" })} placeholder="Struttura Srl" error={!!errors.ragioneSociale} />
                </FieldWrapper>
                <FieldWrapper label="P.IVA" required error={errors.piva?.message}>
                  <TextInput {...register("piva", { required: "Obbligatorio" })} placeholder="IT00000000000" error={!!errors.piva} />
                </FieldWrapper>
              </div>
              <FieldWrapper label="Indirizzo">
                <TextInput {...register("indirizzo")} placeholder="Via Roma, 1" />
              </FieldWrapper>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrapper label="Città">
                  <TextInput {...register("citta")} placeholder="Milano" />
                </FieldWrapper>
                <FieldWrapper label="Telefono">
                  <TextInput {...register("telefono")} type="tel" placeholder="02 12345678" />
                </FieldWrapper>
              </div>
              <FieldWrapper label="Email">
                <TextInput {...register("email")} type="email" placeholder="info@struttura.it" />
              </FieldWrapper>
            </>
          )}

          {step === 2 && (
            <FieldWrapper label="Tipologia struttura" required error={errors.tipologiaStruttura?.message}>
              <div className="grid grid-cols-2 gap-2">
                {TIPOLOGIE.map((t) => (
                  <label key={t} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition ${watch("tipologiaStruttura") === t ? "border-blue-600 bg-blue-50 text-blue-700 font-medium" : "border-slate-300 hover:border-slate-400"}`}>
                    <input type="radio" {...register("tipologiaStruttura", { required: "Seleziona tipologia" })} value={t} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
              {errors.tipologiaStruttura && <p className="mt-1 text-xs text-red-600">{errors.tipologiaStruttura.message}</p>}
            </FieldWrapper>
          )}

          {step === 3 && (
            <FieldWrapper label="Periodo di esercizio" required error={errors.periodoEsercizio?.message}>
              <RadioGroup name="periodoEsercizio" value={watch("periodoEsercizio") || ""} onChange={(v) => setRadio("periodoEsercizio", v)} options={PERIODI} />
              <input type="hidden" {...register("periodoEsercizio", { required: "Seleziona periodo" })} />
            </FieldWrapper>
          )}

          {step === 4 && (
            <>
              <FieldWrapper label="Valutazione del rischio legionellosi effettuata?" required error={errors.valutazioneRischioLegionellosi?.message}>
                <RadioGroup name="valutazioneRischioLegionellosi" value={watch("valutazioneRischioLegionellosi") || ""} onChange={(v) => setRadio("valutazioneRischioLegionellosi", v)} options={SI_NO} />
                <input type="hidden" {...register("valutazioneRischioLegionellosi", { required: "Seleziona opzione" })} />
              </FieldWrapper>
              <FieldWrapper label="Data emissione più recente">
                <TextInput {...register("dataValutazione")} type="date" />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni">
                <TextArea {...register("noteValutazione")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
            </>
          )}

          {step === 5 && (
            <>
              <FieldWrapper label="Piano di gestione del rischio implementato?" required error={errors.pianoGestioneRischio?.message}>
                <RadioGroup name="pianoGestioneRischio" value={watch("pianoGestioneRischio") || ""} onChange={(v) => setRadio("pianoGestioneRischio", v)} options={SI_NO} />
                <input type="hidden" {...register("pianoGestioneRischio", { required: "Seleziona opzione" })} />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni">
                <TextArea {...register("notePianoGestione")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
            </>
          )}

          {step === 6 && (
            <>
              <FieldWrapper label="Campionamenti microbiologici Legionella effettuati?" required error={errors.campionamentiLegionella?.message}>
                <RadioGroup name="campionamentiLegionella" value={watch("campionamentiLegionella") || ""} onChange={(v) => setRadio("campionamentiLegionella", v)} options={SI_NO} />
                <input type="hidden" {...register("campionamentiLegionella", { required: "Seleziona opzione" })} />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni">
                <TextArea {...register("noteCampionamenti")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
            </>
          )}

          {step === 7 && (
            <>
              <FieldWrapper label="Registro igiene/manutenzione presente?" required error={errors.registroIgiene?.message}>
                <RadioGroup name="registroIgiene" value={watch("registroIgiene") || ""} onChange={(v) => setRadio("registroIgiene", v)} options={SI_NO} />
                <input type="hidden" {...register("registroIgiene", { required: "Seleziona opzione" })} />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni">
                <TextArea {...register("noteRegistro")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
            </>
          )}

          {step === 8 && (
            <MisurRow label="Identificazione punto di controllo (fino a 5 misurazioni)" fields={["pc1","pc2","pc3","pc4","pc5"]} />
          )}

          {step === 9 && (
            <MisurRow label="Temperatura acqua calda sanitaria – °C (fino a 5 misurazioni)" fields={["tac1","tac2","tac3","tac4","tac5"]} />
          )}

          {step === 10 && (
            <MisurRow label="Temperatura acqua fredda sanitaria – °C (fino a 5 misurazioni)" fields={["taf1","taf2","taf3","taf4","taf5"]} />
          )}

          {step === 11 && (
            <MisurRow label="Concentrazione disinfettante – mg/L (se applicato)" fields={["cd1","cd2","cd3","cd4","cd5"]} required={false} />
          )}

          {step === 12 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Condizioni di pulizia diffusori/rompigetto (fino a 5 misurazioni)</p>
              {(["diff1","diff2","diff3","diff4","diff5"] as (keyof FormData)[]).map((f, i) => (
                <FieldWrapper key={f} label={`${i + 1}ª misurazione`} required={i === 0} error={i === 0 ? errors.diff1?.message : undefined}>
                  <TextInput
                    {...register(f, i === 0 ? { required: "Obbligatorio" } : {})}
                    placeholder="Descrivi condizioni..."
                    error={i === 0 && !!errors.diff1}
                  />
                </FieldWrapper>
              ))}
            </div>
          )}

          {step === 13 && (
            <>
              <FieldWrapper label="Sistema di disinfezione acqua presente?" required error={errors.sistemaDisinfezione?.message}>
                <RadioGroup name="sistemaDisinfezione" value={watch("sistemaDisinfezione") || ""} onChange={(v) => setRadio("sistemaDisinfezione", v)} options={SI_NO} />
                <input type="hidden" {...register("sistemaDisinfezione", { required: "Seleziona opzione" })} />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni">
                <TextArea {...register("noteDisinfezione")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
              {sistemaDisinfezione !== "Si" && (
                <p className="text-xs text-slate-500 mt-2">Se "No", il questionario si concluderà qui.</p>
              )}
            </>
          )}

          {step === 14 && (
            <>
              <FieldWrapper label="Scheda di sicurezza disinfettante disponibile?" error={errors.schedaSicurezza?.message}>
                <RadioGroup name="schedaSicurezza" value={watch("schedaSicurezza") || ""} onChange={(v) => setRadio("schedaSicurezza", v)} options={SI_NO} />
                <input type="hidden" {...register("schedaSicurezza")} />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni scheda sicurezza">
                <TextArea {...register("noteSchedaSicurezza")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
              <FieldWrapper label="Sistema di controllo automatico implementato?" error={errors.sistemaControlloAutomatico?.message}>
                <RadioGroup name="sistemaControlloAutomatico" value={watch("sistemaControlloAutomatico") || ""} onChange={(v) => setRadio("sistemaControlloAutomatico", v)} options={SI_NO} />
                <input type="hidden" {...register("sistemaControlloAutomatico")} />
              </FieldWrapper>
              <FieldWrapper label="Annotazioni controllo automatico">
                <TextArea {...register("noteControlloAutomatico")} placeholder="Inserisci annotazioni..." />
              </FieldWrapper>
            </>
          )}

          <StepNav
            onBack={step > 1 ? goBack : () => setStarted(false)}
            onNext={step < (sistemaDisinfezione === "Si" ? 14 : 13) ? goNext : undefined}
            isLast={step === (sistemaDisinfezione === "Si" ? 14 : 13)}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
