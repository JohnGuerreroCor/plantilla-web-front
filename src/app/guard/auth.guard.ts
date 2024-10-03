import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TerminosCondicionesService } from '../services/terminos-condiciones.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  autorizacion!: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private terminosCondicionesService: TerminosCondicionesService
  ) {}

  async canActivate(): Promise<boolean> {
    if (
      this.authService.user.personaCodigo &&
      this.authService.Codigoverificacion
    ) {
      this.autorizacion = await this.terminosCondicionesService
        .verificarAutorizacion(this.authService.user.personaCodigo)
        .toPromise();

      if (this.autorizacion > 0) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
