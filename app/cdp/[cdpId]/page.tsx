'use client';

import React, { useEffect, useState, useLayoutEffect } from 'react';
import BN from 'bn.js';
import Signature from './Signature';
import { useWeb3 } from '../../hooks/useWeb3';
import { utils } from '@defisaver/tokens';
import { DEFAULT_ILK_LABEL, FETCH_COLLATERAL_PRICES_API } from '../../constant/general_app';
import { CDP_INFO_ABI, COLLATERAL_TYPES, CONTRACT_ADDRESS, ILKS_ABI, ILKS_CONTRACT_ADDRESS } from '../../constant/contract';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CdpDetailsData from './CdpDetailsData';
import CdpDetailGraph from '../../graph/CdpDetailGraph';
import styles from './CdpDetails.module.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../../../public/style.css';
import { useCalculateAdjustedDebt } from '../../hooks/useCalculateAdjustedDebt';
import CdpDetail from '../CdpDetail';
import { IlkRateData } from '../../types/app.type';

const CdpDetails = ({ params }: { params: { cdpId: number } }) => {
  const [cdpId, setCdpId] = useState<number | null>(null);
  const [cdpData, setCdpData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collateralPrices, setCollateralPrices] = useState<any>(null);
  const { web3, account } = useWeb3();

  useLayoutEffect(() => {
    fetchCollateralPrices();
  }, []);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setCdpId(resolvedParams.cdpId);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    fetchCdpData();
  }, [web3, cdpId, collateralPrices]);

  const fetchCollateralPrices = async () => {
    try {
      const response = await fetch(FETCH_COLLATERAL_PRICES_API);
      const data = await response.json();
      setCollateralPrices(data);
    } catch (error) {
      console.error('Error fetching collateral prices:', error);
    }
  };

  const fetchCdpData = async () => {
    if (!web3 || !cdpId || !collateralPrices) return;

    try {
      const contract = new web3.eth.Contract(CDP_INFO_ABI, CONTRACT_ADDRESS);
      const ilksContract = new web3.eth.Contract(ILKS_ABI, ILKS_CONTRACT_ADDRESS);
      const data: { ilk: string; debt: number; collateral: string; owner: string } = await contract.methods.getCdpInfo(cdpId).call();
      const ilkRateData: IlkRateData = await ilksContract.methods.ilks(data.ilk).call();
      if (!ilkRateData || !ilkRateData.rate) {
        throw new Error('Failed to fetch ilk rate data');
      }
      const rate = new BN(ilkRateData.rate);
      const adjustedDebt = useCalculateAdjustedDebt(web3, data.debt, rate);
      const collateralType = COLLATERAL_TYPES.find(type => type.value === utils.bytesToString(data.ilk));
      const liquidationRatioDisplay = collateralType ? collateralType.liquidationRatio : 0;
      const liquidationRatio = liquidationRatioDisplay / 100;
      const collateralPrice = collateralPrices[collateralType ? collateralType.priceLabel : DEFAULT_ILK_LABEL];
      const collateral = parseFloat(web3.utils.fromWei(data.collateral, 'ether'));
      const cdpDetail = new CdpDetail(data.ilk, parseFloat(web3.utils.fromWei(data.debt, 'ether')), collateral.toFixed(2), data.owner, collateralPrice, adjustedDebt, liquidationRatio);
      setCdpData(cdpDetail);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching CDP data:', error);
      setLoading(false);
    }
  };

  const renderOverlay = (content: React.ReactNode) => (
    <div>
      <div className="background_overlay"></div>
      {content}
    </div>
  );

  if (loading) {
    return renderOverlay(
      <span className={styles.loading}>
        <FontAwesomeIcon icon={faSpinner} />
      </span>
    );
  }

  if (!cdpData) {
    return renderOverlay(
      <p className={`title ${styles.noData}`}>No data found for CDP {cdpId}</p>
    );
  }

  return renderOverlay(
    <div className={styles.cdpDetailsData}>
      <CdpDetailsData cdpId={cdpId ? cdpId.toString() : ''} cdpData={cdpData} />
      <CdpDetailGraph cdpData={cdpData} />
      {web3 && account && <Signature web3={web3} account={account} />}
    </div>
  );
};

export default CdpDetails;
