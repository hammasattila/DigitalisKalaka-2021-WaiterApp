import { IOrderItem } from "./order";

export class Table {
    public tableId: number;
    public waiterId: number;
    public elements: IOrderItem[];
    public status: 'FREE' | 'OCCUPIED';
    public time: number;

    public requestPay?: boolean;
    public requestWaiter?: boolean

    constructor() {
        this.tableId = 0;
        this.waiterId = 0;
        this.status = "FREE";
        this.elements = [];
        this.time = 0;
    }
}