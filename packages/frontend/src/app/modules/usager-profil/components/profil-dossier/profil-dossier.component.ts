import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomToastService } from "src/app/modules/shared/services/custom-toast.service";
import {
  UsagerLight,
  UserStructure,
  UserStructureRole,
} from "../../../../../_common/model";
import { getUsagerNomComplet } from "../../../../shared/getUsagerNomComplet";
import { AuthService } from "../../../shared/services/auth.service";
import { UsagerFormModel } from "../../../usager-shared/interfaces/UsagerFormModel";

import { UsagerService } from "../../../usagers/services/usager.service";

@Component({
  selector: "app-profil-dossier",
  templateUrl: "./profil-dossier.component.html",
  styleUrls: ["./profil-dossier.component.css"],
})
export class ProfilDossierComponent implements OnInit {
  public me: UserStructure;
  public usager: UsagerFormModel;

  public editInfos: boolean;
  public editEntretien: boolean;

  constructor(
    private authService: AuthService,
    private usagerService: UsagerService,
    private titleService: Title,
    private toastService: CustomToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.me = null;
    this.editInfos = false;
    this.editEntretien = false;
  }

  public ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((user: UserStructure) => {
      this.me = user;
    });

    this.usagerService.findOne(this.route.snapshot.params.id).subscribe({
      next: (usager: UsagerLight) => {
        this.usager = new UsagerFormModel(usager);
        const name = getUsagerNomComplet(usager);
        this.titleService.setTitle("Documents de " + name);
      },
      error: () => {
        this.toastService.error("Le dossier recherché n'existe pas");
        this.router.navigate(["404"]);
      },
    });
  }

  public openEntretien(): void {
    this.editEntretien = !this.editEntretien;
  }

  public isRole(role: UserStructureRole): boolean {
    return this.me.role === role;
  }

  public onUsagerChanges(usager: UsagerLight): void {
    this.usager = new UsagerFormModel(usager);
  }
}
