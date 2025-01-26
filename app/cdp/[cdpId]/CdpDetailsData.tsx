import React from 'react'
import styles from './CdpDetailsData.module.css';
import { utils } from '@defisaver/tokens';

interface CdpDetailsDataProps {
  cdpId: string;
  cdpData: {
    owner: string;
    collateral: number;
    maxCollateralWithoutLiquidation: number;
    debt: number;
    maxDebtWithoutLiquidation: number;
    collateralizationRatio: number;
    liquidationRatio: number;
    ilk: string;
  };
}

const CdpDetailsData: React.FC<CdpDetailsDataProps> = ({ cdpId, cdpData }) => {
  return (
    <div>
        <div className='title'>
          <h1>CDP Details: {cdpId}</h1>
        </div>
        <div>
          <div className={`${styles.ownerData} ${styles.data}`}>
            <div>{cdpData.owner}</div>
          </div>
          <div className={styles.listData}>
            <div className={styles.data}>
              <span>Collateral:</span>
              <div>{cdpData.collateral.toFixed(2)}{' '}{utils.bytesToString(cdpData.ilk)}</div>
            </div>
            <div className={styles.data}>
              <span>Max collateral withdrawal without liquidation:</span>
              <div>{cdpData.maxCollateralWithoutLiquidation.toFixed(2)} {utils.bytesToString(cdpData.ilk)}</div>
            </div>
            <div className={styles.data}>
              <span>Debt:</span>
              <div>{cdpData.debt.toFixed(2)} DAI</div>
            </div>
            <div className={styles.data}>
              <span>Max debt taken without liquidation:</span>
              <div>{cdpData.maxDebtWithoutLiquidation.toFixed(2)} DAI</div>
            </div>
            <div className={styles.data}>
              <span>Collateralization ratio:</span>
              <div>{(cdpData.collateralizationRatio * 100).toFixed(2)}%</div>
            </div>
            <div className={styles.data}>
              <span>Liquidation ratio:</span>
              <div>{cdpData.liquidationRatio * 100}%</div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default CdpDetailsData