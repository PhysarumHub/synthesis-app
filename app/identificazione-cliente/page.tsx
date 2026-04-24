"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/ui/StepProgress";
import StepNav from "@/components/ui/StepNav";
import WelcomeCard from "@/components/ui/WelcomeCard";
import { FieldWrapper, TextInput, RadioGroup } from "@/components/ui/FormField";

type FormData = {
  ragioneSociale: string;
  piva: string;
  via: string;
  cap: string;
  citta: string;
  contattoEmail: string;
  contattoTelefono: string;
  respNome: string;
  respCognome: string;
  respEmail: string;
  respTelefono: string;
  manutNome: string;
  manutCognome: string;
  manutEmail: string;
  manutTelefono: string;
  dittaAzienda: string;
  dittaEmail: string;
  dittaTelefono: string;
  tipoAttivita: string;
  numUtenti: number;
  numPersonale: number;
  tipoUtenti: string;
  repartiSpeciali: string;
  repartiSpecialiDettaglio: string;
};

const TOTAL_STEPS = 8;

const stepTitles = [
  "Dati aziendali",
  "Indirizzo",
  "Contatto azienda",
  "Responsabile azienda",
  "Responsabile interno manutenzione",
  "Ditta esterna manutenzione",
  "Informazioni struttura",
  "Reparti speciali",
];

export default function IdentificazioneClientePage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({ mode: "onBlur" });

  const repartiSpeciali = watch("repartiSpeciali");

  const fieldsPerStep: (keyof FormData)[][] = [
    ["ragioneSociale", "piva"],
    ["via", "cap", "citta"],
    ["contattoEmail"],
    ["respNome", "respCognome", "respEmail"],
    ["manutNome", "manutCognome", "manutEmail"],
    ["dittaAzienda", "dittaEmail", "dittaTelefono"],
    ["tipoAttivita", "numUtenti", "numPersonale", "tipoUtenti"],
    ["repartiSpeciali"],
  ];

  async function goNext() {
    const valid = await trigger(fieldsPerStep[step - 1]);
    if (!valid) return;
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }

  function goBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/identificazione-cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Errore salvataggio");
      setSaved(true);
    } catch {
      alert("Errore durante il salvataggio. Riprova.");
    } finally {
      setIsLoading(false);
    }
  }

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
          <p className="text-slate-500 mb-6">L'identificazione cliente è stata registrata nel database.</p>
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
            title="Identificazione Cliente"
            subtitle="Valutazione del Rischio – Impianti Idrici. Inserisci i dati del cliente per la procedura interna di valutazione del rischio."
            onStart={() => setStarted(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-xl w-full">
        <StepProgress currentStep={step} totalSteps={TOTAL_STEPS} title={stepTitles[step - 1]} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Step 1 */}
          {step === 1 && (
            <>
              <FieldWrapper label="Ragione sociale" required error={errors.ragioneSociale?.message}>
                <TextInput
                  {...register("ragioneSociale", { required: "Campo obbligatorio" })}
                  placeholder="Inserisci ragione sociale"
                  error={!!errors.ragioneSociale}
                />
              </FieldWrapper>
              <FieldWrapper label="P.IVA" required error={errors.piva?.message}>
                <TextInput
                  {...register("piva", { required: "Campo obbligatorio" })}
                  placeholder="IT00000000000"
                  error={!!errors.piva}
                />
              </FieldWrapper>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <FieldWrapper label="Via e numero civico" required error={errors.via?.message}>
                <TextInput
                  {...register("via", { required: "Campo obbligatorio" })}
                  placeholder="Via Roma, 1"
                  error={!!errors.via}
                />
              </FieldWrapper>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrapper label="CAP" required error={errors.cap?.message}>
                  <TextInput
                    {...register("cap", { required: "Campo obbligatorio" })}
                    placeholder="00100"
                    error={!!errors.cap}
                  />
                </FieldWrapper>
                <FieldWrapper label="Città" required error={errors.citta?.message}>
                  <TextInput
                    {...register("citta", { required: "Campo obbligatorio" })}
                    placeholder="Roma"
                    error={!!errors.citta}
                  />
                </FieldWrapper>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <FieldWrapper label="Email contatto azienda" required error={errors.contattoEmail?.message}>
                <TextInput
                  {...register("contattoEmail", {
                    required: "Campo obbligatorio",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email non valida" },
                  })}
                  type="email"
                  placeholder="info@azienda.it"
                  error={!!errors.contattoEmail}
                />
              </FieldWrapper>
              <FieldWrapper label="Telefono contatto azienda" error={errors.contattoTelefono?.message}>
                <TextInput
                  {...register("contattoTelefono")}
                  type="tel"
                  placeholder="02 12345678"
                />
              </FieldWrapper>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <p className="text-xs text-slate-500 mb-4">Responsabile aziendale (referente principale)</p>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrapper label="Nome" required error={errors.respNome?.message}>
                  <TextInput {...register("respNome", { required: "Campo obbligatorio" })} placeholder="Mario" error={!!errors.respNome} />
                </FieldWrapper>
                <FieldWrapper label="Cognome" required error={errors.respCognome?.message}>
                  <TextInput {...register("respCognome", { required: "Campo obbligatorio" })} placeholder="Rossi" error={!!errors.respCognome} />
                </FieldWrapper>
              </div>
              <FieldWrapper label="Email" required error={errors.respEmail?.message}>
                <TextInput
                  {...register("respEmail", {
                    required: "Campo obbligatorio",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email non valida" },
                  })}
                  type="email"
                  placeholder="mario.rossi@azienda.it"
                  error={!!errors.respEmail}
                />
              </FieldWrapper>
              <FieldWrapper label="Telefono" error={errors.respTelefono?.message}>
                <TextInput {...register("respTelefono")} type="tel" placeholder="333 1234567" />
              </FieldWrapper>
            </>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <>
              <p className="text-xs text-slate-500 mb-4">Responsabile interno della manutenzione</p>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrapper label="Nome" required error={errors.manutNome?.message}>
                  <TextInput {...register("manutNome", { required: "Campo obbligatorio" })} placeholder="Mario" error={!!errors.manutNome} />
                </FieldWrapper>
                <FieldWrapper label="Cognome" required error={errors.manutCognome?.message}>
                  <TextInput {...register("manutCognome", { required: "Campo obbligatorio" })} placeholder="Rossi" error={!!errors.manutCognome} />
                </FieldWrapper>
              </div>
              <FieldWrapper label="Email" required error={errors.manutEmail?.message}>
                <TextInput
                  {...register("manutEmail", {
                    required: "Campo obbligatorio",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email non valida" },
                  })}
                  type="email"
                  placeholder="manutenzione@azienda.it"
                  error={!!errors.manutEmail}
                />
              </FieldWrapper>
              <FieldWrapper label="Telefono" error={errors.manutTelefono?.message}>
                <TextInput {...register("manutTelefono")} type="tel" placeholder="333 1234567" />
              </FieldWrapper>
            </>
          )}

          {/* Step 6 */}
          {step === 6 && (
            <>
              <p className="text-xs text-slate-500 mb-4">Ditta esterna di manutenzione</p>
              <FieldWrapper label="Ragione sociale ditta" required error={errors.dittaAzienda?.message}>
                <TextInput {...register("dittaAzienda", { required: "Campo obbligatorio" })} placeholder="Manutenzioni Srl" error={!!errors.dittaAzienda} />
              </FieldWrapper>
              <FieldWrapper label="Email ditta" required error={errors.dittaEmail?.message}>
                <TextInput
                  {...register("dittaEmail", {
                    required: "Campo obbligatorio",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email non valida" },
                  })}
                  type="email"
                  placeholder="info@manutenzioni.it"
                  error={!!errors.dittaEmail}
                />
              </FieldWrapper>
              <FieldWrapper label="Telefono ditta" required error={errors.dittaTelefono?.message}>
                <TextInput {...register("dittaTelefono", { required: "Campo obbligatorio" })} type="tel" placeholder="02 12345678" error={!!errors.dittaTelefono} />
              </FieldWrapper>
            </>
          )}

          {/* Step 7 */}
          {step === 7 && (
            <>
              <FieldWrapper label="Tipo di attività" required error={errors.tipoAttivita?.message}>
                <TextInput {...register("tipoAttivita", { required: "Campo obbligatorio" })} placeholder="es. Alberghiero, Ospedaliero..." error={!!errors.tipoAttivita} />
              </FieldWrapper>
              <div className="grid grid-cols-2 gap-4">
                <FieldWrapper label="N° utenti / camere / bagni" required error={errors.numUtenti?.message}>
                  <TextInput
                    {...register("numUtenti", { required: "Campo obbligatorio", valueAsNumber: true, min: { value: 1, message: "Minimo 1" } })}
                    type="number"
                    min={1}
                    placeholder="42"
                    error={!!errors.numUtenti}
                  />
                </FieldWrapper>
                <FieldWrapper label="N° personale" required error={errors.numPersonale?.message}>
                  <TextInput
                    {...register("numPersonale", { required: "Campo obbligatorio", valueAsNumber: true, min: { value: 0, message: "Minimo 0" } })}
                    type="number"
                    min={0}
                    placeholder="3"
                    error={!!errors.numPersonale}
                  />
                </FieldWrapper>
              </div>
              <FieldWrapper label="Tipo utenti dell'installazione" required error={errors.tipoUtenti?.message}>
                <TextInput {...register("tipoUtenti", { required: "Campo obbligatorio" })} placeholder="es. Pubblico generico, Degenti..." error={!!errors.tipoUtenti} />
              </FieldWrapper>
            </>
          )}

          {/* Step 8 */}
          {step === 8 && (
            <>
              <FieldWrapper label="Presenza di reparti speciali?" required error={errors.repartiSpeciali?.message}>
                <RadioGroup
                  name="repartiSpeciali"
                  value={watch("repartiSpeciali") || ""}
                  onChange={(v) => setValue("repartiSpeciali", v, { shouldValidate: true })}
                  options={[{ value: "No", label: "No" }, { value: "Si", label: "Sì" }]}
                />
                <input type="hidden" {...register("repartiSpeciali", { required: "Seleziona un'opzione" })} />
              </FieldWrapper>
              {repartiSpeciali === "Si" && (
                <FieldWrapper label="Descrivi quali reparti speciali">
                  <TextInput {...register("repartiSpecialiDettaglio")} placeholder="es. Terapia intensiva, Sala operatoria..." />
                </FieldWrapper>
              )}
            </>
          )}

          <StepNav
            onBack={step > 1 ? goBack : () => setStarted(false)}
            onNext={step < TOTAL_STEPS ? goNext : undefined}
            isLast={step === TOTAL_STEPS}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
}
