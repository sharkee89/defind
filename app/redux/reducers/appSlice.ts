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
    clearJsonRpcCalled: (state: CdpState) => {
      state.jsonRpcCalled = 0;
    },
    incrementSearchedLowerValue: (state: CdpState) => {
      state.searchedLowerValue += 1;
    },
    clearSearchedLowerValue: (state: CdpState) => {
      state.searchedLowerValue = 0;
    },
    incrementFoundLowerValue: (state: CdpState) => {
      state.foundLowerValue += 1;
    },
    clearFoundLowerValue: (state: CdpState) => {
      state.foundLowerValue = 0;
    },
    incrementSearchedGreaterValue: (state: CdpState) => {
      state.searchedGreaterValue += 1;
    },
    clearSearchedGreaterValue: (state: CdpState) => {
      state.searchedGreaterValue = 0;
    },
    incrementFoundGreaterValue: (state: CdpState) => {
      state.foundGreaterValue += 1;
    },
    clearFoundGreaterValue: (state: CdpState) => {
      state.foundGreaterValue = 0;
    },
    updateClosestCdps: (state: CdpState, action: PayloadAction<Array<CpdListItem>>) => {
      state.closestCdps = action.payload;
    },
    addCdp: (state: CdpState, action: PayloadAction<CpdListItem>) => {
      state.closestCdps.push(action.payload);
    },
    updateCdpId: (state: CdpState, action: PayloadAction<number>) => {
      state.cdpId = action.payload
    }
  },
});

export const {
  updateProgress,
  incrementJsonRpcCalled,
  clearJsonRpcCalled,
  incrementSearchedLowerValue,
  clearSearchedLowerValue,
  incrementFoundLowerValue,
  clearFoundLowerValue,
  incrementSearchedGreaterValue,
  clearSearchedGreaterValue,
  incrementFoundGreaterValue,
  clearFoundGreaterValue,
  updateClosestCdps,
  addCdp,
  updateCdpId
} = appSlice.actions;
export default appSlice.reducer;