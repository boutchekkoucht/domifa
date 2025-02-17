import { LoadingService } from "./modules/shared/services/loading.service";

import { CustomToastService } from "./modules/shared/services/custom-toast.service";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ErrorHandler,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import * as Sentry from "@sentry/angular";

import { CountUpModule } from "ngx-countup";
import { MatomoModule } from "ngx-matomo";

import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { SentryErrorHandler } from "./interceptors/sentry.interceptor";
import { ServerErrorInterceptor } from "./interceptors/server-error.interceptor";
import { GeneralModule } from "./modules/general/general.module";
import { AuthService } from "./modules/shared/services/auth.service";
import { HealthCheckService } from "./modules/shared/services/health-check";
import { SharedModule } from "./modules/shared/shared.module";

import { UsagersModule } from "./modules/usagers/usagers.module";
import { UsersModule } from "./modules/users/users.module";
import { UsagerSharedModule } from "./modules/usager-shared/usager-shared.module";
import { NgxChartsModule } from "@swimlane/ngx-charts";

import pkg from "../../package.json";
import { UserIdleModule } from "angular-user-idle";

if (environment.production) {
  Sentry.init({
    release: "domifa@" + pkg.version,
    dsn: "https://5dab749719e9488798341efad0947291@sentry.fabrique.social.gouv.fr/31",
    environment: environment.env,
    tracesSampleRate: 1.0,
  });
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatomoModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    GeneralModule,
    MatomoModule,
    NgbModule,
    NgxChartsModule,
    SharedModule,
    UsagerSharedModule,
    UsagersModule,
    CountUpModule,
    UsersModule,
    UserIdleModule.forRoot({ idle: 3600, timeout: 60, ping: 120 }),
  ],
  providers: [
    AuthService,
    LoadingService,
    CustomToastService,
    HealthCheckService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      deps: [Router, AuthService],
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
    },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}
