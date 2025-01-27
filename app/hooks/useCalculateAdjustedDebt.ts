import BN from 'bn.js';
import { ILK, ILKS_ABI, ILKS_CONTRACT_ADDRESS } from '../constant/contract';
import { CORRECTION_RATE_VALUE } from '../constant/general_app';
import { IlkRateData } from '../types/app.type';
import Web3 from 'web3';

export const useCalculateAdjustedDebt = async (web3: Web3, debtInWei: number) => {
    const ilksContract = new web3.eth.Contract(ILKS_ABI, ILKS_CONTRACT_ADDRESS);
    const ilkRateData: IlkRateData = await ilksContract.methods.ilks(ILK).call();
    if (!ilkRateData || !ilkRateData.rate) {
        throw new Error('Failed to fetch ilk rate data');
    }
    const adjustedRate = new BN(ilkRateData.rate);
    if (!web3) {
        throw new Error('web3 is not initialized');
    }
    const rawDebtInEther = web3 && web3.utils.fromWei(debtInWei.toString(), 'ether');
    const rawDebtInEtherBN = new BN(web3.utils.toWei(rawDebtInEther, 'ether'));
    const adjustedDebt = rawDebtInEtherBN.mul(adjustedRate).div(new BN(10).pow(new BN(26)));
    let adjustedDebtInEther = web3.utils.fromWei(adjustedDebt.toString(), 'ether');    
    return parseFloat(adjustedDebtInEther) / CORRECTION_RATE_VALUE;
}