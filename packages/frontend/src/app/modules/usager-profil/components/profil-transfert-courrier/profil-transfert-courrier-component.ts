import { UsagerOptionsService } from "./../../services/usager-options.service";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MatomoTracker } from "ngx-matomo";
import { CustomToastService } from "src/app/modules/shared/services/custom-toast.service";
import {
  UserStructure,
  UsagerLight,
  UserStructureRole,
} from "../../../../../_common/model";
import {
  minDateToday,
  formatDateToNgb,
} from "../../../../shared/bootstrap-util";
import { endDateAfterBeginDateValidator } from "../../../../shared/validators";
import { NgbDateCustomParserFormatter } from "../../../shared/services/date-formatter";
import { CustomDatepickerI18n } from "../../../shared/services/date-french";
import { UsagerFormModel } from "../../../usager-shared/interfaces";

@Component({
  providers: [
    NgbDateCustomParserFormatter,
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  ],
  selector: "app-profil-transfert-courrier",
  styleUrls: ["./profil-transfert-courrier.css"],
  templateUrl: "./profil-transfert-courrier.html",
})
export class UsagersProfilTransfertCourrierComponent implements OnInit {
  @Input() public usager: UsagerFormModel;
  @Input() public me: UserStructure;

  @Output() usagerChanges = new EventEmitter<UsagerLight>();

  public actions = {
    EDIT: "Modification",
    DELETE: "Suppression",
    CREATION: "Création",
  };

  public isFormVisible: boolean;
  public submitted: boolean;

  public transfertForm!: FormGroup;
  public minDateToday: NgbDateStruct;

  @ViewChild("confirmDelete", { static: true })
  public confirmDelete!: TemplateRef<NgbModalRef>;

  constructor(
    private formBuilder: FormBuilder,
    private nbgDate: NgbDateCustomParserFormatter,
    private toastService: CustomToastService,
    private usagerOptionsService: UsagerOptionsService,
    private matomo: MatomoTracker,
    private readonly modalService: NgbModal
  ) {
    this.isFormVisible = false;
    this.submitted = false;
    this.minDateToday = minDateToday;
    this.usager = null;
    this.me = null;
  }

  public ngOnInit(): void {
    this.initForm();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.transfertForm.controls;
  }

  public showForm(): void {
    this.isFormVisible = true;
    this.initForm();
    this.transfertForm.reset(this.transfertForm.value);
  }

  public hideForm(): void {
    this.isFormVisible = false;
    this.transfertForm.reset(this.transfertForm.value);
  }

  public isRole(role: UserStructureRole): boolean {
    return this.me.role === role;
  }

  public initForm(): void {
    this.transfertForm = this.formBuilder.group(
      {
        nom: [this.usager.options.transfert.nom, [Validators.required]],
        adresse: [
          this.usager.options.transfert.adresse,
          [Validators.required, Validators.minLength(10)],
        ],
        dateFin: [
          formatDateToNgb(this.usager.options.transfert.dateFin),
          [Validators.required],
        ],
        dateDebut: [
          formatDateToNgb(this.usager.options.transfert.dateDebut),
          [Validators.required],
        ],
      },
      {
        validator: endDateAfterBeginDateValidator({
          beginDateControlName: "dateDebut",
          endDateControlName: "dateFin",
        }),
      }
    );
  }

  public editTransfert(): void {
    this.submitted = true;
    if (this.transfertForm.invalid) {
      this.toastService.error(
        "Un des champs du formulaire n'est pas rempli ou contient une erreur"
      );
      return;
    }

    const formValue = {
      ...this.transfertForm.value,
      dateFin: new Date(
        this.nbgDate.formatEn(this.transfertForm.controls.dateFin.value)
      ),
      dateDebut: new Date(
        this.nbgDate.formatEn(this.transfertForm.controls.dateDebut.value)
      ),
    };

    this.usagerOptionsService
      .editTransfert(formValue, this.usager.ref)
      .subscribe({
        next: (usager: UsagerLight) => {
          this.usagerChanges.emit(usager);
          this.hideForm();
          this.matomo.trackEvent("profil", "actions", "edit_transfert", 1);
          this.usager = new UsagerFormModel(usager);

          this.toastService.success("Transfert modifié avec succès");
        },
        error: () => {
          this.toastService.error("Impossible d'ajouter le transfert'");
        },
      });
  }

  public openConfirmation(): void {
    this.modalService.open(this.confirmDelete);
  }

  public closeModals(): void {
    this.modalService.dismissAll();
  }
  public deleteTransfert(): void {
    if (!this.usager.options.transfert.actif) {
      this.hideForm();
      return;
    }

    this.usagerOptionsService.deleteTransfert(this.usager.ref).subscribe({
      next: (usager: UsagerLight) => {
        this.toastService.success("Transfert supprimé avec succès");

        setTimeout(() => {
          this.closeModals();
          this.hideForm();
          this.usagerChanges.emit(usager);
          this.transfertForm.reset();
          this.usager = new UsagerFormModel(usager);
          this.matomo.trackEvent("profil", "actions", "delete_transfert", 1);
        }, 500);
      },
      error: () => {
        this.toastService.error("Impossible de supprimer le transfert");
      },
    });
  }
}
