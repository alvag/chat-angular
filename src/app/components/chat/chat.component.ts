import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { Events } from '../../constants/constants';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component( {
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
} )
export class ChatComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];
    users: User[] = [];
    user: User;
    selectedUser: User;

    msg_per_page = 10;

    constructor( private wsService: WebsocketService,
                 private route: ActivatedRoute,
                 private router: Router,
                 public chatService: ChatService,
                 public userService: UserService ) {
        this.listenSockets();
    }

    ngOnInit() {
        this.userService.fetchUsers().then( ( users ) => {
            this.users = users;

            if ( this.route.snapshot.queryParamMap.get( 'user' ) ) {
                this.selectedUser = this.users.find( u => u._id === this.route.snapshot.queryParamMap.get( 'user' ) );
                if ( !this.selectedUser ) {
                    this.router.navigateByUrl( '/' ).finally();
                } else {
                    this.checkMessages();
                }
            }
        } );


        this.subscriptions.push( this.userService.getUsers().subscribe( users => this.users = users ) );

        this.subscriptions.push( this.userService.getUser().subscribe( user => this.user = user ) );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach( s => s.unsubscribe() );
    }

    listenSockets() {
        this.subscriptions.push( this.wsService.listen( Events.USER_UPDATED )
        .subscribe( ( user: User ) => this.userService.addUser( user ) ) );

        this.subscriptions.push( this.wsService.listen( Events.SEND_MESSAGE )
        .subscribe( ( message: Message ) => {
            console.log( message );
            this.userService.updateMessages( message );
        } ) );
    }

    trackByFn( index: number, user: User ) {
        return user._id;
    }

    checkMessages() {
        if ( this.selectedUser.messages.length < this.msg_per_page ) {
            this.getMessages();
        }
    }

    getMessages() {
        this.chatService.fetchMessages( this.selectedUser._id ).then( ( res: any ) => {
            this.userService.updateMessages( res.messages );
        } ).catch( e => console.log( e ) );
    }

    onSelectUser( user: User ) {
        if ( !this.selectedUser || this.selectedUser._id !== user._id ) {
            this.selectedUser = user;
            this.checkMessages();
        }

    }

}
