import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimumAgeValidator(age: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlValue = control.value;

    if (
      controlValue === null ||
      controlValue === undefined ||
      isNaN(controlValue)
    ) {
      return null;
    }

    const todayDate: Date = new Date();
    let limitDate: Date = new Date(controlValue);
    limitDate.setFullYear(limitDate.getFullYear() + age);

    return todayDate >= limitDate ? null : { minimumAge: true };
  };
}
