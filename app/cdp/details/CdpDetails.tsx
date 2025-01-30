'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Signature from '../signature/Signature';
import { useWeb3 } from '../../hooks/useWeb3';
import { FETCH_COLLATERAL_PRICES_API } from '../../constant/general_app';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CdpDetailsData from './data/CdpDetailsData';
import CdpDetailGraph from '../../graph/CdpDetailGraph';
import styles from './CdpDetails.module.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../../../public/style.css';
import CdpDetailsDto from '../dto/CdpDetailsDto';

const CdpDetails = ({ cdpId }: { cdpId: number }) => {
  const [cdpData, setCdpData] = useState<CdpDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [collateralPrices, setCollateralPrices] = useState<any>(null);
  const { account, getCdpDetailsData } = useWeb3();

  useLayoutEffect(() => {
    fetchCollateralPrices();
  }, []);

  useEffect(() => {
    if (cdpId && collateralPrices) {
      fetchCdpData();
    }
  }, [cdpId, collateralPrices]);

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
    try {
      setLoading(true);
      const cdpDto = await getCdpDetailsData(cdpId);
      if (cdpDto) {
        const cdpDetailsDto = new CdpDetailsDto(cdpDto, collateralPrices);
        setCdpData(cdpDetailsDto);
      }
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
      <CdpDetailsData cdpId={cdpId} cdpData={cdpData} />
      <CdpDetailGraph cdpData={cdpData} />
      <Signature account={account} />
    </div>
  );
};

export default CdpDetails;
