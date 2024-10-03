import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard } from './guard/auth.guard';
import { AutorizacionDatosComponent } from './components/autorizacion-datos/autorizacion-datos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'acceso-denegado', component: NotfoundComponent },

  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'tratamiento-datos', component: AutorizacionDatosComponent },

  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'acceso-denegado' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
