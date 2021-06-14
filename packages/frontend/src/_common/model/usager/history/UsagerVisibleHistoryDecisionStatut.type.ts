import { UsagerDecisionStatut } from "../UsagerDecisionStatut.type";

// utilisé juste pour l'affichage de l'historique
export type UsagerVisibleHistoryDecisionStatut =
  | UsagerDecisionStatut
  // TODO: remplacer par PREMIERE ?
  | "PREMIERE" // utilisé pour tracer la première DOM (avant domifa)
  | "PREMIERE_DOM" // utilisé pour tracer la première DOM (avant domifa)
  | "IMPORT"; // utilisé pour tracer le fait que l'usager a été importé dans domifa
