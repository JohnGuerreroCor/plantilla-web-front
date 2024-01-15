import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FotoService } from 'src/app/services/foto.service';
import { Foto } from 'src/app/models/foto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar', // Selector del componente
  templateUrl: './navbar.component.html', // Plantilla HTML asociada al componente
  styleUrls: ['./navbar.component.css'], // Estilos asociados al componente
})
export class NavbarComponent {
  // Propiedades públicas que almacenan información del usuario obtenida del servicio de autenticación
  public personaCodigo: any = this.auth.user.personaCodigo;
  public nombre: any = this.auth.user.personaNombre;
  public apellido: any = this.auth.user.personaApellido;

  // URL de la API backend obtenida del entorno
  url: string = environment.URL_BACKEND;

  // Estado del panel (puede ser utilizado para determinar si está abierto o cerrado)
  panelOpenState = false;

  // Objeto que representa la información de la foto del usuario
  foto: Foto = {
    url: '',
  };

  // Constructor del componente
  constructor(
    public auth: AuthService, // Servicio de autenticación
    private router: Router, // Servicio de enrutamiento
    public fotoService: FotoService // Servicio para manejar las fotos del usuario
  ) {
    // Llamada al servicio para obtener la foto del usuario
    this.fotoService.mirarFoto('' + this.personaCodigo).subscribe((data) => {
      var blobFoto = new Blob([data], { type: 'application/json' });

      // Verifica si la foto del usuario está disponible
      if (blobFoto.size !== 4) {
        // Si la foto está disponible, la convierte en un objeto Blob y la muestra
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        };
        reader.readAsDataURL(foto);
      } else {
        // Si la foto no está disponible, se solicita la foto antigua del usuario
        this.fotoService
          .mirarFotoAntigua('' + this.personaCodigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }

  // Método para cerrar la sesión del usuario
  logout(): void {
    this.auth.logout(); // Llamada al método de cierre de sesión del servicio de autenticación

    // Muestra una notificación Toast utilizando la librería SweetAlert
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Sesión cerrada correctamente.',
    });

    // Redirección a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}
