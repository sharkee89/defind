import { useState, useEffect, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { CDP_INFO_ABI, CONTRACT_ADDRESS, ILKS_ABI, ILKS_CONTRACT_ADDRESS } from '../constant/contract';

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [ilksContract, setIlksContract] = useState<any | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initializeWeb3 = useCallback(async () => {
    setIsLoading(true);
    const provider = await detectEthereumProvider();
    if (!provider) {
      setError('Please install MetaMask!');
      setIsLoading(false);
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

      setInitialized(true);
    } catch (err: any) {
      setError(`Error initializing Web3: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeWeb3();
  }, [initializeWeb3]);

  return { web3, account, error, setError, contract, ilksContract, initialized, isLoading };
};