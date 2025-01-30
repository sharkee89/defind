import React, { useState } from 'react';
import styles from './Signature.module.css';
import { useWeb3 } from '../../hooks/useWeb3';

interface SignatureDataProps {
    account: string
  }

const Signature: React.FC<SignatureDataProps> = ({ account }) => {
    const [signature, setSignature] = useState<any>(null);
    const { signMessage } = useWeb3();

    const processSignMessage = async () => {
        if (!account) {
            alert('Please connect to MetaMask first.');
            return;
        }

        const message = 'Ovo je moj CDP';

        try {
            const signedMessage = signMessage(message, account);
            setSignature(signedMessage);
        } catch (error) {
            console.error('Error signing the message:', error);
        }
    };
    return (
        <div className={styles.signMessageContainer}>
            {!signature && (
            <button onClick={processSignMessage} className={styles.button}>
                Ovo je moj CDP
            </button>
            )}
            {signature && (
            <div className={styles.signatureContainer}>
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
