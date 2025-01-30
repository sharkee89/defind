import React from 'react'
import styles from './CdpListItem.module.css'
import { utils } from '@defisaver/tokens';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { CdpDtoPlainObject } from '@/app/types/app.type';

interface CdpListItemProps {
  cdp: CdpDtoPlainObject;
  handleCdpClick: (id: number) => void;
}

const CdpListItem: React.FC<CdpListItemProps> = ({ cdp, handleCdpClick }) => {
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
                <div>{cdp.userAddr}</div>
            </div>
            <div className={styles.statsContainer}>
                <div className={`${styles.statsItem} ${styles.collateral}`}>
                <div className={styles.label}>Collateral:</div>{' '}
                <div className={styles.value}>
                    {cdp.collateral.toFixed(2)}{' '}
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