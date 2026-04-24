"use client";

import dynamic from "next/dynamic";
import { ImpiantoAcquaCalda, ImpiantoAcquaFredda } from "@/lib/types";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false, loading: () => <button disabled className="w-full px-6 py-3 bg-blue-400 text-white rounded-lg text-sm font-medium cursor-not-allowed">Caricamento PDF...</button> }
);

const PdfImpiantoAcquaCalda = dynamic(
  () => import("./PdfReportTemplate").then((m) => m.PdfImpiantoAcquaCalda),
  { ssr: false }
);

const PdfImpiantoAcquaFredda = dynamic(
  () => import("./PdfReportTemplate").then((m) => m.PdfImpiantoAcquaFredda),
  { ssr: false }
);

interface PropsCalda {
  type: "calda";
  data: ImpiantoAcquaCalda;
}
interface PropsFredda {
  type: "fredda";
  data: ImpiantoAcquaFredda;
}

type Props = PropsCalda | PropsFredda;

export default function PdfDownloadButton({ type, data }: Props) {
  const fileName =
    type === "calda"
      ? `report-acqua-calda-${(data as ImpiantoAcquaCalda).ragioneSociale.replace(/\s+/g, "-").toLowerCase()}.pdf`
      : `report-acqua-fredda-${(data as ImpiantoAcquaFredda).ragioneSociale.replace(/\s+/g, "-").toLowerCase()}.pdf`;

  const doc =
    type === "calda" ? (
      <PdfImpiantoAcquaCalda data={data as ImpiantoAcquaCalda} />
    ) : (
      <PdfImpiantoAcquaFredda data={data as ImpiantoAcquaFredda} />
    );

  return (
    <PDFDownloadLink document={doc} fileName={fileName}>
      {({ loading }: { loading: boolean }) => (
        <button
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition mb-3 disabled:opacity-70"
        >
          {loading ? "Generazione PDF..." : "⬇ Scarica Report PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
