import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomToastService } from "src/app/modules/shared/services/custom-toast.service";

import {
  UsagerLight,
  UserStructure,
  UsagerOptionsHistory,
} from "../../../../../_common/model";
import { DECISION_LABELS } from "../../../../shared/constants/USAGER_LABELS.const";
import { getUsagerNomComplet } from "../../../../shared/getUsagerNomComplet";
import { AuthService } from "../../../shared/services/auth.service";
import { UsagerFormModel } from "../../../usager-shared/interfaces";
import { UsagerService } from "../../../usagers/services/usager.service";
import { UsagerProfilService } from "../../services/usager-profil.service";

@Component({
  selector: "app-profil-historique",
  templateUrl: "./profil-historique.component.html",
  styleUrls: ["./profil-historique.component.css"],
})
export class ProfilHistoriqueComponent implements OnInit {
  public me: UserStructure;
  public usager: UsagerFormModel;

  public DECISION_LABELS = DECISION_LABELS;

  public actions = {
    EDIT: "Modification",
    DELETE: "Suppression",
    CREATION: "Création",
  };
  public transfertHistory: UsagerOptionsHistory[];
  public procurationHistory: UsagerOptionsHistory[];

  constructor(
    private authService: AuthService,
    private usagerService: UsagerService,
    private usagerProfilService: UsagerProfilService,
    private titleService: Title,
    private toastService: CustomToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.me = null;
  }

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((user: UserStructure) => {
      this.me = user;
    });

    this.usagerService.findOne(this.route.snapshot.params.id).subscribe(
      (usager: UsagerLight) => {
        const name = getUsagerNomComplet(usager);
        this.titleService.setTitle("Historique de " + name);
        this.usager = new UsagerFormModel(usager);

        this.usagerProfilService
          .findHistory(this.usager.ref)
          .subscribe((res) => {
            this.transfertHistory = res.filter(
              (history) => history.type === "transfert"
            );
            this.procurationHistory = res.filter(
              (history) => history.type === "procuration"
            );

            console.log("tranfert : ", this.transfertHistory);
            console.log("procu : ", this.procurationHistory);
          });
      },
      () => {
        this.toastService.error("Le dossier recherché n'existe pas");
        this.router.navigate(["404"]);
      }
    );
  }
}
