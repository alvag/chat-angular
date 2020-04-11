import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Events } from '../../constants/constants';

@Component( {
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
} )
export class ChatComponent implements OnInit {

    users$: Observable<User[]>;

    constructor( private wsService: WebsocketService,
                 private userService: UserService ) {
        this.listenSockets();
    }

    ngOnInit() {
        this.users$ = this.userService.getUsers();
        this.userService.getUsers().subscribe( users => console.log( users ) );
    }

    listenSockets() {
        this.wsService.listen( Events.USER_UPDATED )
        .subscribe( ( user: User ) => {
            console.log( user );
            this.userService.addUser( user );
        } );
    }

    trackByFn( index: number, user: User ) {
        return user._id;
    }


}
