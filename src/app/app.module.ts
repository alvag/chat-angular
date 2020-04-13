import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './components/chat/chat.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { UserService } from './services/user.service';
import { WebsocketService } from './services/websocket.service';
import { AuthGuard } from './guards/auth.guard';
import { ChatService } from './services/chat.service';
import { ReversePipe } from './pipes/reverse.pipe';
import { ChatContentComponent } from './components/chat-content/chat-content.component';

const token = localStorage.getItem( 'token' );
const config: SocketIoConfig = { url: environment.wsUrl, options: { query: { token } } };

@NgModule( {
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ChatComponent,
        ReversePipe,
        ChatContentComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SocketIoModule.forRoot( config ),
    ],
    providers: [
        UserService,
        WebsocketService,
        ChatService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true
        }
    ],
    bootstrap: [AppComponent]
} )
export class AppModule {}
