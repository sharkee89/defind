import { useState, useRef } from 'react';
import { RootState } from '../redux/store';
import { utils } from '@defisaver/tokens';
import { MAX_CONCURRENT_CALLS } from '../constant/general_app';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateProgress,
  clearLoadingParams,
  incrementJsonRpcCalled,
  incrementSearchedLowerValueAndGreaterValue,
  incrementFoundLowerValue,
  incrementSearchedGreaterValue,
  incrementFoundGreaterValue,
  addCdp,
  updateClosestCdps
} from '../redux/reducers/appSlice';
import { useWeb3 } from './useWeb3';
import CdpDto from '../cdp/dto/CdpDto';

export const useCdp = (cdpId: number, selectedIlk: string) => {
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
  const [error, setError] = useState<string | null>(null);
  const { getCdpData } = useWeb3();

  const getClosestCdps = async () => {
    resetSearchState();

    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      if (cdpId) {
        const startCdpId = Number(cdpId);
        const closestCdpsList = new Set<number>();
        let found = 0;
        const totalSearch = 20;
        setIsLoading(true);
        dispatch(updateProgress(0));
        const closestCdps: CdpDto[] = [];
        const promisesQueueLocal: Promise<any>[] = [];
        promisesQueue.current = promisesQueueLocal;
        const cdpItem = await getCdpData(cdpId, controller);
        if (cdpItem) {
          found = await processCdpData(cdpItem, cdpId, closestCdpsList, closestCdps, found);
        }

        let lowerCdpId = startCdpId - 1;
        let upperCdpId = startCdpId + 1;
        while (found < totalSearch && (lowerCdpId >= 0 || upperCdpId >= 0)) {
          const cdpsToCheck: Promise<any>[] = [];
          if (lowerCdpId >= 0) {
            dispatch(incrementJsonRpcCalled());
            cdpsToCheck.push(getCdpData(lowerCdpId, controller));
          }
          dispatch(incrementJsonRpcCalled());
          cdpsToCheck.push(getCdpData(upperCdpId, controller));
          promisesQueueLocal.push(...cdpsToCheck);

          if (promisesQueueLocal.length >= MAX_CONCURRENT_CALLS) {
            await Promise.allSettled(promisesQueueLocal.slice(0, MAX_CONCURRENT_CALLS));
            promisesQueueLocal.splice(0, MAX_CONCURRENT_CALLS);
          }

          const cdpData = await Promise.all(cdpsToCheck);
          let lowerData: CdpDto;
          let upperData: CdpDto;
          if (lowerCdpId >= 0) {
            lowerData = cdpData[0];
            upperData = cdpData[1];
            dispatch(incrementSearchedLowerValueAndGreaterValue());
            found = await processCdpData(lowerData, lowerCdpId, closestCdpsList, closestCdps, found);
          } else {
            upperData = cdpData[0];
            dispatch(incrementSearchedGreaterValue());
          }
          found = await processCdpData(upperData, upperCdpId, closestCdpsList, closestCdps, found);
          dispatch(updateProgress(Math.round((found / totalSearch) * 100)));
          lowerCdpId--;
          upperCdpId++;

          await new Promise((resolve) => setTimeout(resolve, 100));

          if (controller.signal.aborted) {
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
    dispatch(clearLoadingParams());
  };

  const stopAndResetCdpSearch = (reset: boolean) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    if (reset) {
      resetSearchState();
    }
    promisesQueue.current = [];
    setIsLoading(false);
  };

  const processCdpData = async (
    cdpItem: CdpDto,
    cdpIdToCheck: number,
    closestCdpsList: Set<number>,
    closestCdps: CdpDto[],
    found: number
  ) => {
    const validData = (cdpItem && cdpItem.collateral > 0 && cdpItem.debt > 0 && utils.bytesToString(cdpItem.ilk) === selectedIlk);
    if (validData && !closestCdpsList.has(cdpIdToCheck)) {
      closestCdpsList.add(cdpIdToCheck);
      closestCdps.push(cdpItem);
      dispatch(addCdp(cdpItem.toPlainObject()));
      if (cdpIdToCheck < Number(cdpId) && cdpIdToCheck > 0) {
        dispatch(incrementFoundLowerValue());
      } else if (cdpIdToCheck > Number(cdpId)) {
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
    jsonRpcCalled,
  };
};
