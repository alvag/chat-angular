import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component( {
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
} )
export class RegisterComponent implements OnInit {

    form: FormGroup;
    isLoading: boolean;
    error: string;

    constructor( private fb: FormBuilder,
                 private router: Router,
                 private userService: UserService ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group( {
            name: [null, Validators.required],
            password: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
        } );
    }

    register() {
        if ( this.form.valid ) {
            this.error = null;
            this.isLoading = true;

            this.userService.register( this.form.value )
            .pipe( finalize( () => this.isLoading = false ) )
            .subscribe( res => {
                console.log( res );

                Swal.fire( {
                    text: 'Tu cuenta ha sido creada, ya puedes iniciar sessión',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    allowEscapeKey: false,
                    allowOutsideClick: false
                } ).then( () => {
                    this.router.navigateByUrl( '/login' ).finally();
                } );

            }, error => {
                console.log( error );
                this.error = error;
            } );
        }
    }

}
