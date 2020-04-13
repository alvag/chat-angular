import { AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { User } from '../../models/user.model';
import { Message } from '../../models/message.model';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';

@Component( {
    selector: 'app-chat-content',
    templateUrl: './chat-content.component.html',
    styleUrls: ['./chat-content.component.scss']
} )
export class ChatContentComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() selectedUser: User;
    subscriptions: Subscription[] = [];
    user: User;
    message: string;

    @ViewChildren( 'messages' ) messagesEl: QueryList<any>;

    constructor( public userService: UserService,
                 private chatService: ChatService ) { }

    ngOnInit() {
        this.subscriptions.push( this.userService.getUser().subscribe( user => this.user = user ) );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach( s => s.unsubscribe() );
    }

    ngAfterViewInit() {
        this.messagesEl.changes.subscribe( t => {
            this.scroll();
        } );
    }

    trackByFn( index: number, m: Message ) {
        return m._id;
    }

    scroll() {
        const chatContent = document.getElementById( 'chat-content' );
        if ( chatContent ) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    }

    sendMessage() {
        this.chatService.sendMessage( { message: this.message, to: this.selectedUser._id } )
        .subscribe( res => {
            this.message = null;
        }, error => console.log( error ) );
    }
}
