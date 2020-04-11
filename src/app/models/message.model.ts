import { User } from './user.model';

export class Message {
    _id: any;
    from: User;
    to: User;
    message: string;
    createdAt: Date;
    deletedAt: Date;

    constructor( obj: any ) {
        Object.keys( obj || {} ).forEach( k => {
            if ( k === 'from' || k === 'to' ) {
                this[ k ] = new User( obj[ k ] );
            }
        } );
    }
}
