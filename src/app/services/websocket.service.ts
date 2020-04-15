import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable( {
    providedIn: 'root'
} )
export class WebsocketService {

    constructor( private socket: Socket ) {
        this.chekStatus();
    }

    private chekStatus() {
        this.socket.on( 'connect', () => {
            console.log( 'Conectado al servidor!!!' );
        } );

        this.socket.on( 'disconnect', () => {
            console.log( 'Desconectado del servidor' );
        } );
    }

    emit( event: string, payload?: any, callback?: ( res ) => void ) {
        this.socket.emit( event, payload, callback );
    }

    listen( event: string ) {
        return this.socket.fromEvent( event );
    }
}
