import { environment } from '../../environments/environment';
import { Message } from './message.model';

export class User {
    _id: any;
    name: string;
    email: string;
    phone: string;
    bio: string;
    facebook: string;
    twitter: string;
    password: string;
    avatar: string;
    createdAt: Date;
    messages: Message[] = [];
    lastMessage: Message;
    active: boolean;
    lastConnection: Date;

    constructor( obj: any ) {
        Object.keys( obj || {} ).forEach( k => {
            if ( k === 'messages' ) {
                this.updateMessages( obj[ k ] );
            } else {
                this[ k ] = obj[ k ];
            }
        } );

        this._lastMessage();
    }

    update( obj: any ) {
        Object.keys( obj || {} ).forEach( k => {
            if ( k === 'messages' ) {
                this.updateMessages( obj[ k ] );
            } else {
                this[ k ] = obj[ k ];
            }
        } );

        this._lastMessage();
    }

    updateMessages( messages: Message | Message[] ) {
        if ( messages instanceof Array ) {
            messages.forEach( m => {
                if ( !this.messages.find( x => x._id === m._id ) ) {
                    this.messages.push( new Message( m ) );
                }
            } );
        } else if ( messages._id ) {
            this.messages.push( new Message( messages ) );
        }


        this.messages.sort( ( a, b ) => {
            const dateA = new Date( a.createdAt ).getTime();
            const dateB = new Date( b.createdAt ).getTime();

            if ( dateA < dateB ) {
                return 1;
            } else if ( dateA > dateB ) {
                return -1;
            } else {
                return 0;
            }
        } );

        this._lastMessage();

    }

    private _lastMessage() {
        this.lastMessage = this.messages.length ? this.messages[ 0 ] : null;
    }
}
