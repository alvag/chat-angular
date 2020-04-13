import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable( {
    providedIn: 'root'
} )
export class ChatService {

    private url = `${environment.apiUrl}/v1/message`;

    constructor( private http: HttpClient ) { }


    fetchMessages( userId: string ) {
        return new Promise( ( resolve, reject ) => {
            this.http.get( `${this.url}/${userId}` )
            .subscribe( ( res: any ) => {
                res.messages.map( ( m, i, self ) => self[ i ] = new Message( m ) );
                resolve( res );
            }, error => reject( error ) );
        } );
    }

    sendMessage( data: any ) {
        return this.http.post( this.url, data );
    }
}
