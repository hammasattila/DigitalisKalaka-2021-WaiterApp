import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { eOrderItem, IOrderItem } from 'src/app/models/order';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit {


  @Input('tableId')
  tableId: number = 0;

  @Input('item')
  orderItem: IOrderItem | null = null;

  constructor(private _api: ApiService) { }

  ngOnInit(): void {
  }

  hasButton(): Boolean {
    if (!this.orderItem) {
      return false;
    }

    return eOrderItem[this.orderItem.status].color != null && eOrderItem[this.orderItem.status].action != null
  }

  getColor() {
    return eOrderItem[this.orderItem!.status].color;
  }

  getActionString() {
    return eOrderItem[this.orderItem!.status].action || ''
  }

  async handleClick(action: string) {
    console.debug(action)
    switch (action) {
      case 'ORDERED':
        await this._api.acceptOrder({ tableId: this.tableId, productId: this.orderItem!.productId })
        this.orderItem!.status = 'PREPARING'
        break;
      case 'PREPARING':
        await this._api.deliverOrder({ tableId: this.tableId, productId: this.orderItem!.productId })
        this.orderItem!.status = 'DELIVERED'
        break;
      case 'DELIVERED':
        await this._api.payOrder({ tableId: this.tableId, productId: this.orderItem!.productId })
        this.orderItem!.status = 'PAID'
        break;
    }
  }
}
