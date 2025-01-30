import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './AccountStatus.module.css';

interface AccountStatusProps {
  account: string | null;
  accountError: string | null;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ account, accountError }) => {
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);

  useEffect(() => {
    if (accountError) {
      setDisplayPopup(true);
    }
  }, [accountError]);

  const closeErrorPopup = () => {
    setDisplayPopup(false);
  };

  return (
    <>
      {displayPopup && accountError && (
        <div className={styles.error}>
          <span>{accountError}</span>
          <span className={styles.closePopupBtn} onClick={closeErrorPopup}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </span>
        </div>
      )}
      <div className={styles.accountWrapper}>
        <div>
          <div className={styles.accountLabel}>Account:{' '}</div>
          <div className={styles.accountData}>
            {account ? account : 'Not connected'}
          </div>
        </div>
        <div>
          {account ? (
            <span className={`${styles.accountIcon} ${styles.verified}`}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </span>
          ) : (
            <span className={`${styles.accountIcon} ${styles.notVerified}`}>
              <FontAwesomeIcon icon={faTimesCircle} />
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountStatus;
