import { Message } from '../models/message.model';

export interface UserInterface {
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
    messages: Message[];
    active: boolean;
    lastConnection: Date;
}
