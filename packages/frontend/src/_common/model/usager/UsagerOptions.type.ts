import { UsagerOptionsHistorique } from "./UsagerOptionsHistorique.type";
import { UsagerOptionsProcuration } from "./UsagerOptionsProcuration.type";
import { UsagerOptionsTransfert } from "./UsagerOptionsTransfert.type";

export type UsagerOptions = {
  transfert: UsagerOptionsTransfert;
  // TODO: supprimer
  procuration?: UsagerOptionsProcuration;
  procurations: UsagerOptionsProcuration[];
  npai: {
    actif: boolean;
    dateDebut?: Date;
  };
  historique?: {
    transfert: UsagerOptionsHistorique[];
    procuration: UsagerOptionsHistorique[];
  };
  portailUsagerEnabled?: boolean;
};
