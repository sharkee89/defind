import React from 'react';
import styles from './LoadingProperties.module.css';
import { CIRCLE_RADIUS, STROKE_WIDTH } from '../../constant/loading_properties';
import SearchStatsChart from '../../graph/SearchStatsChart';

interface LoadingPropertiesProps {
  isLoading: boolean;
  jsonRpcCalled: number;
  searchedLowerValue: number;
  foundLowerValue: number;
  searchedGreaterValue: number;
  foundGreaterValue: number;
  progress: number;
  found: number;
  totalSearch: number;
}

const LoadingProperties: React.FC<LoadingPropertiesProps> = ({
  jsonRpcCalled,
  searchedLowerValue,
  foundLowerValue,
  searchedGreaterValue,
  foundGreaterValue,
  progress,
  found,
  totalSearch,
}) => {
  const circleRadius = CIRCLE_RADIUS;
  const circleDiameter = circleRadius * 2;
  const strokeWidth = STROKE_WIDTH;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.content}>
          <div>
            <svg
              width={circleDiameter}
              height={circleDiameter}
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius / 1.2}
                stroke="rgba(87, 123, 193, .9)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx={circleRadius}
                cy={circleRadius}
                r={circleRadius / 1.2}
                stroke="#FFEB00"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference / 1.2}
                strokeDashoffset={strokeDashoffset / 1.2}
                style={{
                  transition: 'stroke-dashoffset 0.3s ease',
                }}
              />
            </svg>
          </div>
          <div className={styles.progressText}>
            <strong>
              <span style={{ color: found > 0 ? '#FFEB00' : '#577BC1' }}>
                {found}
              </span>
              <span style={{ color: found === totalSearch ? '#FFEB00' : '#577BC1' }}>/</span>
              <span style={{ color: found === totalSearch ? '#FFEB00' : '#577BC1' }}>
                {totalSearch}
              </span>
            </strong>
          </div>
        </div>
        <div className={styles.statsContainer}>
          <div>
            <span>JSON RPC executed:</span> <span>{jsonRpcCalled}</span>
          </div>
        </div>
      </div>
      <div>
        <SearchStatsChart
          searchedLowerValue={searchedLowerValue}
          foundLowerValue={foundLowerValue}
          searchedGreaterValue={searchedGreaterValue}
          foundGreaterValue={foundGreaterValue}
        />
      </div>
    </div>
  );
};

export default LoadingProperties;
