import {Component, input, InputSignal, OnInit, output} from '@angular/core';
import {ChatResponse} from "../../services/models/chat-response";
import {UserResponse} from "../../services/models/user-response";
import {ChatService} from "../../services/services/chat.service";
import {UserService} from "../../services/services/user.service";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  standalone: true,
  imports: [
    DatePipe
  ],

  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent{
  chats: InputSignal<ChatResponse[]> = input<ChatResponse[]>([]);
  searchNewContact = false;
  contacts: UserResponse[] = [];
  chatSelected = output<ChatResponse>();

  constructor(
    private  chatService: ChatService,
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {
  }

  searchContact() {
    this.searchNewContact = true;
    this.userService.getAllUsers()
      .subscribe({
        next: (users) => {
          console.log('Contacts received:', users);
          this.contacts = Array.isArray(users) ? users : [];
          this.searchNewContact = true;
        },
        error: (err) => {
          console.error('Error:', err);
          this.contacts = [];
          this.searchNewContact = false;
        }
      });
  }
  selectContact(contact: UserResponse) {
    this.chatService.createChat({
      'sender-id': this.keycloakService.userId as string,
      'receiver-id': contact.id as string
    }).subscribe({
      next: (res) => {
        const chat: ChatResponse = {
          id: res.response,
          name: contact.firstName + ' ' + contact.lastName,
          recipientOnline: contact.online,
          lastMessageTime: contact.lastSeen,
          senderId: this.keycloakService.userId,
          receiverId: contact.id
        };
        this.chats().unshift(chat);
        this.searchNewContact = false;
        this.chatSelected.emit(chat);
      },
      error: (err) => {
        console.error('Erreur lors de la création du chat :', err);
      }
    });
  }
  chatClicked(chat: ChatResponse) {
    this.chatSelected.emit(chat);
  }
  wrapMessage(lastMessage: string | undefined): string {
    if (lastMessage && lastMessage.length <= 20) {
      return lastMessage;
    }
    return lastMessage?.substring(0, 17) + '...';
  }
}
