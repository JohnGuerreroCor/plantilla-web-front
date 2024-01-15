import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import Swal from 'sweetalert2';
import { Correo } from 'src/app/models/correo';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  correo!: Correo;
  codigo!: String;
  codioCorrecto!: String;
  today = new Date();
  cargando: boolean = false;
  @Output() rolEvent = new EventEmitter<any>();
  formToken!: FormGroup;

  constructor(
    public auth: AuthService,
    private router: Router,
    public tokenService: TokenService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.crearFormularioToken();
    this.tokenService
      .gettokenUsco()
      .subscribe((correo) => (this.correo = correo));
  }

  // Método para crear el formulario de token
  private crearFormularioToken(): void {
    this.formToken = this.formBuilder.group({
      token: new FormControl('', Validators.required),
    });
  }

  // Método para validar el token ingresado
  validarToken() {
    this.cargando = true;
    if (this.formToken.get('token')!.value) {
      this.tokenService
        .validartokenUsco(this.formToken.get('token')!.value)
        .subscribe(
          (response) => {
            this.auth.guardarCodigoverificacion('true');
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión ',
              text: 'Código de verificación correcto.',
              confirmButtonText: 'Listo',
              confirmButtonColor: '#8f141b',
            });
            this.router.navigate(['/inicio']);
          },
          (err) => this.fError(err)
        );
    }
  }

  // Método para manejar errores durante la validación del token
  fError(er: any): void {
    this.cargando = false;
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }
  }
}
