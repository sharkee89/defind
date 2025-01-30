import { useState, useEffect, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { utils } from '@defisaver/tokens';
import { CDP_INFO_ABI, CONTRACT_ADDRESS, ILKS_ABI, ILKS_CONTRACT_ADDRESS } from '../constant/contract';
import CdpDto from '../cdp/dto/CdpDto';

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>(new Web3());
  const [account, setAccount] = useState<string>('');
  const [accountError, setAccountError] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [ilksContract, setIlksContract] = useState<any | null>(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      console.log('Initializing Web3...');
      const provider = await detectEthereumProvider();
      if (!provider) {
        setAccountError('Please install MetaMask!');
        return;
      }
      try {
        const web3Instance = new Web3(provider as any);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(CDP_INFO_ABI, CONTRACT_ADDRESS);
        setContract(contractInstance);

        const ilksContractInstance = new web3Instance.eth.Contract(ILKS_ABI, ILKS_CONTRACT_ADDRESS);
        setIlksContract(ilksContractInstance);

        provider.on('accountsChanged', (accounts: string[]) => setAccount(accounts[0]));
        provider.on('chainChanged', () => window.location.reload());
      } catch (err: any) {
        console.error(`Error initializing Web3: ${err.message}`);
      }
    };

    initializeWeb3();
  }, []);

  const getCdpInfo = useCallback(async (cdpId: number, controller: AbortController = new AbortController) => {
    if (!contract || !web3) return null;
    try {
      const cdpInfo = await contract.methods.getCdpInfo(cdpId).call({ signal: controller.signal });
      return cdpInfo;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`Request aborted for CDP ID: ${cdpId}`);
      } else {
        console.error(`Error fetching CDP info for ID ${cdpId}:`, error);
      }
      return null;
    }
  }, [contract, web3]);

  const getIlkRate = useCallback(async (ilk: string, controller: AbortController = new AbortController) => {
    if (!ilksContract || !web3) return null;
    try {
      const ilksData = await ilksContract.methods.ilks(ilk).call({ signal: controller.signal });
      return ilksData;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`Request aborted for ILK: ${ilk}`);
      } else {
        console.error(`Error fetching ILK rate for ${ilk}:`, error);
      }
      return null;
    }
  }, [ilksContract, web3]);

  const getAggregatedData = useCallback(async (cdpId: number, controller: AbortController = new AbortController) => {
    const cdpData = await getCdpInfo(cdpId, controller);
    if (!cdpData) return;
    const ilkRateData = await getIlkRate(cdpData.ilk, controller);
    if (!ilkRateData) return;
    return { cdpData, ilkRateData };
  }, [contract, ilksContract, web3]);

  const getCdpData = useCallback(async (cdpId: number, controller: AbortController = new AbortController) => {
    const aggregatedData = await getAggregatedData(cdpId, controller);
    if (!aggregatedData) return;
    const { cdpData, ilkRateData } = aggregatedData;
    
    const cdpItem = new CdpDto({
      ...cdpData,
      id: cdpId,
      collateral: parseFloat(getValueFromWei(cdpData.collateral)),
      ilk: cdpData.ilk,
      ilkLabel: getIlkLabel(cdpData.ilk),
      debt: getAdjustedDebt(cdpData.debt, ilkRateData.rate),
    });
    return cdpItem
  }, [contract, ilksContract, web3]);

  const getCdpDetailsData = useCallback(async (cdpId: number) => {
    const aggregatedData = await getAggregatedData(cdpId);
    if (!aggregatedData) return;
    const { cdpData, ilkRateData } = aggregatedData;
    
    const cdpItem = new CdpDto({
      ...cdpData,
      id: cdpId,
      collateral: parseFloat(getValueFromWei(cdpData.collateral)),
      ilk: cdpData.ilk,
      ilkLabel: getIlkLabel(cdpData.ilk),
      debt: getAdjustedDebt(cdpData.debt, ilkRateData.rate),

    });
    return cdpItem
  }, [contract, ilksContract, web3]);

  const getValueFromWei = (value: any) => {
    return web3.utils.fromWei(value, 'ether');
  };

  const getIlkLabel = (ilk: string) => {
    return utils.bytesToString(ilk);
  };

  const signMessage = async (message: string, account: string) => {
    return await web3.eth.personal.sign(message, account, '');
  }

  const getAdjustedDebt = (debt: number, rate: number) => {
    return parseFloat(getValueFromWei(debt)) * parseFloat(getValueFromWei(rate)) / 1000000000;
  }

  return {
    account,
    accountError,
    getCdpData,
    getCdpDetailsData,
    getCdpInfo,
    getIlkRate,
    getValueFromWei,
    signMessage,
  };
};