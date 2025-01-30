import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import styles from './CdpList.module.css';
import CdpListItem from './item/CdpListItem';
import { CdpDtoPlainObject } from '../../../types/app.type';

interface CdpListProps {
  closestCdps: CdpDtoPlainObject[];
}

const CdpList: React.FC<CdpListProps> = ({ closestCdps }) => {
  const router = useRouter();

  const handleCdpClick = (cdpId: string) => {
    router.push(`/cdp/${cdpId}`);
  };

  return (
    <div>
      <div className={styles.heading}>
        <div className="title">
          <h3>Closest CDP Data:</h3>
        </div>
      </div>

      <div className={styles.cdpList}>
        {closestCdps.map(cdp => (
          <CdpListItem key={cdp.id} cdp={cdp} handleCdpClick={handleCdpClick} />
        ))}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CdpList), { ssr: false });
