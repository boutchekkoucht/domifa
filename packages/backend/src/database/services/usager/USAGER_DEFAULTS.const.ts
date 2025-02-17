import { UsagerOptions } from "../../../_common/model";
export const USAGER_DEFAULT_OPTIONS: UsagerOptions = {
  transfert: {
    actif: false,
    nom: null,
    adresse: null,
    dateDebut: null,
    dateFin: null,
  },
  procurations: [
    {
      nom: null,
      prenom: null,
      dateFin: null,
      dateDebut: null,
      dateNaissance: null,
    },
  ],

  npai: {
    actif: false,
    dateDebut: null,
  },
  portailUsagerEnabled: false,
};

export const USAGER_DEFAULT_PREFERENCE = {
  email: false,
  phone: false,
};
