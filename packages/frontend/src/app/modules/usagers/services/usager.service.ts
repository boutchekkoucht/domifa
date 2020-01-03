import { HttpClient, HttpEventType, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { LoadingService } from "../../loading/loading.service";
import { Decision } from "../interfaces/decision";
import { Entretien } from "../interfaces/entretien";
import { Rdv } from "../interfaces/rdv";
import { Usager } from "../interfaces/usager";

@Injectable({
  providedIn: "root"
})
export class UsagerService {
  public http: HttpClient;
  public loading: boolean;
  public endPointUsagers = environment.apiUrl + "usagers";

  constructor(http: HttpClient, private loadingService: LoadingService) {
    this.http = http;
    this.loading = true;
  }

  public create(usager: Usager) {
    return usager.id !== 0
      ? this.http.patch(`${this.endPointUsagers}/${usager.id}`, usager)
      : this.http.post(`${this.endPointUsagers}`, usager);
  }

  public createRdv(rdv: Rdv, usagerId: number): Observable<any> {
    return this.http.post(`${this.endPointUsagers}/rdv/${usagerId}`, rdv);
  }

  public editTransfert(transfert: any, usagerId: number): Observable<any> {
    return this.http.post(
      `${this.endPointUsagers}/transfert/${usagerId}`,
      transfert
    );
  }

  public deleteTransfert(usagerId: number): Observable<any> {
    return this.http.delete(`${this.endPointUsagers}/transfert/${usagerId}`);
  }

  public nextStep(usagerId: number, etapeDemande: number): Observable<any> {
    return this.http.get(
      `${this.endPointUsagers}/next-step/${usagerId}/${etapeDemande}`
    );
  }

  public renouvellement(usagerId: number): Observable<any> {
    return this.http.get(`${this.endPointUsagers}/renouvellement/${usagerId}`);
  }

  public entretien(entretien: Entretien, usagerId: number) {
    return this.http
      .post(`${this.endPointUsagers}/entretien/${usagerId}`, entretien)
      .pipe(
        map(response => {
          return new Usager(response);
        })
      );
  }

  public setDecision(usagerId: number, decision: Decision, statut: string) {
    decision.statut = statut;
    return this.http.post(
      `${this.endPointUsagers}/decision/${usagerId}`,
      decision
    );
  }

  public findOne(usagerId: number): Observable<Usager> {
    return this.http.get(`${this.endPointUsagers}/${usagerId}`).pipe(
      map(response => {
        return new Usager(response);
      })
    );
  }

  public isDoublon(nom: string, prenom: string) {
    return this.http.get(`${this.endPointUsagers}/doublon/${nom}/${prenom}`);
  }

  public delete(usagerId: number) {
    return this.http.delete(`${this.endPointUsagers}/${usagerId}`);
  }

  public getStats() {
    return this.http.get(`${this.endPointUsagers}/stats`);
  }

  /* Recherche */
  public search(filters?: {}): Observable<Usager[]> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null) {
        httpParams = httpParams.append(key, filters[key]);
      }
    });
    return this.http
      .get(`${this.endPointUsagers}/search/`, {
        params: httpParams
      })
      .pipe(
        map(response => {
          return Array.isArray(response)
            ? response.map(item => new Usager(item))
            : [new Usager(response)];
        })
      );
  }

  /* Attestation */
  public attestation(usagerId: number) {
    this.loadingService.startLoading();

    this.http
      .get(`${this.endPointUsagers}/attestation/${usagerId}`, {
        responseType: "blob"
      })
      .subscribe(x => {
        const newBlob = new Blob([x], { type: "application/pdf" });

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        }
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement("a");
        const randomNumber = Math.floor(Math.random() * 100) + 1;

        link.href = data;
        link.download = "attestation_" + usagerId + "_" + randomNumber + ".pdf";
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          })
        );

        setTimeout(() => {
          window.URL.revokeObjectURL(data);
          link.remove();
          this.loadingService.stopLoading();
        }, 500);
      });
  }

  public import(data: any) {
    const uploadURL = environment.apiUrl + "import";

    return this.http
      .post<any>(uploadURL, data, {
        observe: "events",
        reportProgress: true
      })
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: "progress", message: progress };
            case HttpEventType.Response:
              return { success: true, body: event.body };
            default:
              return `Unhandled event: ${event.type}`;
          }
        })
      );
  }
}
