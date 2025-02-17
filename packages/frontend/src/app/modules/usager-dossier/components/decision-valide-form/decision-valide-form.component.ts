import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { addYears, subDays, format, isBefore } from "date-fns";
import {
  UsagerLight,
  UsagerDecisionValideForm,
} from "../../../../../_common/model";
import { formatDateToNgb } from "../../../../shared";
import { CustomToastService } from "../../../shared/services/custom-toast.service";
import { NgbDateCustomParserFormatter } from "../../../shared/services/date-formatter";
import { UsagerFormModel } from "../../../usager-shared/interfaces";
import { UsagerDecisionService } from "../../../usager-shared/services/usager-decision.service";
@Component({
  selector: "app-decision-valide-form",
  templateUrl: "./decision-valide-form.component.html",
  styleUrls: ["./decision-valide-form.component.css"],
})
export class DecisionValideFormComponent implements OnInit {
  @Input() public usager: UsagerFormModel;

  @Output() public closeModals = new EventEmitter<void>();

  public submitted: boolean;
  public loading: boolean;

  public valideForm!: FormGroup;

  public minDate: NgbDateStruct;
  public maxDate: NgbDateStruct;
  public maxEndDate: NgbDateStruct;
  public showDurationWarning: boolean;

  public usagersRefs: Pick<
    UsagerLight,
    "ref" | "customRef" | "nom" | "prenom" | "sexe" | "structureId"
  >[];

  constructor(
    private formBuilder: FormBuilder,
    private usagerDecisionService: UsagerDecisionService,
    private router: Router,
    private nbgDate: NgbDateCustomParserFormatter,
    private toastService: CustomToastService
  ) {
    this.submitted = false;
    this.loading = false;

    this.usagersRefs = [];
    this.minDate = { day: 1, month: 1, year: new Date().getFullYear() - 1 };
    this.maxDate = { day: 31, month: 12, year: new Date().getFullYear() + 2 };
    this.maxEndDate = this.setDate(subDays(addYears(new Date(), 1), 1));
    this.showDurationWarning = false;
  }

  get v(): { [key: string]: AbstractControl } {
    return this.valideForm.controls;
  }

  private setDate(date: Date) {
    return {
      day: parseInt(format(date, "d"), 10),
      month: parseInt(format(date, "M"), 10),
      year: parseInt(format(date, "y"), 10),
    };
  }

  public ngOnInit(): void {
    this.valideForm = this.formBuilder.group({
      dateDebut: [formatDateToNgb(new Date()), [Validators.required]],
      dateFin: [
        formatDateToNgb(subDays(addYears(new Date(), 1), 1)),
        [Validators.required],
      ],
      statut: ["VALIDE", [Validators.required]],
      customRef: [this.usager.customRef],
    });

    this.valideForm.get("dateDebut").valueChanges.subscribe((value) => {
      if (value !== null && this.nbgDate.isValid(value)) {
        const newDateDebut = new Date(this.nbgDate.formatEn(value));
        const newDateFin = subDays(addYears(newDateDebut, 1), 1);

        this.valideForm.controls.dateFin.setValue(formatDateToNgb(newDateFin));
        this.maxEndDate = this.setDate(subDays(addYears(newDateDebut, 1), 1));
      }
    });

    this.valideForm.get("dateFin").valueChanges.subscribe((value) => {
      const dateDebut = new Date(
        this.nbgDate.formatEn(this.valideForm.get("dateDebut").value)
      );

      if (
        value !== null &&
        this.nbgDate.isValid(value) &&
        isBefore(
          new Date(this.nbgDate.formatEn(value)),
          subDays(addYears(dateDebut, 1), 1)
        )
      ) {
        this.showDurationWarning = true;
      } else {
        this.showDurationWarning = false;
      }
    });

    // Affichage des 5 derniers ids
    this.getLastUsagersRefs();
  }

  public setDecisionValide() {
    this.submitted = true;
    if (this.valideForm.invalid) {
      this.toastService.error(
        "Le formulaire contient une erreur, veuillez vérifier les champs"
      );
      return;
    }

    const formDatas: UsagerDecisionValideForm = {
      ...this.valideForm.value,
      dateDebut: new Date(
        this.nbgDate.formatEn(this.valideForm.controls.dateDebut.value)
      ),
      dateFin: new Date(
        this.nbgDate.formatEn(this.valideForm.controls.dateFin.value)
      ),
    };

    this.setDecision(formDatas);
  }

  public setDecision(formDatas: UsagerDecisionValideForm): void {
    this.loading = true;
    this.usagerDecisionService
      .setDecision(this.usager.ref, formDatas)
      .subscribe({
        next: (usager: UsagerLight) => {
          this.toastService.success("Décision enregistrée avec succès ! ");
          this.router.navigate(["profil/general/" + usager.ref]);
          this.closeModals.emit();
          this.submitted = false;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastService.error("La décision n'a pas pu être enregistrée");
        },
      });
  }
  private getLastUsagersRefs() {
    this.usagerDecisionService.getLastFiveCustomRef(this.usager.ref).subscribe({
      next: (usagers: UsagerLight[]) => {
        this.usagersRefs = usagers;
      },
    });
  }
}
