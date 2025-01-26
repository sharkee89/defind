import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './AccountStatus.module.css';

interface AccountStatusProps {
  account: string | null;
  web3Initialized: boolean;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ account, web3Initialized }) => {
  return (
    <div className={styles.accountWrapper}>
      <div>
        <div className={styles.accountInfo}>Account:</div>
        <div className={styles.accountValue}>{account || 'Not connected'}</div>
      </div>
      {web3Initialized ? (
        <span className={`${styles.accountData} ${styles.verified}`}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </span>
      ) : (
        <span className={`${styles.accountData} ${styles.notVerified}`}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </span>
      )}
    </div>
  );
};

export default AccountStatus;
