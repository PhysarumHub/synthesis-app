export type RadioOption = "Si" | "No" | "Non applicabile";

export interface ImpiantoAcquaCalda {
  // Block 1
  ragioneSociale: string;
  piva: string;
  // Block 2
  fonteApprovvigionamento: string;
  materialeCondutture: string;
  // Block 3
  presenzaBollitori: string;
  // Block 4 (condizionale)
  numeroBollitori?: number;
  isolatiTermicamente?: string;
  collegamentoIdraulico?: string;
  // Block 5
  frAc1: RadioOption;
  frAc2: RadioOption;
  frAc2Note?: string;
  frAc3: RadioOption;
  frAc4: RadioOption;
  frAc5: RadioOption;
  frAc6: RadioOption;
  frAc7: RadioOption;
  lavoriRistrutturazione: string;
  descrizioneIntervento?: string;
}

export interface ImpiantoAcquaFredda {
  // Block 1
  ragioneSociale: string;
  piva: string;
  // Block 2
  fonteApprovvigionamento: string;
  materialeCondutture: string;
  // Block 3
  presenzaSerbatoi: string;
  // Block 4 (condizionale)
  numeroSerbatoi?: number;
  isolatiTermicamente?: string;
  puliziAnnuale?: string;
  // Block 5 (condizionale)
  capacitaParziale1?: number;
  capacitaParziale2?: number;
  capacitaParziale3?: number;
  capacitaParziale4?: number;
  capacitaParziale5?: number;
  // Block 6
  frAf1: RadioOption;
  frAf2: RadioOption;
  frAf3: RadioOption;
  frAf4: RadioOption;
  frAf5: RadioOption;
  frAf6: RadioOption;
  lavoriRistrutturazione: string;
  descrizioneIntervento?: string;
}
