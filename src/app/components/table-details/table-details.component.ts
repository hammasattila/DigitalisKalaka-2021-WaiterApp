import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { eOrderItem, IOrderItem } from 'src/app/models/order';

import { Table } from 'src/app/models/table';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss']
})
export class TableDetailsComponent implements OnInit {

  table: Table = new Table();

  constructor(private _api: ApiService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this._route.params.subscribe(async params => {
      const tableId: number = params['id'] as number || 0;
      this.table = await this._api.getOneTablesAndOrders(tableId);
    });
  }

  getSortedOrders(): IOrderItem[] {
    if (!this.table) {
      return [];
    }

    return this.table.elements.sort((a, b) => {
      return eOrderItem[b.status].id - eOrderItem[a.status].id;
    });
  }

  getColor(status: string): string {
    return eOrderItem[status].color || '';
  }

  getActionString(status: string): string {
    return eOrderItem[status].action || ''
  }


  hasToAccept(): Boolean {
    const order = this.table.elements;
    if (!order) {
      return false;
    }

    return undefined != order.find((it: IOrderItem) => {
      return it.status === "ORDERED"
    })
  }

  hasToDeliver(): Boolean {
    const order = this.table.elements;
    if (!order) {
      return false;
    }

    return undefined != order.find((it: IOrderItem) => {
      return it.status === "PREPARING"
    })
  }

  hasToPay(): Boolean {
    const order = this.table.elements;
    if (!order) {
      return false;
    }

    return undefined != order.find((it: IOrderItem) => {
      return it.status === "DELIVERED"
    })
  }

  async handleClick(action: string) {
    console.debug(action)
    switch (action) {
      case 'ORDERED':
        const toAccepts = this.table.elements.filter(e => e.status == 'ORDERED').map(e => { return  { tableId: this.table.tableId, productId: e.productId }})
        await this._api.acceptOrder(...toAccepts);
        this.table.elements.filter(e => e.status == 'ORDERED').forEach(e => e.status = 'PREPARING')
        break;
      case 'PREPARING':
        const toDelivers = this.table.elements.filter(e => e.status == 'PREPARING').map(e => { return  { tableId: this.table.tableId, productId: e.productId }})
        await this._api.deliverOrder(...toDelivers);
        this.table.elements.filter(e => e.status == 'PREPARING').forEach(e => e.status = 'DELIVERED')
        break;
      case 'DELIVERED':
        const toPays = this.table.elements.filter(e => e.status == 'DELIVERED').map(e => { return  { tableId: this.table.tableId, productId: e.productId }})
        await this._api.payOrder(...toPays);
        this.table.elements.filter(e => e.status == 'DELIVERED').forEach(e => e.status = 'PAID')
        break;
    }
  }

  async freeTable() {
    await this._api.freeTable(this.table.tableId);
    this.table.elements = [];
    this.table.status = 'FREE';
  }

  calculatePayment(): number {
    const sum = this.table.elements.filter(e => e.status == 'DELIVERED' || e.status == 'PREPARING').reduce((a: number, e) => a += e.price, 0);
    return sum;
  }

  back() {
    this._router.navigate(['tables']);
  }
}
