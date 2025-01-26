import { useState, useRef } from 'react';
import BN from 'bn.js';
import Web3 from 'web3';
import { utils } from '@defisaver/tokens';
import { MAX_CONCURRENT_CALLS } from '../constant/general_app';
import type { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useCalculateAdjustedDebt } from './useCalculateAdjustedDebt';
import {
  updateProgress,
  clearJsonRpcCalled,
  incrementJsonRpcCalled,
  clearSearchedLowerValue,
  incrementSearchedLowerValue,
  clearFoundLowerValue,
  incrementFoundLowerValue,
  clearSearchedGreaterValue,
  incrementSearchedGreaterValue,
  clearFoundGreaterValue,
  incrementFoundGreaterValue,
  addCdp,
  updateClosestCdps
} from '../redux/reducers/appSlice';
import { Contract, IlkContract, CpdListItem, CdpData } from '../types/app.type';

export const useCdp = (web3: Web3, cdpId: number, selectedIlk: string, contract: Contract, ilksContract: IlkContract, setError: any) => {
  const progress = useSelector((state: RootState) => state.app.progress);
  const closestCdps = useSelector((state: RootState) => state.app.closestCdps);
  const jsonRpcCalled = useSelector((state: RootState) => state.app.jsonRpcCalled);
  const searchedLowerValue = useSelector((state: RootState) => state.app.searchedLowerValue);
  const foundLowerValue = useSelector((state: RootState) => state.app.foundLowerValue);
  const searchedGreaterValue = useSelector((state: RootState) => state.app.searchedGreaterValue);
  const foundGreaterValue = useSelector((state: RootState) => state.app.foundGreaterValue);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);
  const promisesQueue = useRef<Promise<any>[]>([]);
  
  const getCdpInfo = async (cdpId: number, contract: Contract, controller: AbortController) => {
    try {
      return await contract?.methods.getCdpInfo(cdpId).call({ signal: controller.signal });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted:', cdpId);
      } else {
        console.error(`Error fetching CDP info for ID ${cdpId}:`, error);
      }
      return null;
    }
  };

  const getIlkRate = async (ilk: string, ilksContract: IlkContract, controller: AbortController) => {
    try {
      return await ilksContract?.methods.ilks(ilk).call({ signal: controller.signal });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted:', ilk);
      } else {
        console.error(`Error fetching ILK rate for ${ilk}:`, error);
      }
      return null;
    }
  };

  const getClosestCdps = async () => {
    console.log(`Fetching closest CDPs for id: ${cdpId}`);
    resetSearchState();

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      if (contract && ilksContract && cdpId) {
        const startCdpId = Number(cdpId);
        const closestCdpsList = new Set<number>();
        let found = 0;
        const totalSearch = 20;
        setIsLoading(true);
        dispatch(updateProgress(0));
        let lowerCdpId = startCdpId - 1;
        let upperCdpId = startCdpId + 1;

        const closestCdps: CpdListItem[] = [];
        const promisesQueueLocal: Promise<any>[] = [];
        promisesQueue.current = promisesQueueLocal;

        const data = await getCdpInfo(cdpId, contract, controller);
        if (!data) return;

        const ilkRateData = await getIlkRate(data.ilk, ilksContract, controller);
        if (!ilkRateData) return;

        const rate = new BN(ilkRateData.rate);

        const validData = (new BN(data.collateral).gt(new BN(0)) &&
          new BN(data.debt).gt(new BN(0)) &&
          utils.bytesToString(data.ilk) === selectedIlk);

        if (validData) {
          let adjustedDebtInEther = useCalculateAdjustedDebt(web3, data.debt, rate);
          const cdp: CpdListItem = {
            id: cdpId,
            urn: data.urn,
            owner: data.owner,
            userAddr: data.userAddr,
            ilk: data.ilk,
            collateral: web3 ? parseFloat(web3.utils.fromWei(data.collateral, 'ether')).toFixed(2) : 0,
            debt: adjustedDebtInEther,
          };
          closestCdps.push(cdp);
          dispatch(addCdp(cdp));
          found++;
        }

        while (found < totalSearch && (lowerCdpId >= 0 || upperCdpId >= 0)) {
          console.log('Searching for CDPs:', lowerCdpId, upperCdpId);
          const cdpsToCheck: Promise<any>[] = [];
          if (lowerCdpId >= 0) {
            dispatch(incrementJsonRpcCalled());
            cdpsToCheck.push(contract.methods.getCdpInfo(lowerCdpId).call({ signal: controller.signal }));
          }
          dispatch(incrementJsonRpcCalled());
          cdpsToCheck.push(contract.methods.getCdpInfo(upperCdpId).call({ signal: controller.signal }));
          promisesQueueLocal.push(...cdpsToCheck);

          if (promisesQueueLocal.length >= MAX_CONCURRENT_CALLS) {
            await Promise.allSettled(promisesQueueLocal.slice(0, MAX_CONCURRENT_CALLS));
            promisesQueueLocal.splice(0, MAX_CONCURRENT_CALLS);
          }

          const cdpData = await Promise.all(cdpsToCheck);
          let lowerData: CdpData;
          let upperData: CdpData;
          if (lowerCdpId >= 0) {
            lowerData = cdpData[0];
            upperData = cdpData[1];
            dispatch(incrementSearchedLowerValue());
            dispatch(incrementSearchedGreaterValue());
            found = processCdpData(lowerCdpId, lowerData, rate, closestCdpsList, closestCdps, found);
          } else {
            upperData = cdpData[0];
            dispatch(incrementSearchedGreaterValue());
          }
          found = processCdpData(upperCdpId, upperData, rate, closestCdpsList, closestCdps, found);
          dispatch(updateProgress(Math.round((found / totalSearch) * 100)));
          lowerCdpId--;
          upperCdpId++;

          await new Promise((resolve) => setTimeout(resolve, 100));

          if (controller.signal.aborted) {
            console.log('Search aborted in the while loop.');
            break;
          }
        }

        await Promise.allSettled(promisesQueueLocal);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError('Error fetching CDP data: ' + err.message);
      setIsLoading(false);
    }
  };

  const resetSearchState = () => {
    dispatch(updateProgress(0));
    dispatch(updateClosestCdps([]));
    dispatch(clearJsonRpcCalled());
    dispatch(clearSearchedLowerValue());
    dispatch(clearFoundLowerValue());
    dispatch(clearSearchedGreaterValue());
    dispatch(clearFoundGreaterValue());
  };

  const stopAndResetCdpSearch = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    resetSearchState();
    promisesQueue.current = [];
    setIsLoading(false);
  };

  const processCdpData = (
    cdpIdToCheck: number,
    data: CdpData,
    rate: BN,
    closestCdpsList: Set<number>,
    closestCdps: CpdListItem[],
    found: number
  ) => {
    const validData =
      new BN(data.collateral).gt(new BN(0)) &&
      new BN(data.debt).gt(new BN(0)) &&
      utils.bytesToString(data.ilk) === selectedIlk;

    if (validData && !closestCdpsList.has(cdpIdToCheck)) {
      closestCdpsList.add(cdpIdToCheck);
      const adjustedDebtInEther = useCalculateAdjustedDebt(web3, data.debt, rate);
      const cdp = {
        id: cdpIdToCheck,
        urn: data.urn,
        owner: data.owner,
        userAddr: data.userAddr,
        ilk: data.ilk,
        collateral: web3 ? parseFloat(web3.utils.fromWei(data.collateral, 'ether')).toFixed(2) : 0,
        debt: adjustedDebtInEther
      };
      closestCdps.push(cdp);
      dispatch(addCdp(cdp));
      if (cdpIdToCheck < Number(cdpId) && cdpIdToCheck >= 0) {
        dispatch(incrementFoundLowerValue());
      } else {
        dispatch(incrementFoundGreaterValue());
      }
      found++;
    }

    return found;
  };

  return {
    closestCdps,
    getClosestCdps,
    stopAndResetCdpSearch,
    isLoading,
    progress,
    searchedLowerValue,
    foundLowerValue,
    searchedGreaterValue,
    foundGreaterValue,
    jsonRpcCalled
  };
};