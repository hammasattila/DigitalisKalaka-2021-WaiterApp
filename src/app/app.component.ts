import { Component, OnInit } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor (private readonly notificationService: NotificationService) {
    notificationService.subscribeToNotifications();
  }

  async ngOnInit(): Promise<void> {
    let permission = await Notification.requestPermission();
    if (permission != 'granted') {
      console.error('Don\'t have permission for notifications...');
    }
  }
}
