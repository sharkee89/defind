import CdpDto from "../cdp/dto/CdpDto";

export interface Contract {
  methods: {
    getCdpInfo: (cdpId: number) => { call: (options: { signal: AbortSignal }) => Promise<CdpDto> };
  };
}
export interface IlkRateData {
  rate: string;
  line: string;
  spot: string;
  dust: string;
  Art: string;
}
export interface IlkContract {
    methods: {
      ilks: (ilk: string) => { call: (arg0: { signal: AbortSignal }) => Promise<IlkRateData> };
    }
}

export interface CdpDtoPlainObject {
  id: number;
  owner: string;
  collateral: number;
  debt: number;
  ilk: string;
  ilkLabel: string;
  urn: string;
  userAddr: string;
}