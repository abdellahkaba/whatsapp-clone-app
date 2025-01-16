import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/services/chat.service";
import {ChatResponse} from "../../services/models/chat-response";
import {ChatListComponent} from "../../components/chat-list/chat-list.component";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";
import {MessageService} from "../../services/services/message.service";
import {MessageResponse} from "../../services/models/message-response";
import {EmojiData} from "@ctrl/ngx-emoji-mart/ngx-emoji";
import {MessageRequest} from "../../services/models/message-request";
import {DatePipe} from "@angular/common";
import {PickerComponent} from "@ctrl/ngx-emoji-mart";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    ChatListComponent,
    DatePipe,
    PickerComponent,
    FormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  selectedChat: ChatResponse = {};
  chats: Array<ChatResponse> = [];
  chatMessages: Array<MessageResponse> = [];
  messageContent: string = '';
  showEmojis = false;
  constructor(
    private chatService: ChatService,
    private keycloakService: KeycloakService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.getAllChats();
  }

  private getAllChats(){
    this.chatService.getChatsByReceiver()
      .subscribe({
        next: (res => {
          this.chats = res
        })
      })
  }

  chatSelected(chatResponse: ChatResponse) {
    this.selectedChat = chatResponse;
    this.getAllChatMessages(chatResponse.id as string);
    this.setMessagesToSeen();
    this.selectedChat.unreadCount = 0;
  }

  keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  private getAllChatMessages(chatId: string) {
    this.messageService.getAllMessages({
      'chat-id': chatId
    }).subscribe({
      next: (messages) => {
        this.chatMessages = messages;
      }
    });
  }

  private setMessagesToSeen() {
    this.messageService.setMessageToSeen({
      'chat-id': this.selectedChat.id as string
    }).subscribe({
      next: () => {
      }
    });
  }

  logout() {
    this.keycloakService.logout();
  }

  userProfile() {
    this.keycloakService.accountManagement();
  }
  onSelectEmojis(emojiSelected: any) {
    const emoji: EmojiData = emojiSelected.emoji;
    this.messageContent += emoji.native;
  }

  isSelfMessage(message: MessageResponse): boolean {
    return message.senderId === this.keycloakService.userId;
  }

  sendMessage() {
    if (this.messageContent) {
      const messageRequest: MessageRequest = {
        chatId: this.selectedChat.id,
        senderId: this.getSenderId(),
        receiverId: this.getReceiverId(),
        content: this.messageContent,
        type: 'TEXT',
      };
      this.messageService.saveMessage({
        body: messageRequest
      }).subscribe({
        next: () => {
          const message: MessageResponse = {
            senderId: this.getSenderId(),
            receiverId: this.getReceiverId(),
            content: this.messageContent,
            type: 'TEXT',
            state: 'SENT',
            createdAt: new Date().toString()
          };
          this.selectedChat.lastMessage = this.messageContent;
          this.chatMessages.push(message);
          this.messageContent = '';
          this.showEmojis = false;
        }
      });
    }
  }

  private getSenderId(): string {
    if (this.selectedChat.senderId === this.keycloakService.userId) {
      return this.selectedChat.senderId as string;
    }
    return this.selectedChat.receiverId as string;
  }

  private getReceiverId(): string {
    if (this.selectedChat.senderId === this.keycloakService.userId) {
      return this.selectedChat.receiverId as string;
    }
    return this.selectedChat.senderId as string;
  }
}
