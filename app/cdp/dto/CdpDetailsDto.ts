import { COLLATERAL_TYPES } from '../../constant/contract';
import { DEFAULT_ILK_LABEL } from '../../constant/general_app';
import CdpDto from './CdpDto';

export default class CdpDetailsDto {
    id: number;
    owner: string;
    collateral: number;
    debt: number;
    ilk: string;
    ilkLabel: string;
    urn: string;
    userAddr: string;
    collateralizationRatio: number;
    liquidationRatio: number;
    maxCollateralWithoutLiquidation: number;
    maxDebtWithoutLiquidation: number;

    constructor(
        { id, owner, collateral, debt, ilk, ilkLabel, urn, userAddr}: CdpDto, collateralPrices: any) {
        this.id = id;
        this.owner = owner;
        this.collateral = collateral;
        this.debt = debt;
        this.ilk = ilk;
        this.ilkLabel = ilkLabel;
        this.urn = urn;
        this.userAddr = userAddr;
        const collateralType = COLLATERAL_TYPES.find(type => type.value === ilkLabel);
        const liquidationRatioDisplay = collateralType ? collateralType.liquidationRatio : 0;
        const liquidationRatio = liquidationRatioDisplay / 100;
        const collateralPrice = collateralPrices[collateralType ? collateralType.priceLabel : DEFAULT_ILK_LABEL];
        const collateralValueInUsd = collateral * collateralPrice.usd;
        this.collateralizationRatio = collateralValueInUsd / debt;
        this.liquidationRatio = liquidationRatio;
        this.maxCollateralWithoutLiquidation = collateral - ((debt * liquidationRatio) / collateralPrice.usd),
        this.maxDebtWithoutLiquidation = collateralValueInUsd / liquidationRatio;        
    }
}
    