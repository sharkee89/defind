import { CdpDtoPlainObject } from "@/app/types/app.type";

export default class CdpDto {
    id: number;
    owner: string;
    collateral: number;
    debt: number;
    ilk: string;
    ilkLabel: string;
    urn: string;
    userAddr: string;

    constructor(
      { id, owner, collateral, debt, ilk, ilkLabel, urn, userAddr }:
      { id: number, owner: string, collateral: number, debt: number, ilk: string, ilkLabel: string, urn: string, userAddr: string }) {
      this.id = id;
      this.owner = owner;
      this.collateral = collateral;
      this.debt = debt;
      this.ilk = ilk;
      this.ilkLabel = ilkLabel;
      this.urn = urn;
      this.userAddr = userAddr;
    }

    toPlainObject(): CdpDtoPlainObject {
      return {
        id: this.id,
        owner: this.owner,
        collateral: this.collateral,
        debt: this.debt,
        ilk: this.ilk,
        ilkLabel: this.ilkLabel,
        urn: this.urn,
        userAddr: this.userAddr
      };
    }
}
