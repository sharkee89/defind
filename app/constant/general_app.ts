export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,wrapped-bitcoin,usd-coin&vs_currencies=usd';
export const DEFAULT_ILK_LABEL = 'ethereum';
export const FETCH_COLLATERAL_PRICES_API = '/api/fetch_collateral_prices';
export const HARDCODED_PRICE = {
    'ethereum': {
        'usd': 3074.85
    },
    'usd-coin': {
        'usd': 1
    },
    'wrapped-bitcoin': {
        'usd': 99298
    }
}
export const MAX_CONCURRENT_CALLS: number = 5;