import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable( {
    providedIn: 'root'
} )
export class AuthInterceptorService implements HttpInterceptor {

    constructor( private router: Router ) { }

    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
        let request = req;

        if ( localStorage.getItem( 'token' ) ) {
            request = req.clone( {
                setHeaders: {
                    Authorization: `Bearer ${localStorage.getItem( 'token' )}`
                }
            } );
        }

        return next.handle( request ).pipe(
            catchError( ( err: HttpErrorResponse ) => {
                console.log( 'InterceptorService:', err );
                const error = err.error.message || err.message || err;
                if ( err.status === 401 ) {
                    this.router.navigateByUrl( '/login' );
                    return throwError( error );
                }
                return throwError( error );
            } )
        );
    }
}
