interface CollateralType {
  value: string;
  label: string;
  liquidationRatio: number;
  priceLabel: string;
}
export const CONTRACT_ADDRESS = '0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d';
export const ILK = '0x4554482d41000000000000000000000000000000000000000000000000000000';
export const ILKS_CONTRACT_ADDRESS = '0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b';
export const CDP_INFO_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
    "name": "_getProxyOwner",
    "outputs": [{ "internalType": "address", "name": "userAddr", "type": "address" }],
    "stateMutability": "view",
    "type": "function",
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_cdpId", "type": "uint256" }],
    "name": "getCdpInfo",
    "outputs": [
      { "internalType": "address", "name": "urn", "type": "address" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "userAddr", "type": "address" },
      { "internalType": "bytes32", "name": "ilk", "type": "bytes32" },
      { "internalType": "uint256", "name": "collateral", "type": "uint256" },
      { "internalType": "uint256", "name": "debt", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
export const ILKS_ABI = [
  {
    "inputs": [{ "internalType": "bytes32", "name": "ilk", "type": "bytes32" }],
    "name": "ilks",
    "outputs": [
      { "internalType": "uint256", "name": "rate", "type": "uint256" },
      { "internalType": "uint256", "name": "spot", "type": "uint256" },
      { "internalType": "uint256", "name": "liquidationRatio", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
export const COLLATERAL_TYPES: CollateralType[] = [
  { value: 'ETH-A', label: 'ETH-A', liquidationRatio: 145, priceLabel: 'ethereum' },
  { value: 'WBTC-A', label: 'WBTC-A', liquidationRatio: 145, priceLabel: 'wrapped-bitcoin' },
  { value: 'USDC-A', label: 'USDC-A', liquidationRatio: 101, priceLabel: 'usd-coin' },
];