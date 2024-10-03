import { TerminosCondicionesService } from './../../services/terminos-condiciones.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { Autorizacion } from 'src/app/models/autorizacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-autorizacion-datos',
  templateUrl: './autorizacion-datos.component.html',
  styleUrls: ['./autorizacion-datos.component.css'],
})
export class AutorizacionDatosComponent {
  usuario: Usuario;
  today = new Date();
  isScrolledToBottom = false;
  disableSelect = new FormControl(false);
  cargando: boolean = false;
  termino: String = '';
  terminoCodigo!: number;

  constructor(
    public authService: AuthService,
    public terminosCondicionesService: TerminosCondicionesService,
    private router: Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    this.terminosCondicionesService
      .verificarAutorizacion(this.authService.user.personaCodigo)
      .subscribe((data) => {
        if (data > 0) {
          this.router.navigate(['/inicio']);
        }
      });
    this.terminosCondicionesService.obtenerTermino().subscribe(
      (data) => {
        if (JSON.stringify(data) != '[]') {
          this.termino = data.termino;
          this.terminoCodigo = data.codigo;
        } else {
          this.router.navigate(['/login']);
        }
      },
      (err) => this.fError(err)
    );
  }

  registrarAutorizacion() {
    let autorizacion: Autorizacion = new Autorizacion();
    autorizacion.personaCodigo = this.authService.user.personaCodigo;
    autorizacion.moduloCodigo = 87;
    autorizacion.terminoCondicionCodigo = this.terminoCodigo;
    autorizacion.uid = this.authService.user.uid;
    this.terminosCondicionesService
      .registrarAutorizacion(autorizacion)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.mensajeExito();
            this.router.navigate(['/token']);
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  mensajeExito() {
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
      icon: 'success',
      title: 'Inicio de sesión exitoso.',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (
      arr[0] == 'Access token expired' ||
      arr[0] == 'Full authentication is required to access this resource'
    ) {
      this.authService.logout();
      this.router.navigate(['login']);
    }
  }

  @HostListener('scroll', ['$event.target'])
  onScroll(scrollTarget: any): void {
    // Verificar si se ha alcanzado el final del contenido
    const atBottom =
      scrollTarget.scrollTop + scrollTarget.offsetHeight >=
      scrollTarget.scrollHeight;
    this.isScrolledToBottom = atBottom;
  }

  activateButton(): void {
    // Lógica para activar el botón
    if (this.isScrolledToBottom) {
    }
  }
}
