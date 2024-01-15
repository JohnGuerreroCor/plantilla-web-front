import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Foto } from '../models/foto';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  private url: string = `${environment.URL_BACKEND}/foto`; // URL base para las operaciones del servicio
  private httpHeaders = new HttpHeaders(); // Encabezados HTTP para las solicitudes

  // Obtiene información del usuario del servicio de autenticación
  private uaa = this.authservice.obtenerUaa();
  private perCodigo = this.authservice.obtenerPerCodigo();
  userLogeado: String = this.authservice.user.username; // Nombre de usuario logeado

  constructor(
    private http: HttpClient, // Módulo para realizar solicitudes HTTP
    private router: Router, // Servicio de enrutamiento
    private authservice: AuthService // Servicio de autenticación
  ) {}

  // Método privado para agregar el token de autorización a los encabezados
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  // Método privado para manejar situaciones de no autorizado (401 o 403)
  private isNoAutorizado(e: { status: number }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  // Método para subir una foto al servidor
  subirFoto(archivo: File): Observable<null> {
    let formData: FormData = new FormData();
    formData.set('foto', archivo);
    return this.http.post<null>(
      `${this.url}/subir/${this.userLogeado}/${this.perCodigo}/${this.uaa}`,
      formData,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  // Método para obtener la foto del usuario
  mirarFoto(perCodigo: String): Observable<any> {
    return this.http.get<any>(
      `${this.url}/obtener-foto/${this.userLogeado}/${perCodigo}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  // Método para obtener la foto antigua del usuario
  mirarFotoAntigua(perCodigo: String): Observable<Foto> {
    return this.http.get<Foto>(
      `${this.url}/obtener-foto-antigua/${this.userLogeado}/${perCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
