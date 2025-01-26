export interface Contract {
  methods: {
    getCdpInfo: (cdpId: number) => { call: (options: { signal: AbortSignal }) => Promise<CpdListItem> };
  };
}
export interface IlkRateData {
  rate: string;
}
export interface IlkContract {
    methods: {
      ilks: (ilk: string) => { call: (arg0: { signal: AbortSignal }) => Promise<IlkRateData> };
    }
}
export interface CpdListItem {
    id: number,
    urn: string,
    owner: string,
    userAddr: string,
    ilk: string,
    collateral: string | number,
    debt: number,
}
export interface CdpData {
    0: string;
    1: string;
    2: string;
    3: string;
    4: number;
    5: number;
    collateral: number;
    debt: number
    ilk: string;
    owner: string;
    urn: string;
    userAddr: string;
}