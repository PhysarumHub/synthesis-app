import { renderToBuffer } from "@react-pdf/renderer";
import { PdfImpiantoAcquaCalda } from "@/components/pdf/PdfReportTemplate";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const buffer = await renderToBuffer(<PdfImpiantoAcquaCalda data={data} />);

    const filename = `report-acqua-calda-${(data.ragioneSociale as string)
      .replace(/\s+/g, "-")
      .toLowerCase()}.pdf`;

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Errore generazione PDF" }, { status: 500 });
  }
}
