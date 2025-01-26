import React from 'react'
import Web3 from 'web3';
import styles from './CdpListItem.module.css'
import { utils } from '@defisaver/tokens';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';

interface Cdp {
  id: string;
  owner: string;
  collateral: string;
  ilk: string;
  debt: number;
}

interface CdpListItemProps {
  cdp: Cdp;
  web3: Web3;
  handleCdpClick: (id: string) => void;
}

const CdpListItem: React.FC<CdpListItemProps> = ({ cdp, web3, handleCdpClick }) => {
  return (
    <div key={cdp.id} className={styles.cdpItem} >
        <div className={styles.listData}>
            <div className={styles.cdpId}>
            <span>{cdp.id}</span>
            <span className={styles.listIcon} onClick={() => handleCdpClick(cdp.id)}>
                <FontAwesomeIcon icon={faCirclePlay} />
            </span>
            </div>
            <div className={styles.cdpContent}>
            <div className={styles.ownerData}>
                <label>Owner:</label>
                <div>{cdp.owner}</div>
            </div>
            <div className={styles.statsContainer}>
                <div className={`${styles.statsItem} ${styles.collateral}`}>
                <div className={styles.label}>Collateral:</div>{' '}
                <div className={styles.value}>
                    {web3 ? parseFloat(cdp.collateral).toFixed(2) : 'N/A'}{' '}
                    {utils.bytesToString(cdp.ilk)}
                </div>
                </div>
                <div className={`${styles.statsItem} ${styles.debt}`}>
                <div className={styles.label}>Debt:</div>
                <div className={styles.value}>
                    {cdp.debt.toFixed(2)} DAI
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default CdpListItem