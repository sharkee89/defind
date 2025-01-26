'use client';

import React, { useEffect, useState } from 'react';
import BN from 'bn.js';
import { useWeb3 } from '../../hooks/useWeb3';
import { utils } from '@defisaver/tokens';
import { COINGECKO_API_URL, DEFAULT_ILK_LABEL } from '../../constant/general_app';
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
  const [signature, setSignature] = useState<any>(null);
  const [collateralPrices, setCollateralPrices] = useState<any>(null);
  const { web3, account } = useWeb3();

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setCdpId(resolvedParams.cdpId);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    fetchCollateralPrices();
  }, []);

  useEffect(() => {
    fetchCdpData();
  }, [web3, cdpId, collateralPrices]);

  const fetchCollateralPrices = async () => {
    try {
      const response = await fetch(COINGECKO_API_URL);
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

  const signMessage = async () => {
    if (!web3 || !account) {
      alert('Please connect to MetaMask first.');
      return;
    }

    const message = 'Ovo je moj CDP';

    try {
      const signedMessage = await web3.eth.personal.sign(message, account, '');
      setSignature(signedMessage);
    } catch (error) {
      console.error('Error signing the message:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="background_overlay"></div>
        <span className={styles.loading}>
          <FontAwesomeIcon icon={faSpinner} />
        </span>
      </div>
    );
  }

  if (!cdpData) {
    return (
      <div>
        <p className={`title ${styles.noData}`}>No data found for CDP {cdpId}</p>
        <div className="background_overlay"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="background_overlay"></div>
      <div className={styles.cdpDetailsData}>
        <CdpDetailsData cdpId={cdpId ? cdpId.toString() : ''} cdpData={cdpData} />
        <CdpDetailGraph cdpData={cdpData} />
        <div className={styles.signMessageContainer}>
          {!signature && (
            <button onClick={signMessage} className={styles.button}>
              Ovo je moj CDP
            </button>
          )}
          {signature && (
            <div className={`title ${styles.signatureContainer}`}>
              <div className={styles.signature}>
                  <div className={styles.signatureDisplay}>
                    <h3>Signed Message:</h3>
                    <p>{signature}</p>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CdpDetails;
