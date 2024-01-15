import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Correo } from '../models/correo';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private url: any = environment.URL_BACKEND;
  private usuario: Usuario = new Usuario();
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });
  userLogeado: any = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
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
  private isNoAutorizado(e: any): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  // Método para obtener el token de USCO (Universidad Surcolombiana)
  gettokenUsco(): Observable<Correo> {
    this.usuario = JSON.parse(
      sessionStorage.getItem('usuario') || '{}'
    ) as Usuario;
    if (JSON.stringify(this.usuario.username) === '') {
      this.router.navigate(['/login']);
    }
    return this.http
      .get<Correo>(this.url + '/getToken/' + this.usuario.username, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  // Método para validar el token de USCO
  validartokenUsco(codigo: String): Observable<String> {
    return this.http
      .get<String>(
        this.url + '/validarToken/' + this.usuario.username + '/' + codigo,
        { headers: this.aggAutorizacionHeader() }
      )
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: 'error',
              title: `${e.error.mensaje}.`,
            });
            return throwError(e);
          }

          return throwError(e);
        })
      );
  }
}
