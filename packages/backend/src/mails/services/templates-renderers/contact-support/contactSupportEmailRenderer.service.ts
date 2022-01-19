import { ContactSupport } from "./../../../../_common/model/contact/ContactMessage.type";
import moment = require("moment");
import { domifaConfig } from "../../../../config";
import { DomifaMailTemplateRendering } from "../../../model";
import { domifaMailTemplateRenderer } from "../../domifaMailTemplateRenderer.service";

async function renderTemplate(
  model: ContactSupport
): Promise<DomifaMailTemplateRendering> {
  return domifaMailTemplateRenderer.renderTemplate("contact-support", {
    ...model,
  });
}

export const contactSupportEmailRenderer = { renderTemplate };
