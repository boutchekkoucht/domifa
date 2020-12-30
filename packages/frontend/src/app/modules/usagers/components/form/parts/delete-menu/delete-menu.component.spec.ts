import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { DeleteMenuComponent } from "./delete-menu.component";
import { APP_BASE_HREF } from "@angular/common";
import { MatomoInjector, MatomoTracker } from "ngx-matomo";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "../../../../../../app-routing.module";

describe("DeleteMenuComponent", () => {
  let component: DeleteMenuComponent;
  let fixture: ComponentFixture<DeleteMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: MatomoInjector,
          useValue: {
            init: jest.fn(),
          },
        },
        {
          provide: MatomoTracker,
          useValue: {
            setUserId: jest.fn(),
          },
        },
        { provide: APP_BASE_HREF, useValue: "/" },
      ],
      declarations: [DeleteMenuComponent],
    });
    fixture = TestBed.createComponent(DeleteMenuComponent);
    component = fixture.debugElement.componentInstance;
    component.ngOnInit();
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });
});
