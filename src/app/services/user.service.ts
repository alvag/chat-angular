import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { WebsocketService } from './websocket.service';
import { Events } from '../constants/constants';
import { Router } from '@angular/router';

@Injectable( {
    providedIn: 'root'
} )
export class UserService {

    private _userSubject = new BehaviorSubject<User>( null );
    private _user: User;

    private _usersSubject = new BehaviorSubject<User[]>( [] );
    private _users: User[] = [];

    private url = `${environment.apiUrl}/v1/user`;

    constructor( private http: HttpClient,
                 private router: Router,
                 private wsService: WebsocketService ) { }

    getUser() {
        return this._userSubject.asObservable();
    }

    setUser( user: User ) {
        this._user = new User( user );
        this._userSubject.next( this._user );
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
        return this._usersSubject.asObservable();
    }

    addUser( user: User ) {
        const i = this._users.findIndex( u => u._id === user._id );
        if ( user._id === this._user._id ) {
            this.setUser( user );
        } else {
            if ( i >= 0 ) {
                this._users[ i ].update( user );
            } else {
                this._users.push( new User( user ) );
            }
            this._usersSubject.next( this._users );
        }
    }

    fetchUsers() {
        return new Promise<User[]>( ( resolve, reject ) => {
            this.http.get( this.url )
            .subscribe( ( res: any ) => {
                res.users.map( ( u, i, self ) => self[ i ] = new User( u ) );
                this._users = res.users;
                resolve( this.sortUsers() );
            }, error => reject() );
        } );

    }

    private sortUsers() {
        this._users.sort( ( a: User, b: User ) => {
            const dateA = a.messages.length ? new Date( a.messages[ 0 ].createdAt ).getTime() : new Date( 1900 ).getTime();
            const dateB = b.messages.length ? new Date( b.messages[ 0 ].createdAt ).getTime() : new Date( 1900 ).getTime();

            if ( dateA < dateB ) {
                return 1;
            } else if ( dateA > dateB ) {
                return -1;
            } else {
                return 0;
            }
        } );
        this._usersSubject.next( this._users );
        return this._users;
    }

    updateMessages( message: Message | Message[] ) {
        let i = -1;
        let arr = [];

        if ( message instanceof Array ) {
            if ( message.length ) {
                i = this._users.findIndex( u => u._id === message[ 0 ].from._id || u._id === message[ 0 ].to._id );
                arr = message;
            }
        } else {
            i = this._users.findIndex( u => u._id === message.to._id || u._id === message.from._id );
            arr = [new Message( message )];
        }
        if ( i >= 0 ) {
            this._users[ i ].updateMessages( arr );
        }

        this.sortUsers();

    }

    closeSession() {
        this.wsService.emit( Events.CLOSE_SESSION, this._user._id );
        this.router.navigateByUrl( '/login' ).finally();
    }


}
