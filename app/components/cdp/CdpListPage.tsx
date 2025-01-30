'use client';

import React, { useEffect } from 'react';
import { Buffer } from 'buffer';
import CdpForm from './form/CdpForm';
import CdpList from './list/CdpList';
import LoadingProperties from '../loading-properties/LoadingProperties';
import styles from './CdpListPage.module.css';
import { useCdp } from '../../hooks/useCdp';
import { useWeb3 } from '../../hooks/useWeb3';
import type { RootState } from '../../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { updateIlk } from '../../redux/reducers/appSlice';
import AccountStatus from '../account-status/AccountStatus';

const CdpListPage: React.FC = () => {
  const { account, accountError } = useWeb3();
  const cdpId = useSelector((state: RootState) => state.app.cdpId);
  const selectedIlk = useSelector((state: RootState) => state.app.ilk);
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
  } = useCdp(cdpId, selectedIlk);
  const dispatch = useDispatch();
  const handleIlkChange = (event: string) => {
    dispatch(updateIlk(event));
  };

  // const closeErrorPopup = () => {
  //   setError(null);
  // };

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window.Buffer = Buffer;
  //   }
  //   return () => {
  //     stopAndResetCdpSearch(false);
  //   };
  // }, []);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <div className="title">
          <h1>DeFiNd</h1>
        </div>
      </div>
      <AccountStatus account={account} accountError={accountError} />
      <div>
        {/* {initialized && ( */}
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
              <CdpList closestCdps={closestCdps} />
            </span>
          </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default CdpListPage;