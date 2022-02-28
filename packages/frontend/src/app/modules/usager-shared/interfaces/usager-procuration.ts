import { UsagerOptionsProcuration } from "../../../../_common/model";

export class UsagerProcuration implements UsagerOptionsProcuration {
  public actif: boolean;
  public nom?: string;
  public prenom?: string;
  public dateFin?: Date | null;
  public dateDebut?: Date | null;
  public dateNaissance?: Date | string | null;

  constructor(procuration?: Partial<UsagerOptionsProcuration>) {
    this.actif = false;
    this.nom = null;
    this.prenom = null;
    this.dateNaissance = null;
    this.dateFin = null;
    this.dateDebut = null;

    if (procuration) {
      this.actif = procuration.actif || false;
      this.nom = procuration.nom || "";
      this.prenom = procuration.prenom || "";

      if (procuration.dateNaissance && procuration.dateNaissance !== null) {
        this.dateNaissance = new Date(procuration.dateNaissance);
      }
      if (procuration.dateFin && procuration.dateFin !== null) {
        this.dateFin = new Date(procuration.dateFin);
      }
      if (procuration.dateDebut && procuration.dateDebut !== null) {
        this.dateDebut = new Date(procuration.dateDebut);
      }
    }
  }
}
