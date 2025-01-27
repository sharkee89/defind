'use client';

import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import CdpForm from './CdpForm';
import CdpList from './CdpList';
import LoadingProperties from './LoadingProperties';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './CdpListPage.module.css';
import { useCdp } from './hooks/useCdp';
import { useWeb3 } from './hooks/useWeb3';
import type { RootState } from './redux/store';
import { useSelector } from 'react-redux';

window.Buffer = Buffer;

const CdpListPage: React.FC = () => {
  const {web3, account, error, setError, contract, ilksContract, initialized} = useWeb3();
  const cdpId = useSelector((state: RootState) => state.app.cdpId);
  const [selectedIlk, setSelectedIlk] = useState<string>('ETH-A');
  const {
    closestCdps,
    getClosestCdps,
    stopAndResetCdpSearch,
    isLoading,
    progress,
    searchedLowerValue,
    foundLowerValue,
    searchedGreaterValue,
    foundGreaterValue,
    jsonRpcCalled,
  } = useCdp(web3!, cdpId, selectedIlk, contract, ilksContract, setError);
  const handleIlkChange = (event: string) => {
    setSelectedIlk(event);
  };

  const closeErrorPopup = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      stopAndResetCdpSearch(false);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className="title">
          <h1>DeFiNd</h1>
        </div>
      </div>
      {error && (
        <div className={styles.error}>
          <span></span>{error}
          <span className={styles.closePopupBtn} onClick={closeErrorPopup}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </span>
        </div>
      )}
      <div className={styles.accountWrapper}>
        <div>
          <div className={styles.accountLabel}>Account:{' '}</div>
          <div className={styles.accountData}>
            {account ? account : 'Not connected'}
          </div>
        </div>
        <div>
          {web3 ? (
            <span className={`${styles.accountIcon} ${styles.verified}`}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </span>
          ) : (
            <span className={`${styles.accountIcon} ${styles.notVerified}`}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </span>
          )}
        </div>
      </div>
      <div>
        {initialized && (
          <div className={styles.data}>
            <span>
              <CdpForm
                cdpId={cdpId}
                selectedIlk={selectedIlk}
                stopAndResetCdpSearch={stopAndResetCdpSearch}
                handleIlkChange={handleIlkChange}
                getClosestCdps={getClosestCdps}
                isLoading={isLoading}
                progress={progress}
                account={account}
              />
              <LoadingProperties
                isLoading={isLoading}
                jsonRpcCalled={jsonRpcCalled}
                searchedLowerValue={searchedLowerValue}
                foundLowerValue={foundLowerValue}
                searchedGreaterValue={searchedGreaterValue}
                foundGreaterValue={foundGreaterValue}
                progress={progress}
                found={closestCdps.length}
                totalSearch={20}
              />
            </span>
            <span>
              {web3 && <CdpList closestCdps={closestCdps} web3={web3} />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CdpListPage;