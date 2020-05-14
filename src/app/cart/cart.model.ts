interface ICart {
    id?: number;

    description?: string;
    price?: string;
    quantity?: string;
    editing?: boolean;

}
export class Cart {

    public id?: number;
    public description?: string;
    public price?: string;
    public quantity?: string;
    public editing?: boolean;

    constructor(cart: ICart) {
        cart.editing = this.setState(cart);
        Object.assign(this, cart);
    }

    setState(cart: ICart) {

        if (cart == null || Object.keys(cart).length === 0) {
            return true;
        }
        let editing = false;
        Object.keys(cart).forEach((key) => {
            console.log('from setState...', cart[key]);
            if (cart[key] == null) {
                editing = true;
            }
        });
        return editing;
    }

}
