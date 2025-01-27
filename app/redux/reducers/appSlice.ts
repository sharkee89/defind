import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CpdListItem } from '@/app/types/app.type';

interface CdpState {
  progress: number;
  jsonRpcCalled: number;
  searchedLowerValue: number;
  foundLowerValue: number;
  searchedGreaterValue: number;
  foundGreaterValue: number;
  cdpId: number;
  closestCdps: Array<any>;
  ilk: string;
}

const initialState: CdpState = {
  progress: 0,
  jsonRpcCalled: 0,
  searchedLowerValue: 0,
  foundLowerValue: 0,
  searchedGreaterValue: 0,
  foundGreaterValue: 0,
  cdpId: 1,
  closestCdps: [],
  ilk: 'ETH-A',
};

const appSlice = createSlice({
  name: 'closestCdps',
  initialState,
  reducers: {
    updateProgress: (state: CdpState, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    incrementJsonRpcCalled: (state: CdpState) => {
      state.jsonRpcCalled += 1;
    },
    clearLoadingParams: (state: CdpState) => {
      state.jsonRpcCalled = 0;
      state.searchedLowerValue = 0;
      state.foundLowerValue = 0;
      state.searchedGreaterValue = 0;
      state.foundGreaterValue = 0;
    },
    incrementSearchedLowerValueAndGreaterValue: (state: CdpState) => {
      state.searchedLowerValue += 1;
      state.searchedGreaterValue += 1;
    },
    incrementFoundLowerValue: (state: CdpState) => {
      state.foundLowerValue += 1;
    },
    incrementSearchedGreaterValue: (state: CdpState) => {
      state.searchedGreaterValue += 1;
    },
    incrementFoundGreaterValue: (state: CdpState) => {
      state.foundGreaterValue += 1;
    },
    updateClosestCdps: (state: CdpState, action: PayloadAction<Array<CpdListItem>>) => {
      state.closestCdps = action.payload;
    },
    addCdp: (state: CdpState, action: PayloadAction<CpdListItem>) => {
      state.closestCdps.push(action.payload);
    }, 
    updateCdpId: (state: CdpState, action: PayloadAction<number>) => {
      state.cdpId = action.payload
    },
    updateIlk: (state: CdpState, action: PayloadAction<string>) => {
      state.ilk = action.payload
    }
  },
});

export const {
  updateProgress,
  incrementJsonRpcCalled,
  clearLoadingParams,
  incrementSearchedLowerValueAndGreaterValue,
  incrementFoundLowerValue,
  incrementSearchedGreaterValue,
  incrementFoundGreaterValue,
  updateClosestCdps,
  addCdp,
  updateCdpId,
  updateIlk
} = appSlice.actions;
export default appSlice.reducer;