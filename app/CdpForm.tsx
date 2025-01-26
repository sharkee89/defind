import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { COLLATERAL_TYPES } from './constant/contract';
import styles from './CdpForm.module.css';
import { useDispatch } from 'react-redux';
import { updateCdpId } from './redux/reducers/appSlice';

interface CdpFormProps {
  cdpId: string;
  selectedIlk: string;
  stopAndResetCdpSearch: () => void;
  handleIlkChange: (ilk: string) => void;
  getClosestCdps: () => void;
  isLoading: boolean;
  progress: number;
  account: string | null;
}

interface InputChangeEventTarget {
  value: string;
}

interface InputChangeEvent {
  target: InputChangeEventTarget
}

const CdpForm: React.FC<CdpFormProps> = ({
  selectedIlk,
  stopAndResetCdpSearch,
  handleIlkChange,
  getClosestCdps,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChange = (e: InputChangeEvent) => {
    setQuery(e.target.value);
    dispatch(updateCdpId(e.target.value));
  };

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery);
      stopAndResetCdpSearch();
      getClosestCdps();
    }
  }, [debouncedQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.titleData}>
        <div className="title">
          <h3 className={styles.title}>Get Closest 20 CDPs</h3>
        </div>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.inputField}>
        <input
          type="text"
          placeholder="Enter CDP ID"
          value={query}
          onChange={handleChange}
          className={`${styles.input} ${styles.inputField}`}
          min="1"
        />
        </div>

        <div className={styles.dropdownWrapper}>
          <div onClick={toggleDropdown} className={styles.dropdownButton}>
            <span>{selectedIlk}</span>
            <span
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              ▼
            </span>
          </div>

          <div className={`${styles.dropdownContent} ${isDropdownOpen ? styles.dropdownContentOpen : ''}`}>
            {COLLATERAL_TYPES.map((collateral) => (
              <div
                key={collateral.value}
                onClick={() => {
                  handleIlkChange(collateral.value);
                  toggleDropdown();
                }}
                className={styles.dropdownItem}
              >
                {collateral.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CdpForm;
