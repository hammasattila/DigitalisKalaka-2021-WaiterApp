import { Component, OnInit } from '@angular/core';
import { IOrderItem } from 'src/app/models/order';
import { Table } from 'src/app/models/table';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

  public tables: Table[] = [];

  constructor(private _api: ApiService) { }

  async ngOnInit(): Promise<void> {
    this.tables = await this._api.getAllTablesAndOrders();
    
  }

}
