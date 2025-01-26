export default class CdpListData {
    id: string;
    owner: string;
    collateral: string;
    debt: number;
    ilk: string;

    constructor(id: string, owner: string, collateral: string, debt: number, ilk: string) {
        this.id = id;
        this.owner = owner;
        this.collateral = collateral;
        this.debt = parseFloat(debt.toFixed(2));
        this.ilk = ilk;
    }
}  