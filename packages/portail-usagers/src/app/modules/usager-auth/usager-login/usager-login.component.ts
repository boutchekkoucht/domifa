import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MatomoInjector, MatomoTracker } from "ngx-matomo";

import { environment } from "../../../../environments/environment";
import type {
  PortailUsagerAuthApiResponse,
  PortailUsagerAuthLoginForm,
} from "../../../../_common";
import { UsagerAuthService } from "../services/usager-auth.service";
import { PasswordValidator } from "./password-validator.service";

@Component({
  selector: "app-usager-login",
  styleUrls: ["./usager-login.component.css"],
  templateUrl: "./usager-login.component.html",
})
export class UsagerLoginComponent implements OnInit {
  public loginForm!: FormGroup;

  public hidePassword: boolean;
  public hidePasswordNew: boolean;

  public loading: boolean;

  public mode: "login-only" | "login-change-password" = "login-only";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: Title,
    private authService: UsagerAuthService,
    private toastr: ToastrService,
    private matomoInjector: MatomoInjector,
    public matomo: MatomoTracker
  ) {
    this.matomoInjector.init(environment.matomo.url, environment.matomo.siteId);
    this.hidePassword = true;
    this.hidePasswordNew = true;
    this.loading = false;
  }

  public ngOnInit(): void {
    this.titleService.setTitle("Connexion à DomiFa");
    this.initForm();
  }

  public initForm(): void {
    this.loginForm = this.formBuilder.group(
      {
        password: ["", Validators.required],
        login: ["", [Validators.required]],
        newPassword: [
          { value: "", disabled: true },
          Validators.compose([
            Validators.required,
            PasswordValidator.patternValidator(/\d/, {
              hasNumber: true,
            }),
            PasswordValidator.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            PasswordValidator.patternValidator(/[a-z]/, {
              hasLowerCase: true,
            }),
            Validators.minLength(8),
          ]),
        ],
        newPasswordConfirm: [
          { value: "", disabled: true },
          Validators.compose([Validators.required, Validators.minLength(8)]),
        ],
      },
      {
        validators: [
          PasswordValidator.fieldsNotEqualsValidator({
            ctrl1Name: "password",
            ctrl2Name: "newPassword",
            errName: "new-password-same-as-temporary-password",
          }),
          PasswordValidator.fieldsEqualsValidator({
            ctrl1Name: "newPassword",
            ctrl2Name: "newPasswordConfirm",
            errName: "new-password-confim-does-not-match",
          }),
        ],
      }
    );
  }

  private switchToChangePasswordMode() {
    this.mode = "login-change-password";
    this.loginForm.controls.newPassword.enable();
    this.loginForm.controls.newPasswordConfirm.enable();
    this.loginForm.updateValueAndValidity();
  }

  public switchToLoginOnly() {
    this.mode = "login-only";
    this.loginForm.controls.newPassword.disable();
    this.loginForm.controls.newPasswordConfirm.disable();
    this.loginForm.controls.newPassword.setValue("");
    this.loginForm.controls.newPasswordConfirm.setValue("");
    this.loginForm.updateValueAndValidity();
  }

  get f(): Record<string, AbstractControl> {
    return this.loginForm.controls;
  }

  public login(): void {
    console.log("xxx this.loginForm", this.loginForm);
    console.log(
      "xxx f.newPasswordConfirm?.errors",
      this.loginForm.controls.newPasswordConfirm?.errors
    );
    console.log("xxx this.loginForm.errors", this.loginForm.errors);
    console.log(
      "xxx hasError ",
      this.loginForm?.hasError("new-password-confim-does-not-match")
    );

    if (this.loginForm.invalid) {
      this.toastr.error("Veuillez vérifier les champs du formulaire");
      return;
    }

    const loginForm = this.loginForm.value as PortailUsagerAuthLoginForm;
    this.loading = true;

    this.authService.login(loginForm).subscribe({
      error: (err) => {
        this.loading = false;
        if (err?.error?.message === "CHANGE_PASSWORD_REQUIRED") {
          this.switchToChangePasswordMode();
          this.matomo.trackEvent(
            "login-portail-usagers",
            "login_success_first_time",
            "null",
            1
          );
        } else {
          this.toastr.error("Login et / ou mot de passe incorrect");
          this.matomo.trackEvent(
            "login-portail-usagers",
            "login_error",
            "null",
            1
          );
        }
      },
      next: (apiAuthResponse: PortailUsagerAuthApiResponse) => {
        this.toastr.success("Connexion réussie");

        // SAVE USER & Tokenn
        this.authService.saveToken(apiAuthResponse);

        this.loading = false;
        this.router.navigate(["/account"]);

        this.matomo.trackEvent(
          "login-portail-usagers",
          "login_success",
          "null",
          1
        );
      },
    });
  }
}
