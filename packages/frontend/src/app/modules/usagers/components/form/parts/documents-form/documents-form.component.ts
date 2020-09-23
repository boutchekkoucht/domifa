import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Usager } from "src/app/modules/usagers/interfaces/usager";
import { UsagerService } from "src/app/modules/usagers/services/usager.service";

import { User } from "src/app/modules/users/interfaces/user";
import { AuthService } from "src/app/modules/shared/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  providers: [UsagerService],
  selector: "app-documents-form",
  templateUrl: "./documents-form.component.html",
})
export class DocumentsFormComponent implements OnInit {
  @Input() public usager!: Usager;
  @Output() public usagerChange = new EventEmitter<Usager>();

  public me: User;

  constructor(
    private usagerService: UsagerService,
    public authService: AuthService,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute
  ) {
    this.authService.currentUser.subscribe((user: User) => {
      this.me = user;
    });
  }
  public ngOnInit() {
    this.titleService.setTitle("Pièces-jointes du dossier");

    if (this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;

      this.usagerService.findOne(id).subscribe(
        (usager: Usager) => {
          this.usager = usager;
        },
        (error) => {
          this.router.navigate(["404"]);
        }
      );
    } else {
      this.router.navigate(["404"]);
    }
  }

  public nextStep(step: number) {
    this.usagerService
      .nextStep(this.usager.id, step)
      .subscribe((usager: Usager) => {
        this.usager.etapeDemande = usager.etapeDemande;
        this.router.navigate(["usager/" + this.usager.id + "/edit/decision"]);
      });
  }
}
