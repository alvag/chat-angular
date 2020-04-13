import { UserInterface } from '../interfaces/user.interface';

export class Message {
    _id: any;
    from: UserInterface;
    to: UserInterface;
    message: string;
    createdAt: Date;
    deletedAt: Date;

    constructor( obj: any ) {
        Object.keys( obj || {} ).forEach( k => {
            /*if ( k === 'from' || k === 'to' ) {
             this[ k ] = new User( obj[ k ] );
             } else {
             }*/
            this[ k ] = obj[ k ];
        } );
    }

}
