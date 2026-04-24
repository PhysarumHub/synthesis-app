import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const record = await prisma.identificazioneCliente.create({
      data: {
        ragioneSociale: data.ragioneSociale,
        piva: data.piva,
        via: data.via,
        cap: data.cap,
        citta: data.citta,
        contattoEmail: data.contattoEmail,
        contattoTelefono: data.contattoTelefono || null,
        respNome: data.respNome,
        respCognome: data.respCognome,
        respEmail: data.respEmail,
        respTelefono: data.respTelefono || null,
        manutNome: data.manutNome,
        manutCognome: data.manutCognome,
        manutEmail: data.manutEmail,
        manutTelefono: data.manutTelefono || null,
        dittaAzienda: data.dittaAzienda,
        dittaEmail: data.dittaEmail,
        dittaTelefono: data.dittaTelefono,
        tipoAttivita: data.tipoAttivita,
        numUtenti: Number(data.numUtenti),
        numPersonale: Number(data.numPersonale),
        tipoUtenti: data.tipoUtenti,
        repartiSpeciali: data.repartiSpeciali,
        repartiSpecialiDettaglio: data.repartiSpecialiDettaglio || null,
      },
    });

    return Response.json({ success: true, id: record.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Errore salvataggio" }, { status: 500 });
  }
}

export async function GET() {
  const records = await prisma.identificazioneCliente.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(records);
}
