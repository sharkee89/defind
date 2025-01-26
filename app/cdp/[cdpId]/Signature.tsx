import React, { useState } from 'react';
import styles from './Signature.module.css';
import Web3 from 'web3';

interface SignatureDataProps {
    web3: Web3,
    account: string
  }

const Signature: React.FC<SignatureDataProps> = ({ web3, account }) => {
    const [signature, setSignature] = useState<any>(null);

    const signMessage = async () => {
        if (!web3 || !account) {
            alert('Please connect to MetaMask first.');
            return;
        }

        const message = 'Ovo je moj CDP';

        try {
            const signedMessage = await web3.eth.personal.sign(message, account, '');
            setSignature(signedMessage);
        } catch (error) {
            console.error('Error signing the message:', error);
        }
    };
    return (
        <div className={styles.signMessageContainer}>
            {!signature && (
            <button onClick={signMessage} className={styles.button}>
                Ovo je moj CDP
            </button>
            )}
            {signature && (
            <div className={`title ${styles.signatureContainer}`}>
                <div className={styles.signature}>
                    <div className={styles.signatureDisplay}>
                    <h3>Signed Message:</h3>
                    <p>{signature}</p>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default Signature;
