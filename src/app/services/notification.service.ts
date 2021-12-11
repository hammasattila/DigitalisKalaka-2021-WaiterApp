import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { ApiService } from './api.service';



@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  socket: any = undefined

  constructor(private _api: ApiService) {
    try {
      this.socket = io("192.168.1.193:8881");
    } catch (error) {
      console.error('Failed to connect to notification server.', error);
    }
  }

  subscribeToNotifications() {
    this.socket.on("registerWaiter", (data: any) => {
      console.log(data)
    })

    this.socket.on("notifications", (data: any) => {
      console.log(data)
      switch (data.type) {
        case 'PAY':
          const pay = new Notification('Payment request', {
            body: `A payment request has arrived from table ${data.tableId}.`,
            icon: 'https://maxcdn.icons8.com/Share/icon/Finance/usd1600.png'
          });
          break;
        case 'NEED_WAITER':
          const waiter = new Notification('Waiter request', {
            body: `A waiter is request at table ${data.tableId}.`,
            icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png'
          });
          break;
        case 'ORDER':
          const order = new Notification('New Order', {
            body: `A new order for table ${data.tableId}.`,
            icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-question-icon.png',
          });
          this._api.addOrders(data.tableId, data.order);
          break;
        default:
          const wtf = new Notification('What the fuck just arrived!', {
            body: `Shit knows what notification just arrived.`,
            icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png'
          });
          break;
      }
    })

    this.socket.emit("registerWaiter", true);
  }


}
