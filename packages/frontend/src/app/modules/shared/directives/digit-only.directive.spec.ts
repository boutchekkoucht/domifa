/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement } from "@angular/core";

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DigitOnlyDirective } from "./digit-only.directive";

@Component({
  template: ` <input type="text" name="chips" digitOnly /> `,
})
class TestHoverFocusComponent {
  public value: any;
}

describe("Directive: Digit Only", () => {
  let component: TestHoverFocusComponent;
  let fixture: ComponentFixture<TestHoverFocusComponent>;
  let inputEl: DebugElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestHoverFocusComponent, DigitOnlyDirective],
      });

      fixture = TestBed.createComponent(TestHoverFocusComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css("input"));
    })
  );

  it("should be created", fakeAsync(() => {
    const numberDebug = fixture.debugElement.query(By.css("input"));
    const numberInput = numberDebug.nativeElement as HTMLInputElement;
    numberDebug.triggerEventHandler("keydown", { bubbles: true, key: 2 });
    tick();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(numberInput.value).toEqual("");
    });
  }));
});
