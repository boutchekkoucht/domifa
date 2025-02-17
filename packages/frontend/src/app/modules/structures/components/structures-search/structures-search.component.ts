import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { CustomToastService } from "src/app/modules/shared/services/custom-toast.service";
import { StructureCommon } from "../../../../../_common/model";
import { StructureService } from "../../services/structure.service";

@Component({
  selector: "app-structures-search",
  styleUrls: ["./structures-search.component.css"],
  templateUrl: "./structures-search.component.html",
})
export class StructuresSearchComponent implements OnInit {
  public structures: StructureCommon[];
  public searchFailed: boolean;

  public codePostal: string;
  public codePostalForm!: FormGroup;

  constructor(
    private structureService: StructureService,
    private formBuilder: FormBuilder,
    private toastService: CustomToastService,
    private titleService: Title
  ) {
    this.searchFailed = false;
    this.structures = [];
    this.codePostal = "";
  }

  get f(): { [key: string]: AbstractControl } {
    return this.codePostalForm.controls;
  }

  public ngOnInit(): void {
    this.titleService.setTitle("Inscrivez-vous sur Domifa");
    this.codePostalForm = this.formBuilder.group({
      codePostal: [
        this.codePostal,
        [
          Validators.required,
          Validators.maxLength(5),
          this.structureService.codePostalValidator(),
        ],
      ],
    });
  }

  public submitCodePostal() {
    if (this.codePostalForm.invalid) {
      this.toastService.error(
        "Veuillez vérifier les champs marqués en rouge dans le formulaire"
      );
    } else {
      this.structureService
        .find(this.f.codePostal.value)
        .subscribe((structures: StructureCommon[]) => {
          if (structures.length === 0) {
            this.searchFailed = true;
          } else {
            this.searchFailed = false;
            this.structures = structures;
          }
        });
    }
  }
}
