import Web3 from 'web3';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './CdpList.module.css';
import CdpListItem from './CdpListItem';

interface CdpData {
  id: string;
  owner: string;
  collateral: string;
  debt: number;
  ilk: string;
}

interface CdpListProps {
  closestCdps: CdpData[];
  web3: Web3;
}

const CdpList: React.FC<CdpListProps> = ({ closestCdps, web3 }) => {
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
          <CdpListItem key={cdp.id} cdp={cdp} web3={web3} handleCdpClick={handleCdpClick} />
        ))}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CdpList), { ssr: false });
