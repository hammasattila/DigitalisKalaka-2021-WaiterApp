import { Injectable } from '@angular/core';
import { IOrderItem } from '../models/order';
import { Table } from '../models/table';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _tables: Table[] = [];

  constructor() { }

  async getAllTablesAndOrders(): Promise<Table[]> {
    const tablesAndOrdersJSON = await fetch('http://192.168.1.248:8081/qrapp/orders/getOrders');
    const tablesAndOrders = await tablesAndOrdersJSON.json();
    console.debug(tablesAndOrders);
    this.tables = tablesAndOrders;
    return tablesAndOrders as Table[];
  }

  async getOneTablesAndOrders(tableId: number): Promise<Table> {
    const tableAndOrdersJSON = await fetch(`http://192.168.1.248:8081/qrapp/orders/getOrder?tableId=${tableId}`);
    const tableAndOrders = await tableAndOrdersJSON.json();
    console.debug(tableAndOrders);
    this.table = tableAndOrders;
    return tableAndOrders as Table;
  }


  public get tables(): Table[] {
    return [...this._tables];
  }

  public set tables(tables: Table[]) {
    this._tables = tables;
  }

  public getTableById(tableId: number): Table {
    let table = this._tables.find((t: Table) => t.tableId == tableId);
    if (!table) {
      table = new Table();
    }

    return table as Table;
  }

  public set table(table: Table) {
    const index = this._tables.findIndex((t: Table) => t.tableId === table.tableId);
    if (-1 === index) {
      this._tables.push(table);
    } else {
      this._tables[index] = table;
    }
  }

  public addOrders(tableId: number, order: IOrderItem[]) {
    const index = this._tables.findIndex((t: Table) => t.tableId === tableId);
    if (-1 === index) {
      this._tables.push(new Table());
      this._tables[index].tableId = tableId;
      this._tables[index].elements = order;
      this._tables[index].status = "OCCUPIED"
    } else {
      this._tables[index].elements.push(...order);
      this._tables[index].status = "OCCUPIED"
    }
  }




  public async acceptOrder(...orderSelections: { tableId: number, productId: number }[]) {
    for (const orderSelection of orderSelections) {
      await fetch('http://192.168.1.248:8081/qrapp/orders/setOrderedProductToPreparing', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderSelection)
      })
    }
  }

  public async deliverOrder(...orderSelections: { tableId: number, productId: number }[]) {
    for (const orderSelection of orderSelections) {
      await fetch('http://192.168.1.248:8081/qrapp/orders/setOrderedProductToDelivered', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderSelection)
      })
    }
  }

  public async payOrder(...orderSelections: { tableId: number, productId: number }[]) {
    for (const orderSelection of orderSelections) {
      await fetch('http://192.168.1.248:8081/qrapp/orders/setOrderedProductToPaid', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderSelection)
      })
    }
  }

  public async freeTable(tableId: number) {
    await fetch(`http://192.168.1.248:8081/qrapp/orders/setTableToFree/${tableId}`)
  }


}
