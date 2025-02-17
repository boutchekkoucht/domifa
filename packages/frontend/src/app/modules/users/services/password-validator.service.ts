import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidator {
  public static patternValidator(
    regex: RegExp,
    error: ValidationErrors
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }

  public static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value;
    const confirmPassword: string = control.get("confirmPassword").value;
    if (password !== confirmPassword) {
      control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
    }
  }

  // TODO: basculer sur ce validateur car l'ancien est déprécié
  // public static passwordMatchValidator: ValidatorFn = (
  //   control: AbstractControl
  // ): ValidationErrors | null => {
  //   const password: string = control.get("password").value;
  //   const confirmPassword: string = control.get("confirmPassword").value;
  //   return password === confirmPassword ? null : { notmatched: true };
  // };
}
