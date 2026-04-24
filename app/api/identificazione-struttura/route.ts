import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const d = await req.json();

    const record = await prisma.identificazioneStruttura.create({
      data: {
        ragioneSociale: d.ragioneSociale,
        piva: d.piva,
        indirizzo: d.indirizzo || null,
        citta: d.citta || null,
        telefono: d.telefono || null,
        email: d.email || null,
        tipologiaStruttura: d.tipologiaStruttura,
        periodoEsercizio: d.periodoEsercizio,
        valutazioneRischioLegionellosi: d.valutazioneRischioLegionellosi,
        dataValutazione: d.dataValutazione || null,
        noteValutazione: d.noteValutazione || null,
        pianoGestioneRischio: d.pianoGestioneRischio,
        notePianoGestione: d.notePianoGestione || null,
        campionamentiLegionella: d.campionamentiLegionella,
        noteCampionamenti: d.noteCampionamenti || null,
        registroIgiene: d.registroIgiene,
        noteRegistro: d.noteRegistro || null,
        pc1: d.pc1 ? Number(d.pc1) : null,
        pc2: d.pc2 ? Number(d.pc2) : null,
        pc3: d.pc3 ? Number(d.pc3) : null,
        pc4: d.pc4 ? Number(d.pc4) : null,
        pc5: d.pc5 ? Number(d.pc5) : null,
        tac1: d.tac1 ? Number(d.tac1) : null,
        tac2: d.tac2 ? Number(d.tac2) : null,
        tac3: d.tac3 ? Number(d.tac3) : null,
        tac4: d.tac4 ? Number(d.tac4) : null,
        tac5: d.tac5 ? Number(d.tac5) : null,
        taf1: d.taf1 ? Number(d.taf1) : null,
        taf2: d.taf2 ? Number(d.taf2) : null,
        taf3: d.taf3 ? Number(d.taf3) : null,
        taf4: d.taf4 ? Number(d.taf4) : null,
        taf5: d.taf5 ? Number(d.taf5) : null,
        cd1: d.cd1 ? Number(d.cd1) : null,
        cd2: d.cd2 ? Number(d.cd2) : null,
        cd3: d.cd3 ? Number(d.cd3) : null,
        cd4: d.cd4 ? Number(d.cd4) : null,
        cd5: d.cd5 ? Number(d.cd5) : null,
        diff1: d.diff1 || null,
        diff2: d.diff2 || null,
        diff3: d.diff3 || null,
        diff4: d.diff4 || null,
        diff5: d.diff5 || null,
        sistemaDisinfezione: d.sistemaDisinfezione,
        noteDisinfezione: d.noteDisinfezione || null,
        schedaSicurezza: d.schedaSicurezza || null,
        noteSchedaSicurezza: d.noteSchedaSicurezza || null,
        sistemaControlloAutomatico: d.sistemaControlloAutomatico || null,
        noteControlloAutomatico: d.noteControlloAutomatico || null,
      },
    });

    return Response.json({ success: true, id: record.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Errore salvataggio" }, { status: 500 });
  }
}

export async function GET() {
  const records = await prisma.identificazioneStruttura.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(records);
}
