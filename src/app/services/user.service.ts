import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable( {
    providedIn: 'root'
} )
export class UserService {

    private _user = new Subject<User>();
    private _usersSubject = new Subject<User[]>();
    private _users: User[] = [];

    private url = `${environment.apiUrl}/v1/user`;

    constructor( private http: HttpClient ) { }

    getUser() {
        return this._user.asObservable();
    }

    setUser( user: User ) {
        this._user.next( user );
        if ( user ) {
            localStorage.setItem( 'user', JSON.stringify( user ) );
        } else {
            localStorage.removeItem( 'user' );
        }
    }

    register( params: any ) {
        return this.http.post( this.url, params );
    }

    login( params: any ) {
        const url = `${environment.apiUrl}/v1/login`;
        return this.http.post( url, params );
    }

    getUsers() {
        this.fetchUsers();
        return this._usersSubject.asObservable();
    }

    addUser( user: User ) {
        let i = this._users.findIndex( u => u._id === user._id );
        console.log( i );
        if ( i >= 0 ) {
            this._users[ i ] = new User( user );
        } else {
            this._users.push( user );
        }
        this._usersSubject.next( this._users );

    }

    private fetchUsers() {
        this.http.get( this.url )
        .subscribe( ( res: any ) => {
            res.users.map( ( u, i, self ) => self[ i ] = new User( u ) );
            this._users = res.users;
            this._usersSubject.next( this._users );
        } );
    }

}
