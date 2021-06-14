import moment = require("moment");
import { uuidGenerator } from "../../../../database/services/uuid";
import {
  AppUser,
  Usager,
  UsagerAyantDroit,
  UsagerVisibleHistoryDecision,
} from "../../../../_common/model";
import { ETAPE_DOSSIER_COMPLET } from "../../../../_common/model/usager/ETAPES_DEMANDE.const";
import { UsagerDecisionMotif } from "../../../../_common/model/usager/UsagerDecisionMotif.type";
import { Entretien } from "../../../interfaces/entretien";
import { UsagersImportUsager } from "../step2-validate-row/schema";

export const usagersImportBuilder = {
  buildUsagers,
};

function buildUsagers({
  usagersRows,
  user,
}: {
  usagersRows: UsagersImportUsager[];
  user: Pick<AppUser, "id" | "structureId" | "prenom" | "nom">;
}): Partial<Usager>[] {
  const now = moment().toDate();
  const agent = user.prenom + " " + user.nom;

  return usagersRows.map((usagerRow) =>
    buildUsager({
      usagerRow,
      now,
      agent,
      user,
    })
  );
}

function buildUsager({
  usagerRow,
  now,
  agent,
  user,
}: {
  usagerRow: UsagersImportUsager;
  now: Date;
  agent: string;
  user: Pick<AppUser, "id" | "structureId">;
}) {
  const sexe = usagerRow.civilite === "H" ? "homme" : "femme";
  let motif: UsagerDecisionMotif;

  // Tableaux d'ayant-droit & historique
  const historique: UsagerVisibleHistoryDecision[] = [];

  // Partie STATUT + HISTORIQUE
  //
  let datePremiereDom = now;
  let dateDecision = usagerRow.dateDebutDom ?? now;

  //
  // Partie ENTRETIEN
  //
  const entretien: Entretien = buildEntretien(usagerRow);
  const ayantsDroits = buildAyantsDroits(usagerRow);

  if (usagerRow.datePremiereDom) {
    datePremiereDom = usagerRow.datePremiereDom;

    const dateFinPremiereDom = moment(datePremiereDom).add(1, "year").toDate();

    historique.push({
      uuid: uuidGenerator.random(),
      dateDebut: datePremiereDom,
      dateDecision: datePremiereDom,
      dateFin: dateFinPremiereDom,
      motif,
      // TODO: remplacer tous les "PREMIERE_DOM" par "PREMIERE"
      statut: "PREMIERE",
      userId: user.id,
      userName: agent,
    });
  } else if (usagerRow.dateDebutDom) {
    datePremiereDom = usagerRow.dateDebutDom;
  }

  historique.push({
    uuid: uuidGenerator.random(),
    dateDebut: now,
    dateDecision: now,
    dateFin: now,
    motif,
    statut: "IMPORT",
    userId: user.id,
    userName: agent,
  });

  const customRef = usagerRow.customId;

  const phone = usagerRow.phone;

  const email = usagerRow.email;

  //
  // Dates
  //
  const dernierPassage = usagerRow.dateDernierPassage ?? now;

  let dateDebut = usagerRow.dateDebutDom;

  const dateFin = usagerRow.dateFinDom;

  if (usagerRow.statutDom === "REFUS") {
    motif = usagerRow.motifRefus ?? "AUTRE";
    dateDebut = usagerRow.dateFinDom;
    dateDecision = usagerRow.dateFinDom;
  }

  if (usagerRow.statutDom === "RADIE") {
    dateDecision = usagerRow.dateFinDom ?? now;
    motif = usagerRow.motifRadiation ?? "AUTRE";
  }
  // Enregistrement
  const usager: Partial<Usager> = {
    ayantsDroits,
    customRef,
    dateNaissance: usagerRow.dateNaissance,
    datePremiereDom,
    decision: {
      dateDebut,
      dateDecision,
      dateFin,
      motif,
      motifDetails: "",
      statut: usagerRow.statutDom,
      userId: user.id,
      userName: agent,
    },
    lastInteraction: {
      dateInteraction: dernierPassage,
      colisIn: 0,
      courrierIn: 0,
      recommandeIn: 0,
      enAttente: false,
    },
    email,
    entretien,
    etapeDemande: ETAPE_DOSSIER_COMPLET,
    historique,
    nom: usagerRow.nom,
    phone,
    prenom: usagerRow.prenom,
    sexe,
    structureId: user.structureId,
    surnom: usagerRow.surnom,
    typeDom: usagerRow.typeDom,
    villeNaissance: usagerRow.lieuNaissance,
  };

  return usager;
}
function buildAyantsDroits(usagerRow): UsagerAyantDroit[] {
  return usagerRow.ayantsDroits.map((ad) => {
    const ayantDroit: UsagerAyantDroit = {
      dateNaissance: ad.dateNaissance,
      lien: ad.lienParente,
      nom: ad.nom,
      prenom: ad.prenom,
    };
    return ayantDroit;
  });
}

function buildEntretien(usagerRow) {
  const entretien: Entretien = {};

  entretien.accompagnement = usagerRow.accompagnement;
  if (usagerRow.accompagnement) {
    entretien.accompagnementDetail = usagerRow.accompagnementDetails;
  }

  entretien.revenus = usagerRow.revenus;
  if (usagerRow.revenus) {
    entretien.revenusDetail = usagerRow.revenusDetails;
  }

  entretien.orientation = usagerRow.orientation;
  if (usagerRow.orientation) {
    entretien.orientationDetail = usagerRow.orientationDetails;
  }
  return entretien;
}
