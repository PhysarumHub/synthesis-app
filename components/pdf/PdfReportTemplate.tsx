import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import path from "path";
import { ImpiantoAcquaCalda, ImpiantoAcquaFredda } from "@/lib/types";

const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

// ─── Stili ───────────────────────────────────────────────────────────────────

const colors = {
  primary: "#1e3a5f",
  accent: "#2563eb",
  lightGray: "#f1f5f9",
  midGray: "#94a3b8",
  dark: "#1e293b",
  border: "#cbd5e1",
  yes: "#16a34a",
  no: "#dc2626",
  na: "#6b7280",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.dark,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
  },

  // Header
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 36,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flex: 1 },
  headerCompanyName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 2 },
  headerCompanyDetails: { fontSize: 8, color: "#94a3b8" },
  headerLogo: { width: 80, height: 40, objectFit: "contain" },
  headerLogoPlaceholder: {
    width: 80, height: 40,
    backgroundColor: "#2d5086",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLogoText: { color: "#7aa3d4", fontSize: 8, fontFamily: "Helvetica-Bold" },

  // Title bar
  titleBar: {
    backgroundColor: colors.accent,
    paddingHorizontal: 36,
    paddingVertical: 10,
  },
  titleText: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  titleSub: { fontSize: 8, color: "#bfdbfe", marginTop: 2 },

  // Content
  content: { paddingHorizontal: 36, paddingTop: 20 },

  // Section
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Item row
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  itemRowAlt: { backgroundColor: colors.lightGray },
  itemNumber: {
    width: 20,
    fontSize: 8,
    color: colors.midGray,
    fontFamily: "Helvetica-Bold",
    paddingTop: 1,
  },
  itemLabel: { flex: 1, fontSize: 9, color: "#475569", paddingRight: 8 },
  itemValue: { width: 90, fontSize: 9, fontFamily: "Helvetica-Bold", textAlign: "right" },

  // Value colors
  valueYes: { color: colors.yes },
  valueNo: { color: colors.no },
  valueNA: { color: colors.na },

  // Info grid
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  infoCell: {
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    padding: 8,
    width: "48%",
  },
  infoCellLabel: { fontSize: 7, color: colors.midGray, marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.3 },
  infoCellValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: colors.dark },

  // Note
  noteBox: {
    backgroundColor: "#fefce8",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 4,
    borderRadius: 2,
  },
  noteText: { fontSize: 8, color: "#92400e" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 36,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 7, color: colors.midGray },

  // Page number
  pageNum: { fontSize: 7, color: colors.midGray },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function valueStyle(val: string) {
  if (val === "Si" || val === "Sì") return styles.valueYes;
  if (val === "No") return styles.valueNo;
  if (val === "Non applicabile") return styles.valueNA;
  return {};
}

function Item({ num, label, value, alt }: { num: number; label: string; value: string; alt: boolean }) {
  return (
    <View style={[styles.itemRow, alt ? styles.itemRowAlt : {}]}>
      <Text style={styles.itemNumber}>{num})</Text>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={[styles.itemValue, valueStyle(value)]}>{value || "—"}</Text>
    </View>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoCellLabel}>{label}</Text>
      <Text style={styles.infoCellValue}>{value || "—"}</Text>
    </View>
  );
}

const COMPANY = {
  name: "Synthesis S.r.l.",
  address: "Via Michelangelo Merisi, 12/14 – 24043 Caravaggio (BG)",
  vatNumber: "P.IVA / CF / Iscr. Reg. Imp. BG 03863820167 – R.E.A. 414911",
  phone: "",
  email: "",
};

function Header({ reportType }: { reportType: string }) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerCompanyName}>{COMPANY.name}</Text>
          <Text style={styles.headerCompanyDetails}>
            {COMPANY.address}
          </Text>
          <Text style={styles.headerCompanyDetails}>
            {COMPANY.vatNumber}
          </Text>
        </View>
        <Image src={LOGO_PATH} style={styles.headerLogo} />
      </View>
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Valutazione del Rischio – Impianti Idrici</Text>
        <Text style={styles.titleSub}>{reportType} · Generato il {new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })}</Text>
      </View>
    </>
  );
}

function Footer({ company }: { company: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{COMPANY.name} – Documento riservato</Text>
      <Text style={styles.footerText}>{company}</Text>
      <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

// ─── PDF Impianto Acqua Calda ────────────────────────────────────────────────

export function PdfImpiantoAcquaCalda({ data }: { data: ImpiantoAcquaCalda }) {
  const hasBollitori = data.presenzaBollitori === "Si";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header reportType="Impianto Acqua Calda Sanitaria" />

        <View style={styles.content}>
          {/* Dati aziendali */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dati Aziendali</Text>
            <View style={styles.infoGrid}>
              <InfoCell label="Ragione Sociale" value={data.ragioneSociale} />
              <InfoCell label="P.IVA" value={data.piva} />
            </View>
          </View>

          {/* 25) Impianto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>25) Impianto d'acqua calda sanitaria</Text>
            <Item num={26} label="Fonte di approvvigionamento dell'acqua all'impianto" value={data.fonteApprovvigionamento} alt={false} />
            <Item num={26} label="Materiale/i delle condutture" value={data.materialeCondutture || "—"} alt={true} />
          </View>

          {/* 27) Bollitori */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presenza bollitori / serbatoi</Text>
            <Item num={27} label="Presenza di bollitori/serbatoi di raccolta ACS" value={data.presenzaBollitori} alt={false} />
            {hasBollitori && (
              <>
                <Item num={28} label="Isolati termicamente" value={data.isolatiTermicamente || "—"} alt={true} />
                <Item num={29} label="Collegamento idraulico dei bollitori/serbatoi" value={data.collegamentoIdraulico || "—"} alt={false} />
                <View style={[styles.itemRow, styles.itemRowAlt]}>
                  <Text style={styles.itemNumber}> </Text>
                  <Text style={styles.itemLabel}>Numero serbatoi</Text>
                  <Text style={styles.itemValue}>{data.numeroBollitori ?? "—"}</Text>
                </View>
              </>
            )}
          </View>

          {/* Fattori di rischio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fattori di Rischio – Acqua Calda (FR.AC)</Text>
            <Item num={30} label="FR.AC.1) Spurgo regolare bollitori/serbatoi dalla valvola di fondo" value={data.frAc1} alt={false} />
            <Item num={31} label="FR.AC.2) Disinfezione almeno semestrale dei bollitori / azione alternativa compensativa" value={data.frAc2} alt={true} />
            {data.frAc2Note && (
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>Notazioni: {data.frAc2Note}</Text>
              </View>
            )}
            <Item num={32} label="FR.AC.3) ASSENZA di rami morti (linee mai utilizzate)" value={data.frAc3} alt={false} />
            <Item num={33} label="FR.AC.4) ASSENZA di linee a limitato utilizzo (&lt;20 min/sett.)" value={data.frAc4} alt={true} />
            <Item num={34} label="FR.AC.5) ASSENZA di linee esterne / scarsamente isolate termicamente" value={data.frAc5} alt={false} />
            <Item num={35} label="FR.AC.6) Temperature di erogazione ACS &gt; 50°C" value={data.frAc6} alt={true} />
            <Item num={36} label="FR.AC.7) Temperatura di stoccaggio ACS &gt; 60°C" value={data.frAc7} alt={false} />
          </View>

          {/* Lavori */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lavori di ristrutturazione</Text>
            <Item num={37} label="Modifiche all'impianto idrico negli ultimi 12 mesi" value={data.lavoriRistrutturazione} alt={false} />
            {data.descrizioneIntervento && (
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>Tipologia intervento: {data.descrizioneIntervento}</Text>
              </View>
            )}
          </View>
        </View>

        <Footer company={data.ragioneSociale} />
      </Page>
    </Document>
  );
}

// ─── PDF Impianto Acqua Fredda ───────────────────────────────────────────────

export function PdfImpiantoAcquaFredda({ data }: { data: ImpiantoAcquaFredda }) {
  const hasSerbatoi = data.presenzaSerbatoi === "Si";
  const capacita = [
    data.capacitaParziale1, data.capacitaParziale2,
    data.capacitaParziale3, data.capacitaParziale4, data.capacitaParziale5,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header reportType="Impianto Acqua Fredda Sanitaria" />

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dati Aziendali</Text>
            <View style={styles.infoGrid}>
              <InfoCell label="Ragione Sociale" value={data.ragioneSociale} />
              <InfoCell label="P.IVA" value={data.piva} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impianto d'acqua fredda sanitaria</Text>
            <Item num={1} label="Fonte di approvvigionamento" value={data.fonteApprovvigionamento} alt={false} />
            <Item num={2} label="Materiali delle condutture" value={data.materialeCondutture || "—"} alt={true} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Presenza serbatoi acqua fredda</Text>
            <Item num={3} label="Serbatoi di raccolta acqua fredda destinata al consumo umano" value={data.presenzaSerbatoi} alt={false} />
            {hasSerbatoi && (
              <>
                <Item num={4} label="Isolati termicamente" value={data.isolatiTermicamente || "—"} alt={true} />
                <Item num={5} label="Svuotamento e pulizia almeno annuale" value={data.puliziAnnuale || "—"} alt={false} />
                <View style={[styles.itemRow, styles.itemRowAlt]}>
                  <Text style={styles.itemNumber}> </Text>
                  <Text style={styles.itemLabel}>Numero serbatoi</Text>
                  <Text style={styles.itemValue}>{data.numeroSerbatoi ?? "—"}</Text>
                </View>
                {capacita.length > 0 && (
                  <View style={[styles.itemRow]}>
                    <Text style={styles.itemNumber}> </Text>
                    <Text style={styles.itemLabel}>Capacità parziali (L)</Text>
                    <Text style={[styles.itemValue, { fontFamily: "Helvetica" }]}>{capacita.join(" / ")}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fattori di Rischio – Acqua Fredda (FR.AF)</Text>
            <Item num={6} label="FR.AF.1) Svuotamento e pulizia annuale serbatoi / azione alternativa compensativa" value={data.frAf1} alt={false} />
            <Item num={7} label="FR.AF.2) ASSENZA di rami morti (linee di distribuzione mai utilizzate)" value={data.frAf2} alt={true} />
            <Item num={8} label="FR.AF.3) ASSENZA di linee a limitato utilizzo (&lt;20 min/sett.) o rallentamento del flusso" value={data.frAf3} alt={false} />
            <Item num={9} label="FR.AF.4) ASSENZA di linee esterne / scarsamente isolate termicamente" value={data.frAf4} alt={true} />
            <Item num={10} label="FR.AF.5) Temperature di erogazione AFS &lt; 20°C" value={data.frAf5} alt={false} />
            <Item num={11} label="FR.AF.6) Temperatura di stoccaggio AFS &lt; 20°C" value={data.frAf6} alt={true} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lavori di ristrutturazione</Text>
            <Item num={12} label="Modifiche all'impianto idrico negli ultimi 12 mesi" value={data.lavoriRistrutturazione} alt={false} />
            {data.descrizioneIntervento && (
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>Tipologia intervento: {data.descrizioneIntervento}</Text>
              </View>
            )}
          </View>
        </View>

        <Footer company={data.ragioneSociale} />
      </Page>
    </Document>
  );
}
