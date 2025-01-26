import { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import BN from 'bn.js';
import { utils } from '@defisaver/tokens';
import { CORRECTION_RATE_VALUE } from '../../constant/general_app';
import { COLLATERAL_TYPES, CDP_INFO_ABI, CONTRACT_ADDRESS, ILKS_ABI, ILKS_CONTRACT_ADDRESS } from '../../constant/contract';

interface CdpData {
  ilk: string;
  debt: number;
  collateral: string;
  owner: string;
  adjustedDebt: number;
  collateralizationRatio: number;
  liquidationRatio: number;
  maxCollateralWithoutLiquidation: number;
  maxDebtWithoutLiquidation: number;
}

interface IlkRateData {
  rate: string;
}

interface UseCdpDetailReturn {
  cdpData: CdpData | null;
  loading: boolean;
  error: Error | null;
}

const useCdpDetail = (cdpId: string): UseCdpDetailReturn => {
  const [cdpData, setCdpData] = useState<CdpData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { web3 } = useWeb3();
  
  useEffect(() => {
    if (!cdpId || !web3) return;

    const calculateAdjustedDebt = (debtInWei: number, rate: BN) => {
        if (!web3) {
          throw new Error('web3 is not initialized');
        }
        const rawDebtInEther = web3 && web3.utils.fromWei(debtInWei.toString(), 'ether');
        const rawDebtInEtherBN = new BN(web3.utils.toWei(rawDebtInEther, 'ether'));
        const adjustedDebt = rawDebtInEtherBN.mul(rate).div(new BN(10).pow(new BN(26)));
        let adjustedDebtInEther = web3.utils.fromWei(adjustedDebt.toString(), 'ether');
        return parseFloat(adjustedDebtInEther) / CORRECTION_RATE_VALUE;
    };

    const fetchCdpData = async () => {
      setLoading(true);
      try {
        const contract = new web3.eth.Contract(CDP_INFO_ABI, CONTRACT_ADDRESS);
        const ilksContract = new web3.eth.Contract(ILKS_ABI, ILKS_CONTRACT_ADDRESS);
        const data: CdpData = await contract.methods.getCdpInfo(cdpId).call();
        const ilkRateData: IlkRateData = await ilksContract.methods.ilks(data.ilk).call();
        
        if (!ilkRateData || !ilkRateData.rate) {
          throw new Error('Failed to fetch ilk rate data');
        }

        const rate = new BN(ilkRateData.rate);
        const adjustedDebt = calculateAdjustedDebt(data.debt, rate);
        const collateralType = COLLATERAL_TYPES.find(type => type.value === utils.bytesToString(data.ilk));
        const liquidationRatioDisplay = collateralType ? collateralType.liquidationRatio : 0;
        const liquidationRatio = liquidationRatioDisplay / 100;
        const collateralPrice = collateralType ? collateralType.priceUsd : 0;
        const collateral = parseFloat(web3.utils.fromWei(data.collateral, 'ether'));
        const collateralValueInUsd = collateral * collateralPrice;

        setCdpData({
          ...data,
          adjustedDebt,
          collateralizationRatio: collateralValueInUsd / adjustedDebt,
          liquidationRatio,
          maxCollateralWithoutLiquidation: collateral - ((adjustedDebt * liquidationRatio) / collateralPrice),
          maxDebtWithoutLiquidation: collateralValueInUsd / liquidationRatio,
        });
      } catch (error: any) {
        console.error('Error fetching CDP data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCdpData();
  }, [cdpId, web3]);

  return { cdpData, loading, error };
};

export default useCdpDetail;
