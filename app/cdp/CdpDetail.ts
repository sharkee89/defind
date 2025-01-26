import { utils } from '@defisaver/tokens';

interface CollateralPrice {
    usd: number;
}

export default class CdpDetail {
    ilk: string;
    debt: number;
    collateral: number;
    owner: string;
    adjustedDebt: number;
    collateralizationRatio: number;
    liquidationRatio: number;
    maxCollateralWithoutLiquidation: number;
    maxDebtWithoutLiquidation: number;
  
    constructor(ilk: string, debt: number, collateral: string, owner: string, collateralPrice: CollateralPrice, adjustedDebt: number, liquidationRatio: number) {
        this.ilk = ilk;
        this.debt = debt;
        this.collateral = parseFloat(collateral);
        this.owner = owner;
        this.adjustedDebt = adjustedDebt;
        this.liquidationRatio = liquidationRatio;
        const collateralValueInUsd = this.collateral * collateralPrice.usd;
        this.collateralizationRatio = collateralValueInUsd / this.adjustedDebt;
        this.maxCollateralWithoutLiquidation = this.collateral - (this.adjustedDebt * this.liquidationRatio) / collateralPrice.usd;
        this.maxDebtWithoutLiquidation = collateralValueInUsd / this.liquidationRatio;
    }
}  