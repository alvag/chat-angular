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
    lastMessage: Message;
    active: boolean;

    constructor( obj: any ) {
        Object.keys( obj || {} ).forEach( k => {
            if ( k === 'avatar' ) {
                this[ k ] = `${environment.apiUrl}/v1/avatar/${obj[ k ]}`;
            } else {
                this[ k ] = obj[ k ];
            }
        } );
    }
}
