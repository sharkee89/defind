import BN from 'bn.js';
import { CORRECTION_RATE_VALUE } from '../constant/general_app';
import Web3 from 'web3';

export const useCalculateAdjustedDebt = (web3: Web3, debtInWei: number, rate: BN) => {
    if (!web3) {
        throw new Error('web3 is not initialized');
    }
    const rawDebtInEther = web3 && web3.utils.fromWei(debtInWei.toString(), 'ether');
    const rawDebtInEtherBN = new BN(web3.utils.toWei(rawDebtInEther, 'ether'));
    const adjustedDebt = rawDebtInEtherBN.mul(rate).div(new BN(10).pow(new BN(26)));
    let adjustedDebtInEther = web3.utils.fromWei(adjustedDebt.toString(), 'ether');    
    return parseFloat(adjustedDebtInEther) / CORRECTION_RATE_VALUE;
}