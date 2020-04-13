import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { WebsocketService } from '../../services/websocket.service';
import { Events } from '../../constants/constants';

@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
} )
export class LoginComponent implements OnInit {

    form: FormGroup;
    isLoading: boolean;
    error: string;

    constructor( private fb: FormBuilder,
                 private router: Router,
                 private wsService: WebsocketService,
                 private userService: UserService ) {
        const user = new User( JSON.parse( localStorage.getItem( 'user' ) ) );
        this.userService.setUser( user );
    }

    ngOnInit() {

        localStorage.removeItem( 'token' );
        this.userService.setUser( null );

        this.initForm();
    }

    initForm() {
        this.form = this.fb.group( {
            password: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
        } );
    }

    login() {
        if ( this.form.valid ) {
            this.error = null;
            this.isLoading = true;

            this.userService.login( this.form.value )
            .pipe( finalize( () => this.isLoading = false ) )
            .subscribe( ( res: any ) => {
                console.log( res );
                localStorage.setItem( 'token', res.token );
                this.userService.setUser( new User( res.user ) );
                this.router.navigateByUrl( '/' ).then( () => {
                    this.wsService.emit( Events.USER_UPDATED, res.user );

                } );
            }, error => {
                console.log( error );
                this.error = error;
            } );
        }
    }

}
