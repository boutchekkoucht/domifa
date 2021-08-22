import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { SharedModule } from "../shared/shared.module";

import { StatsService } from "./components/services/stats.service";
import { StatsComponent } from "./components/structure-stats/structure-stats.component";
import { PublicStatsComponent } from "./components/public-stats/public-stats.component";
import { StatsRoutingModule } from "./stats-routing.module";

@NgModule({
  declarations: [StatsComponent, PublicStatsComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    FontAwesomeModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StatsRoutingModule,
  ],
  providers: [StatsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class StatsModule {}
