import React from 'react'
import { Bar } from 'react-chartjs-2';
import styles from './CdpDetailGraph.module.css';
import { utils } from '@defisaver/tokens';

interface CdpData {
    collateral: number;
    maxCollateralWithoutLiquidation: number;
    debt: number;
    maxDebtWithoutLiquidation: number;
    ilk: string;
}

interface CdpDetailGraphProps {
    cdpData: CdpData;
}

interface TooltipItem {
    dataset: {
        label?: string;
    };
    raw: unknown;
}

const CdpDetailGraph: React.FC<CdpDetailGraphProps> = ({ cdpData }) => {
    const collateralData = {
        labels: ['Collateral', 'Liquidation Collateral Value'],
            datasets: [
                {
                label: 'Collateral',
                data: [
                    cdpData.collateral.toFixed(2),
                    cdpData.collateral - cdpData.maxCollateralWithoutLiquidation
                ],
                backgroundColor: ['rgba(87, 123, 193, 1)', '#E16A54'],
                },
            ],
        };

        const debtData = {
        labels: ['Debt', 'Debt w/o Liquidation'],
            datasets: [
                {
                label: 'Debt',
                data: [cdpData.debt.toFixed(2), cdpData.maxDebtWithoutLiquidation.toFixed(2)],
                backgroundColor: ['rgba(87, 123, 193, 1)', '#E16A54'],
                },
            ],
        };

        const options = {
            responsive: true,
            plugins: {
                tooltip: {
                callbacks: {
                    label: (tooltipItem: TooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${utils.bytesToString(cdpData.ilk)}`,
                },
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: utils.bytesToString(cdpData.ilk),
                    },
                },
            },
        };
        const options_debt = {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem: TooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw} DAI`,
                    },
                },
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'DAI',
                    },
                },
            },
        };
    return (
        <div className={styles.graphData}>
            <div className={styles.chartContainer}>
                <Bar data={collateralData} options={options} />
            </div>

            <div className={styles.chartContainer}>
                <Bar data={debtData} options={options_debt} />
            </div>
        </div>
    )
}

export default CdpDetailGraph