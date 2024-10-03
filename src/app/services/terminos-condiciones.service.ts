import { TerminosCondiciones } from './../models/terminos-condiciones';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Autorizacion } from '../models/autorizacion';

@Injectable({
  providedIn: 'root',
})
export class TerminosCondicionesService {
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  private url: string = `${environment.URL_BACKEND}/api/terminos-condiciones`;

  constructor(private http: HttpClient, private authservice: AuthService) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  userLogeado: String = this.authservice.user.username;

  verificarAutorizacion(persoanCodigo: number): Observable<number> {
    return this.http.get<number>(
      `${this.url}/verificar-autorizacion/${persoanCodigo}`,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  obtenerTermino(): Observable<TerminosCondiciones> {
    return this.http.get<TerminosCondiciones>(`${this.url}/obtener-termino`, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  registrarAutorizacion(autorizacion: Autorizacion): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-autorizacion`,
      autorizacion,
      { withCredentials: true, headers: this.aggAutorizacionHeader() }
    );
  }
}
