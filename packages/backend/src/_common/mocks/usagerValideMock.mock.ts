import { UsagerLight } from "../model";

export const usagerValideMock: UsagerLight = {
  notes: [],
  uuid: "ee7ef219-b101-422c-8ad4-4d5aedf9caad",
  ref: 6,
  customRef: "6",
  structureId: 1,
  nom: "NOUVEAU",
  prenom: "DOSSIER",
  surnom: "TEST",
  sexe: "homme",
  dateNaissance: new Date("1988-11-02T00:00:00.000Z"),
  datePremiereDom: new Date("2018-10-01T00:00:00.000Z"),
  villeNaissance: "Paris",
  langue: null,
  email: "fake-mail@yopmail.com",
  phone: "0101010101",
  preference: { email: false, phone: false },
  typeDom: "PREMIERE_DOM",
  decision: {
    statut: "VALIDE",
    userId: 1,
    dateFin: new Date("2021-10-31T00:00:00.000Z"),
    userName: "Patrick Roméro",
    dateDebut: new Date("2020-11-01T00:00:00.000Z"),
    dateDecision: new Date("2020-11-01T00:00:00.000Z"),
    orientationDetails: null,
  },
  historique: [
    {
      statut: "INSTRUCTION",
      userId: 1,
      dateFin: new Date("2020-11-01T00:00:00.000Z"),
      userName: "Patrick Roméro",
      dateDecision: new Date("2020-11-01T00:00:00.000Z"),
      orientationDetails: null,
    },
  ],
  ayantsDroits: [],
  lastInteraction: {
    colisIn: 0,
    enAttente: false,
    courrierIn: 0,
    recommandeIn: 0,
    dateInteraction: new Date("2020-11-01T00:00:00.000Z"),
  },
  docs: [],
  etapeDemande: 5,
  rdv: {
    userId: 1,
    dateRdv: new Date("2020-11-01T00:00:00.000Z"),
    userName: "Roméro Patrick",
  },
  entretien: {
    cause: "VIOLENCE",
    raison: "EXERCICE_DROITS",
    revenus: true,
    residence: "HEBERGEMENT_TIERS",
    typeMenage: "FEMME_ISOLE_AVEC_ENFANT",
    causeDetail: null,
    liencommune: null,
    orientation: false,
    commentaires: null,
    raisonDetail: null,
    rattachement: null,
    domiciliation: true,
    revenusDetail: null,
    accompagnement: false,
    residenceDetail: null,
    orientationDetail: null,
    accompagnementDetail: null,
  },
  options: {
    transfert: {
      actif: false,
      nom: null,
      adresse: null,
      dateDebut: null,
      dateFin: null,
    },
    procurations: [],

    npai: {
      actif: false,
      dateDebut: null,
    },
    portailUsagerEnabled: false,
  },
};
