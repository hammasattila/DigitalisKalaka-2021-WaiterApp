import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrderItem } from 'src/app/models/order';
import { Table } from 'src/app/models/table';

@Component({
  selector: 'app-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.scss']
})
export class TableItemComponent implements OnInit {

  @Input('table')
  public table: Table = new Table();

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  openTable() {
    this.router.navigate(['tables', this.table.tableId]);
  }

  hasUnacceptedOrder(order?: IOrderItem[]): Boolean {
    if (!order) {
      return false;
    }

    return undefined != order.find((it: IOrderItem) => {
      return it.status === "ORDERED"
    })
  }


  hasUndeliveredOrder(order?: IOrderItem[]): Boolean {
    if (!order) {
      return false;
    }

    return undefined != order.find((it: IOrderItem) => {
      return it.status === "PREPARING"
    })
  }

  hasUnpayedOrder(order?: IOrderItem[]): Boolean {
    if (!order) {
      return false;
    }

    return undefined != order.find((it: IOrderItem) => {
      return it.status === "DELIVERED"
    })
  }

  hasEvent() {
    return this.hasUnacceptedOrder(this.table.elements) || this.hasUndeliveredOrder(this.table.elements) || this.hasUnpayedOrder(this.table.elements);
  }

}
