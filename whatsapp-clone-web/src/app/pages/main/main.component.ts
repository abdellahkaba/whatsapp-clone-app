import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/services/chat.service";
import {ChatResponse} from "../../services/models/chat-response";
import {ChatListComponent} from "../../components/chat-list/chat-list.component";
import {KeycloakService} from "../../utils/keycloak/keycloak.service";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    ChatListComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  chats: Array<ChatResponse> = []
  constructor(
    private chatService: ChatService,
    private keycloakService: KeycloakService
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

  logout() {
    this.keycloakService.logout();
  }

  userProfile() {
    this.keycloakService.accountManagement();
  }

}
