
export class OrderItemExtension {
    public id;
    public action;
    public color;

    constructor(id: number, action: string | null, color: string | null) {
        this.id = id;
        this.action = action;
        this.color = color;
    }
}

export const eOrderItem: Record<string, OrderItemExtension> = {
    'ORDERED': new OrderItemExtension(0, 'Elfogad', 'primary'),
    'PREPARING': new OrderItemExtension(2, 'Kiszállít', 'accent'),
    'DELIVERED': new OrderItemExtension(3, 'Fizetés', 'warn'),
    'PAID': new OrderItemExtension(4, null, null)
}

export interface IOrderItem {
    productId: number;
    name: string;
    url: string;
    description: string;
    gramage: number;
    price: number;
    qty: 3;
    status: 'ORDERED' | 'PREPARING' | 'DELIVERED' | 'PAID';
}
