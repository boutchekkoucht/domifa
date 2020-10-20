import { Document } from "mongoose";
import { InteractionType } from "./InteractionType.type";

export interface Interaction extends Document {
  type: InteractionType;
  dateInteraction: Date;
  content?: string;
  nbCourrier?: number;
  usagerId: number;
  structureId: number;
  userName?: string;
  userId: number;
}
